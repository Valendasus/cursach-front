# 📦 Развёртывание RentTech на GitHub Pages

Проект готов к автоматическому развёртыванию на GitHub Pages. Выполните следующие шаги:

## 1️⃣ Инициализация Git репозитория

```bash
# Инициализируйте репозиторий (если ещё не инициализирован)
git init
git add .
git commit -m "Initial commit: RentTech project configuration for GitHub Pages"
```

## 2️⃣ Создание репозитория на GitHub

1. Перейдите на [GitHub.com](https://github.com)
2. Нажмите **New** для создания нового репозитория
3. Назовите его `cursach-front` (или любое другое имя)
4. **Не инициализируйте** README, .gitignore, лицензию
5. Нажмите **Create repository**

## 3️⃣ Привязка к удалённому репозиторию

```bash
# Замените USERNAME на ваше имя пользователя GitHub
git branch -M main
git remote add origin https://github.com/USERNAME/cursach-front.git
git push -u origin main
```

## 4️⃣ Настройка Pages в GitHub

1. Перейдите в **Settings** вашего репозитория
2. В левой панели нажмите **Pages** (обычно внизу)
3. В разделе **Source** выберите:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. Нажмите **Save**

## 5️⃣ GitHub Actions (автоматический)

- При каждом `push` в ветку `main` GitHub Actions автоматически:
  - 📥 Установит зависимости (`npm install`)
  - 🔨 Соберёт проект (`npm run build`)
  - 📤 Развернёт в папку `gh-pages`
  - 🌐 Опубликует на `https://USERNAME.github.io/cursach-front`

Процесс можно отследить во вкладке **Actions** в репозитории.

## 📋 Что уже изменено в проекте

✅ **vite.config.js** — добавлен `base: '/cursach-front/'`
✅ **Все .html файлы** — ссылки с `/index.html` на `./index.html`
✅ **src/main.js** — путь DATA_URL с `/data/equipment.json` на `./data/equipment.json`
✅ **.github/workflows/deploy.yml** — GitHub Actions workflow для автоматического деплоя

## 🚀 Как работает после развёртывания

После завершения деплоя ваш сайт будет доступен по адресу:

```
https://USERNAME.github.io/cursach-front
```

Все интернал-ссылки работают корректно благодаря относительным путям и `base` в Vite.

## ⚙️ Локальное тестирование перед пушем

```bash
# Собрать проект
npm run build

# Просмотреть собранный проект локально
npm run preview
```

## 🔧 Если что-то не работает

**Проблема:** Pages не обновляется после push'а

- Проверьте вкладку **Actions** — там будут ошибки сборки

**Проблема:** Ссылки ломаются

- Убедитель, что используются относительные пути `./file.html`
- Проверьте `base` в `vite.config.js`

**Проблема:** Стили или скрипты не загружаются

- Это часто признак неправильного `base`
- Откройте DevTools (F12) и посмотрите Network tab

## 📝 Важные замечания

- Используется **MPA (Multi-Page Application)**, каждая страница — отдельный HTML
- Курсы валют загружаются в реальном времени с API
- Данные оборудования хранятся в `public/data/equipment.json`
- Мобильное меню работает на чистом JavaScript (без фреймворков)

---

**Готово!** После выполнения этих шагов сайт будет автоматически развёртываться при каждом обновлении кода.
