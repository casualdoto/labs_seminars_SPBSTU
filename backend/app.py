import os
import psycopg2
from flask import Flask, request, jsonify
from flask_cors import CORS
from joblib import load

# Настройки подключения к локальному PostgreSQL
DATABASE = {
    'host': 'db',  # Имя сервиса в Docker Compose
    'port': '5432',
    'dbname': 'SPBSTU_medical',
    'user': 'postgres',
    'password': 'password',
    'sslmode': 'disable'  # Отключаем SSL для локальной базы
}

# Загрузка модели
with open('svm_model.pkl', 'rb') as file:
    model = load(file)

# Создание приложения Flask
app = Flask(__name__)
CORS(app)

def get_db_connection():
    return psycopg2.connect(
        host=DATABASE['host'],
        port=DATABASE['port'],
        dbname=DATABASE['dbname'],
        user=DATABASE['user'],
        password=DATABASE['password'],
        sslmode=DATABASE['sslmode']
    )

# Создание таблиц, если они не существуют
def create_tables():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Создаем таблицу users, если ее нет
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        family_name VARCHAR(100),
        phone VARCHAR(15) UNIQUE
    );
    ''')

    # Создаем таблицу medical_results, если ее нет (без новых полей)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS medical_results (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id),
        gender INTEGER,
        age INTEGER,
        smoking INTEGER,
        anxiety INTEGER,
        peer_pressure INTEGER,
        chronic_disease INTEGER,
        fatigue INTEGER,
        allergy INTEGER,
        wheezing INTEGER,
        alcohol INTEGER,
        coughing INTEGER,
        shortness_of_breath INTEGER,
        swallowing_difficulty INTEGER,
        chest_pain INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ''')

    # Добавляем новые колонки, если они отсутствуют
    cursor.execute("ALTER TABLE medical_results ADD COLUMN IF NOT EXISTS predicted_class INTEGER CHECK (predicted_class IN (0, 1));")
    cursor.execute("ALTER TABLE medical_results ADD COLUMN IF NOT EXISTS probability_class NUMERIC(5,2) CHECK (probability_class BETWEEN 0 AND 100);")

    conn.commit()
    cursor.close()
    conn.close()

@app.route('/')
def home():
    return "Flask app is running!"

@app.route('/db_test', methods=['GET'])
def db_test():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1;")
        cursor.close()
        conn.close()
        return jsonify({'db_status': 'Connected successfully'})
    except Exception as e:
        return jsonify({'error': f'Database connection error: {str(e)}'}), 500

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    required_keys = [
        'name', 'family_name', 'phone', 'gender', 'age', 'smoking',
        'anxiety', 'peer_pressure', 'chronic_disease', 'fatigue', 'allergy',
        'wheezing', 'alcohol', 'coughing', 'shortness_of_breath',
        'swallowing_difficulty', 'chest_pain'
    ]
    missing_keys = [key for key in required_keys if key not in data]

    if missing_keys:
        return jsonify({'error': f'Missing keys: {missing_keys}'}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Проверяем, существует ли пользователь
        cursor.execute(
            "SELECT user_id FROM users WHERE name = %s AND family_name = %s AND phone = %s;",
            (data['name'], data['family_name'], data['phone'])
        )
        user = cursor.fetchone()

        if not user:
            cursor.execute(
                "INSERT INTO users (name, family_name, phone) VALUES (%s, %s, %s) RETURNING user_id;",
                (data['name'], data['family_name'], data['phone'])
            )
            user_id = cursor.fetchone()[0]
        else:
            user_id = user[0]

        # Формируем входные данные
        features = [
            int(data['gender']), int(data['age']),
            int(data['smoking']), int(data['anxiety']), int(data['peer_pressure']),
            int(data['chronic_disease']), int(data['fatigue']), int(data['allergy']),
            int(data['wheezing']), int(data['alcohol']), int(data['coughing']),
            int(data['shortness_of_breath']), int(data['swallowing_difficulty']), int(data['chest_pain'])
        ]

        # Делаем предсказание
        prediction = model.predict([features])[0]  # 0 или 1
        probability = model.predict_proba([features])[0][1] * 100  # Вероятность (0-100)

        # Сохраняем результат в БД
        cursor.execute(
            """
            INSERT INTO medical_results (
                user_id, gender, age, smoking, anxiety,
                peer_pressure, chronic_disease, fatigue, allergy, wheezing,
                alcohol, coughing, shortness_of_breath, swallowing_difficulty,
                chest_pain, created_at, predicted_class, probability_class
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), %s, %s);
            """,
            (
                user_id, data['gender'], data['age'], data['smoking'], data['anxiety'],
                data['peer_pressure'], data['chronic_disease'], data['fatigue'], data['allergy'],
                data['wheezing'], data['alcohol'], data['coughing'], data['shortness_of_breath'],
                data['swallowing_difficulty'], data['chest_pain'], int(prediction), round(probability, 2)
            )
        )
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'predicted_class': int(prediction), 'probability_class': round(probability, 2)})

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    create_tables()
    app.run(host='0.0.0.0', port=5000, debug=True)
