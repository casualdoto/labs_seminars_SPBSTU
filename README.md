# labs_seminars_SPBSTU

## 1. Клонирование репозитория
Открываем **cmd** и выполняем команды:

```sh
git clone https://github.com/casualdoto/labs_seminars_SPBSTU.git
```

## 2. Запуск через Docker
Открываем **терминал в Docker Desktop** надо перейти в папку labs_seminars_SPBSTU (смотря где у вас будет храниться, надо написать путь до папки):
```sh
cd labs_seminars_SPBSTU
```
**Дальше запускаем сборку**
```sh
docker-compose up --build
```

## 3. Если надо полключиться через DBeaver к БД
Host: localhost
Port: 5432
Database: SPBSTU_medical
Username: postgres
Password: password

## 4. Сервер работает тут
**http://localhost:3000/**
