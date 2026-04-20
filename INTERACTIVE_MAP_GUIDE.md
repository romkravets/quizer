# Шаблон для інтерактивної карти регіонів

Цей шаблон містить все необхідне для реалізації інтерактивної карти з містами, попапами та сторінками мість.

## 📁 Структура файлів

```
src/
├── helpers/
│   └── citiesData.js                    # Дані про всі міста по регіонам
├── components/
│   └── RegionMap/
│       ├── InteractiveRegionMap.tsx     # Компонент інтерактивної карти
│       └── RegionMap.module.css         # Стилі карти
└── styles/
    └── city.module.css                   # Стилі сторінки міста

pages/
└── city/
    └── [id].js                           # Динамічна сторінка міста
```

## 🚀 Як використати

### 1. Оновіть `pages/dashboard.js`

Замініть статичну карту на інтерактивний компонент:

```jsx
import InteractiveRegionMap from "../src/components/RegionMap/InteractiveRegionMap";

// Замість цього простого <Image>:
// <Image src={...} ... />

// Додайте це:
<InteractiveRegionMap regionName={router.query.data} />;
```

### 2. Додайте міста до `citiesData.js`

Переглянути вже додані регіони:

- Kyiv
- Lviv
- Odessa
- Kharkiv
- Dnipropetrovsk
- Cherkasy
- Rivne
- Zakarpattia

Для кожного регіону дайте масив об'єктів з полями:

- `id`: унікальний ID (наприклад, 'kyiv-01')
- `name`: назва міста
- `x`, `y`: координати на SVG (0-100)
- `description`: короткий опис
- `population`: населення
- `founded`: рік заснування
- `info`: детальна інформація
- `attractions`: масив визначних місць
- `imageUrl`: URL зображення

### 3. Отримайте координати для вашої SVG карти

Якщо у вас вже є JPEG карта, конвертуйте її у SVG та визначте координати міст:

**Варіант 1: Ручна роботи в Figma/Illustrator**

- Завантажте JPEG як фон
- Розмістіть точки для міст
- Експортуйте як SVG
- Скопіюйте координати

**Варіант 2: Інтерактивно у компоненті**

- Виведіть координати миші при кліку на SVG
- Додайте цей код для тестування:

```jsx
<svg onClick={(e) => {
  const svg = e.currentTarget;
  const x = (e.clientX - svg.getBoundingClientRect().left) / svg.offsetWidth * 100;
  const y = (e.clientY - svg.getBoundingClientRect().top) / svg.offsetHeight * 100;
  console.log(`x: ${x.toFixed(1)}, y: ${y.toFixed(1)}`);
}}>
```

### 4. Інтегрування з Firebase (опціонально)

Для того, щоб зберігати коментарі та дані про міста в Firebase:

```jsx
// pages/city/[id].js
import { ref, push, onValue } from "firebase/database";
import { db } from "../src/components/db/firebase";

// Завантаження коментарів
useEffect(() => {
  const commentsRef = ref(db, `cities/${city.id}/comments`);
  onValue(commentsRef, (snapshot) => {
    const data = snapshot.val();
    setComments(Object.values(data || {}));
  });
}, [city.id]);

// Додавання коментаря
const handleAddComment = (e) => {
  e.preventDefault();
  const commentsRef = ref(db, `cities/${city.id}/comments`);
  push(commentsRef, {
    ...newComment,
    date: new Date().toISOString(),
  });
  setNewComment({ name: "", text: "" });
};
```

## 🎨 Налаштування стилів

### Кольори (Mistral дизайн):

- Основний золотий: `#d2a048`
- Темний: `#2c1810`
- Світлий фон: `#faf7f2`
- Підтримуючий коричневий: `#8b6f47`

### Редагування у `RegionMap.module.css`:

- Розмір точок: `.cityPoint { r: 1.2; }`
- Кольори точок: `fill="#c19a6b"`
- Анімація пульсу: Блок `@keyframes pulse`

## 🗺️ Приклади координат (для Kyiv)

```js
{
  name: 'Київ',
  x: 50,      // Посередині (0-100)
  y: 40,      // 40% від верху
}
```

## 🔧 Функції-помічники

### `getCitiesByRegion(region)`

Повертає масив міст для регіону

### `getCityById(id)`

Повертає об'єкт міста + регіон за ID

```js
const city = getCityById("kyiv-01");
// { id, name, x, y, description, ..., region: 'Kyiv' }
```

## ✨ Додаткові функції для розширення

### 1. Пошук міст

```jsx
const [searchQuery, setSearchQuery] = useState("");
const filteredCities = cities.filter((c) =>
  c.name.toLowerCase().includes(searchQuery.toLowerCase()),
);
```

### 2. Фільтрація за населенням

```jsx
const largeCities = cities.filter((c) => parseFloat(c.population) > 0.1);
```

### 3. Історичні дати

```jsx
const oldestCity = cities.reduce((a, b) =>
  parseInt(a.founded) < parseInt(b.founded) ? a : b,
);
```

### 4. Галерея фотографій

```jsx
// pages/city/[id].js
const [galleryImages, setGalleryImages] = useState([]);

useEffect(() => {
  // Завантажте фотографії з Firebase Storage
  const imagesRef = ref(storage, `city-photos/${city.id}`);
  listAll(imagesRef).then((res) => {
    // ...
  });
}, [city.id]);
```

### 5. Карта маршрутів

```jsx
// Додайте лінії до SVG
cities.map((city, idx) =>
  idx < cities.length - 1 ? (
    <line
      x1={city.x}
      y1={city.y}
      x2={cities[idx + 1].x}
      y2={cities[idx + 1].y}
    />
  ) : null,
);
```

## 📱 Мобільна оптимізація

Компонент вже включає `@media (max-width: 768px)` в CSS для адаптацій.

Можна додати:

```css
/* Менша точка на мобілі */
@media (max-width: 640px) {
  .cityPoint {
    r: 1;
  }
}
```

## 🐛 Поширені проблеми

**SVG точки не кликабельні:**

- Переконайтесь, що `onClick` додана до `<circle>`
- Встановіть `cursor: pointer`

**Координати неправильні:**

- Переконайтесь, що вибрали мобільний вигляд (100×100 SVG)
- Тестуйте поmúsClickвиводіть координати

**CSS не працює:**

- Переконайтесь, що це CSS Module (`.module.css`)
- Імпортуйте як: `import styles from './RegionMap.module.css'`

## 📚 Наступні кроки

1. ✅ Додайте координати для всіх міст
2. ✅ Інтегруйте в `dashboard.js`
3. ⭕ Додайте дані до Firebase
4. ⭕ Налаштуйте бекенд для зберігання коментарів
5. ⭕ Додайте галерею фотографій
6. ⭕ Налаштуйте пошук та фільтрацію

---

**Потреби в допомозі?** Запитайте про конкретні аспекти!
