# Используем Node.js 18
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь код проекта
COPY . .

# Собираем фронтенд
RUN npm run build

# Запускаем сервер
CMD ["npm", "start"]
 
