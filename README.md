# labs_seminars_SPBSTU

## 1. Клонирование репозитория
Откройте терминал **(cmd, PowerShell или Terminal)** и выполните команду:

```sh
git clone https://github.com/casualdoto/labs_seminars_SPBSTU.git
```

## 2. Запуск проекта через Docker
Перейдите в папку с проектом (укажите путь в зависимости от расположения репозитория):
```sh
cd labs_seminars_SPBSTU
```
**Затем выполните команду для сборки и запуска контейнеров:**
```sh
docker-compose up --build
```

## 3. Подключение к базе данных
Используйте следующие параметры для подключения:
- Host: localhost
- Port: 5432
- Database: SPBSTU_medical
- Username: postgres
- Password: password

## 4. Доступ к веб-интерфейсу
После запуска приложение будет доступно по адресу:
**http://localhost:3000/**
