import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { getCityById } from '../../src/helpers/citiesData';
import '../../src/app/globals.css';
import styles from '../../src/styles/city.module.css';

const CityPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [city, setCity] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ name: '', text: '' });
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    if (id) {
      const cityData = getCityById(id);
      setCity(cityData);
      // Можна завантажити коментарі з Firebase
    }
  }, [id]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.name.trim() && newComment.text.trim()) {
      setComments([
        ...comments,
        {
          id: Date.now(),
          ...newComment,
          date: new Date().toLocaleDateString('uk-UA'),
        },
      ]);
      setNewComment({ name: '', text: '' });
    }
  };

  if (!router.isReady || !city) {
    return (
      <div className={styles.container}>
        <p>Завантаження...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <Link href={`/dashboard?data=${city.region}`} className={styles.backLink}>
          ← Повернутися до {city.region}
        </Link>
        <h1>{city.name}</h1>
        <p className={styles.tagline}>{city.description}</p>
      </header>

      {/* Hero */}
      {city.imageUrl && (
        <div className={styles.heroImage}>
          <Image
            src={city.imageUrl}
            alt={city.name}
            layout="fill"
            objectFit="cover"
            placeholder="blur"
            blurDataURL="data:image/jpeg,/9j/4AAQSkZJRg..."
          />
        </div>
      )}

      {/* Quick Info */}
      <div className={styles.quickInfo}>
        <div className={styles.infoCard}>
          <span className={styles.infoLabel}>Населення</span>
          <span className={styles.infoValue}>{city.population}</span>
        </div>
        <div className={styles.infoCard}>
          <span className={styles.infoLabel}>Заснована</span>
          <span className={styles.infoValue}>{city.founded}</span>
        </div>
        <div className={styles.infoCard}>
          <span className={styles.infoLabel}>Регіон</span>
          <span className={styles.infoValue}>{city.region}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'about' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('about')}
        >
          📖 Про місто
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'attractions' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('attractions')}
        >
          ⭐ Визначні місця
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'discussion' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('discussion')}
        >
          💬 Обговорення
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'archive' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('archive')}
        >
          📚 Архіви
        </button>
      </div>

      {/* Content */}
      <div className={styles.tabContent}>
        {/* About Tab */}
        {activeTab === 'about' && (
          <div className={styles.tabPane}>
            <h2>Про місто</h2>
            <p className={styles.mainText}>{city.info}</p>

            <div className={styles.historyBox}>
              <h3>📜 Історія</h3>
              <p>
                Місто {city.name} було засновано в {city.founded}. Протягом
                secolo це місто грало важливу роль у розвитку регіону. Сьогодні
                це важливий культурний, економічний та освітній центр.
              </p>
            </div>

            <div className={styles.highlightsBox}>
              <h3>✨ Цікаві факти</h3>
              <ul>
                <li>Населення: {city.population}</li>
                <li>Заснована: {city.founded}</li>
                <li>Розташування: {city.region}</li>
                <li>Один з історичних центрів України</li>
              </ul>
            </div>
          </div>
        )}

        {/* Attractions Tab */}
        {activeTab === 'attractions' && (
          <div className={styles.tabPane}>
            <h2>Визначні місця</h2>
            {city.attractions && city.attractions.length > 0 ? (
              <div className={styles.attractionsList}>
                {city.attractions.map((attraction, idx) => (
                  <div key={idx} className={styles.attractionCard}>
                    <div className={styles.attractionNumber}>{idx + 1}</div>
                    <div className={styles.attractionInfo}>
                      <h4>{attraction}</h4>
                      <p>
                        Одне з найцікавіших місць міста {city.name}. Туристи часто
                        відвідують це місце, щоб дізнатися більше про історію та
                        культуру регіону.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Немає доступних визначних місць</p>
            )}
          </div>
        )}

        {/* Discussion Tab */}
        {activeTab === 'discussion' && (
          <div className={styles.tabPane}>
            <h2>Обговорення про {city.name}</h2>

            {/* Add Comment */}
            <div className={styles.commentForm}>
              <h3>Поділіться своїми враженнями</h3>
              <form onSubmit={handleAddComment}>
                <input
                  type="text"
                  placeholder="Ваше ім'я"
                  value={newComment.name}
                  onChange={(e) =>
                    setNewComment({ ...newComment, name: e.target.value })
                  }
                  required
                />
                <textarea
                  placeholder="Ваш коментар..."
                  value={newComment.text}
                  onChange={(e) =>
                    setNewComment({ ...newComment, text: e.target.value })
                  }
                  rows="4"
                  required
                ></textarea>
                <button type="submit">Опублікувати коментар</button>
              </form>
            </div>

            {/* Comments List */}
            <div className={styles.commentsList}>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className={styles.comment}>
                    <div className={styles.commentHeader}>
                      <strong>{comment.name}</strong>
                      <span className={styles.commentDate}>{comment.date}</span>
                    </div>
                    <p>{comment.text}</p>
                  </div>
                ))
              ) : (
                <p className={styles.noComments}>
                  Коментарів ще немає. Будьте першими!
                </p>
              )}
            </div>
          </div>
        )}

        {/* Archive Tab */}
        {activeTab === 'archive' && (
          <div className={styles.tabPane}>
            <h2>Архіви {city.name}</h2>
            <div className={styles.archiveBox}>
              <h3>📰 Стародавні газети та документи</h3>
              <p>
                Архіви щодо міста {city.name} містять цінні історичні документи,
                газети, фотографії та інші матеріали, які розповідають про
                розвиток міста протягом століть.
              </p>
              <ul>
                <li>Газетні вирізки (1900-1950 р.р.)</li>
                <li>Офіціальні документи</li>
                <li>Фотографічні колекції</li>
                <li>Історичні дослідження</li>
              </ul>
            </div>

            <div className={styles.archiveBox}>
              <h3>🖼️ Фотогалерея</h3>
              <p>Сторінка під розбудову - постійно додаються нові матеріали</p>
            </div>
          </div>
        )}
      </div>

      {/* Related Cities */}
      <div className={styles.related}>
        <h3>Інші міста в регіоні {city.region}</h3>
        <Link href={`/dashboard?data=${city.region}`} className={styles.relatedLink}>
          Перегляньте всі міста регіону →
        </Link>
      </div>
    </div>
  );
};

export default CityPage;
