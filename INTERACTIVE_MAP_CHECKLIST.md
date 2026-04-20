# ✅ Шаблон для інтерактивної карти - ГОТОВО!

## 📦 Що вам було дано

Повний шаблон для реалізації інтерактивної карти з такими компонентами:

### 1. **Дані про міста** (`src/helpers/citiesData.js`)

- Структурований масив всіх міст по регіонам
- Функції: `getCitiesByRegion()`, `getCityById()`
- Приклади для 8 регіонів (Kyiv, Lviv, Odessa, Kharkiv, Dnipropetrovsk, Cherkasy, Rivne, Zakarpattia)

### 2. **Компонент інтерактивної карти** (`src/components/RegionMap/`)

- `InteractiveRegionMap.tsx` - основний компонент з SVG
- `RegionMap.module.css` - стилі в дизайні Mistral
- Функції:
  - 🖱️ Клік на точку міста → показати інформацію
  - ✨ Наведення миші → пульсуюча анімація
  - 📍 Легенда міст зліва
  - 🎨 Адміралька золота палітра

### 3. **Сторінка деталей міста** (`pages/city/[id].js`)

- Динамічна сторінка для кожного міста
- 4 вкладки:
  - 📖 **Про місто** - історія, інформація
  - ⭐ **Визначні місця** - список атракцій
  - 💬 **Обговорення** - коментарі від користувачів
  - 📚 **Архіви** - історичні матеріали
- Форма для додавання коментарів

### 4. **Стилі для сторінки міста** (`src/styles/city.module.css`)

- Повна стилізація в темі Mistral
- Адаптивна мобільна верстка
- Плавні переходи та анімації

### 5. **Допоміжні файли**

- `INTERACTIVE_MAP_GUIDE.md` - детальна документація
- `INTEGRATION_EXAMPLE.js` - приклад інтеграції в dashboard.js
- `src/components/CoordinateFinder.jsx` - інструмент для визначення координат

---

## 🚀 Перші кроки

### Крок 1️⃣: Визначте координати міст

**Використайте інструмент координатора:**

```jsx
// Додайте тимчасово в якусь тестову сторінку:
import CoordinateFinder from "@/components/CoordinateFinder";

export default function TestPage() {
  return <CoordinateFinder regionName="YourRegion" />;
}
```

**Що робить:**

1. Виведе карту вашого регіону
2. При кліку попросить назву міста
3. Автоматично визначить X, Y координати
4. Кнопка "📋 Копіювати в код" згенерує готовий JavaScript

### Крок 2️⃣: Оновіть `citiesData.js`

Замініть приклади реальними даними для ваших регіонів:

```js
export const citiesData = {
  Kyiv: [
    {
      id: "kyiv-01",
      name: "Київ",
      x: 50, // ← ці координати з інструменту!
      y: 40,
      description: "...",
      // ... інші поля
    },
  ],
  // інші регіони...
};
```

### Крок 3️⃣: Інтегруйте в dashboard.js

Замініть статичну карту на компонент:

```jsx
import InteractiveRegionMap from "../src/components/RegionMap/InteractiveRegionMap";

// В JSX:
<InteractiveRegionMap regionName={router.query.data} />;
```

Дивіться `INTEGRATION_EXAMPLE.js` для повного прикладу.

### Крок 4️⃣: Тестуйте

```bash
npm run dev
# Перейдіть на /dashboard?data=Kyiv
# Кліки на карту повинні показувати інформацію про міста
```

---

## 🎯 Функціональність

### ✅ Вже реалізовано:

- [x] SVG карта з точками міст
- [x] Попап з інформацією при кліку
- [x] Легенда міст
- [x] Анімації та переходи
- [x] Сторінка міста з вкладками
- [x] Форма для коментарів
- [x] Адаптивна верстка
- [x] Дизайн в темі Mistral

### ⭕ Що можна додати:

1. **Firebase інтеграція для коментарів**

   ```js
   // pages/city/[id].js
   import { push, ref } from "firebase/database";

   const handleAddComment = () => {
     push(ref(db, `cities/${city.id}/comments`), {
       name,
       text,
       date: new Date().toISOString(),
     });
   };
   ```

2. **Пошук міст**

   ```jsx
   const [search, setSearch] = useState("");
   const filtered = cities.filter((c) =>
     c.name.toLowerCase().includes(search.toLowerCase()),
   );
   ```

3. **Фільтрація за розміром**

   ```jsx
   const [minPop, setMinPop] = useState(0.1);
   const filtered = cities.filter((c) => parseFloat(c.population) >= minPop);
   ```

4. **Галерея фотографій для міста**
   - Завантаження у Firebase Storage
   - Карусель з Fancybox

5. **Дорожна карта між містами**
   - Лінії у SVG
   - Розрахунок відстаней

6. **Історичні дати та события**
   - Часова шкала
   - Фільтрація по роках

---

## 📁 Структура файлів

```
quizer/
├── src/
│   ├── helpers/
│   │   └── citiesData.js                    ✅ Дані про міста
│   ├── components/
│   │   ├── RegionMap/
│   │   │   ├── InteractiveRegionMap.tsx    ✅ Карта
│   │   │   └── RegionMap.module.css        ✅ Стилі
│   │   └── CoordinateFinder.jsx            ✅ Інструмент координат
│   └── styles/
│       └── city.module.css                  ✅ Стилі міста
├── pages/
│   ├── dashboard.js                        ⏳ Потребує оновлення
│   └── city/
│       └── [id].js                         ✅ Сторінка міста
├── INTERACTIVE_MAP_GUIDE.md                ✅ Документація
└── INTEGRATION_EXAMPLE.js                  ✅ Приклад інтеграції
```

---

## 🎨 Дизайн: Mistral палітра

Все вже налаштовано:

- **Основний золотий:** `#d2a048`
- **Темний:** `#2c1810`
- **Світлий фон:** `#faf7f2`
- **Тіні:** `rgba(193, 154, 107, 0.1)`

Редагуйте у CSS модулях якщо потрібні зміни.

---

## ❓ Поширені питання

**Q: Як отримати координати для мого регіону?**
A: Використайте `CoordinateFinder.jsx` - просто кліньте на карту!

**Q: Чи можна змінити колірну схему?**
A: Так! Редагуйте `RegionMap.module.css` та `city.module.css`

**Q: Як додати новий регіон?**
A: Додайте масив у `citiesData.js`:

```js
MyRegion: [
  { id: '...', name: '...', x, y, ... }
]
```

**Q: Чи можна зберігати дані у Firebase?**
A: Так! Дивись INTERACTIVE_MAP_GUIDE.md розділ "Integration with Firebase"

---

## 🔧 Налагодження

**Точки не видно на карті:**

- Перевірте що координати x, y від 0 до 100
- Переконайтесь що Регіон в `citiesData.js` правильно названий

**Клік не працює:**

- Перевірте браузер консоль (F12) на помилки
- Переконайтесь що компонент правильно імпортований

**Стилі не застосовуються:**

- Переконайтесь що це `.module.css`
- Переконайтесь що імпортуєте як `import styles from '...'`

---

## 📚 Дальше читайте:

1. `INTERACTIVE_MAP_GUIDE.md` - детальна документація
2. `INTEGRATION_EXAMPLE.js` - приклад коду
3. Код компонентів добре задокументований коментарями

---

**Успіхів у розробці! 🚀**

Якщо маєте питання - запитайте!
