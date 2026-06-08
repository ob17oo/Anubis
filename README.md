# 🎟️ Anubis

### Онлайн-сервис поиска, создания и бронирования мероприятий

> **Дипломный проект**
>
> **«Разработка веб-приложения по бронированию и созданию мероприятий для сотрудников ООО „АйТи-Дон“, г. Ростов-на-Дону»**

---

## 📋 О проекте

Anubis — современный веб-сервис для поиска, публикации и бронирования мероприятий.

Платформа позволяет пользователям находить интересующие события, просматривать подробную информацию, выбирать категории билетов и оформлять бронирование в несколько кликов.

Сервис объединяет организаторов мероприятий и посетителей в едином цифровом пространстве, предоставляя удобные инструменты для публикации событий, управления билетами и отслеживания бронирований.

---

## ✨ Основные возможности

### 👤 Пользователь

* Просмотр мероприятий
* Поиск и фильтрация событий
* Просмотр подробной информации
* Выбор категории билета
* Бронирование билетов
* Управление заказами
* Личный кабинет
* Адаптивный интерфейс

### 🛠️ Администратор

* Создание мероприятий
* Редактирование мероприятий
* Удаление мероприятий
* Управление билетами
* Настройка типов билетов
* Управление пользователями
* Просмотр статистики
* Контроль бронирований

---

## 🚀 Технологический стек

### Frontend

![Next.js](https://img.shields.io/badge/Next.js-000?style=for-the-badge\&logo=nextdotjs\&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge\&logo=tailwind-css\&logoColor=white)

### UI

![ShadcnUI](https://img.shields.io/badge/shadcn/ui-black?style=for-the-badge)
![Lucide](https://img.shields.io/badge/Lucide-000000?style=for-the-badge)

### Backend & Database

![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge\&logo=supabase\&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge\&logo=postgresql\&logoColor=white)

### Deployment

![Vercel](https://img.shields.io/badge/Vercel-000?style=for-the-badge\&logo=vercel\&logoColor=white)

### Version Control

![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge\&logo=git\&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge\&logo=github\&logoColor=white)

---

## 🎯 Цель проекта

Разработка веб-приложения для публикации, поиска и бронирования мероприятий, а также предоставления удобных инструментов для взаимодействия между организаторами событий и посетителями.

---

## 📂 Структура проекта

```bash
src
├── app
├── components
├── features
├── hooks
├── lib
├── services
├── types
└── utils

public
supabase
```

---

## 🏗️ Архитектура

- Frontend — Next.js, React, TypeScript
- Backend — Next.js Server Actions и API Routes
- База данных — PostgreSQL (Supabase)
- Авторизация — Supabase Auth
- Хранение файлов — Supabase Storage
- Деплой — Vercel


## ⚙️ Установка и запуск

### 1. Клонировать репозиторий

```bash
git clone https://github.com/ob17oo/anubis.git
```

### 2. Перейти в проект

```bash
cd anubis
```

### 3. Установить зависимости

```bash
npm install
```

### 4. Создать файл окружения

```bash
.env.local
```

### 5. Добавить переменные окружения

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### 6. Запустить проект

```bash
npm run dev
```

Приложение будет доступно по адресу:

```text
http://localhost:3000
```

## 🌐 Демо

https://anubis-virid.vercel.app/
