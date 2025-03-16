# Используем Python 3.9
FROM python:3.9

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файлы проекта в контейнер
COPY requirements.txt .
COPY app.py .
COPY svm_model.pkl .

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Запускаем Flask при старте контейнера
CMD ["python", "app.py"]
  
