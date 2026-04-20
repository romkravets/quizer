import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { getCityById } from "../../src/helpers/citiesData";
import { translateRegionNameToUkrainian } from "../../src/helpers/functions";
import "../../src/app/globals.css";
import styles from "../../src/styles/city.module.css";

const TABS = [
  { key: "about", label: "Про місто" },
  { key: "attractions", label: "Визначні місця" },
  { key: "discussion", label: "Обговорення" },
  { key: "archive", label: "Архіви" },
];

export default function CityPage() {
  const router = useRouter();
  const { id, region } = router.query;

  const [city, setCity] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ name: "", text: "" });

  useEffect(() => {
    if (!id) return;
    const data = getCityById(id);
    setCity(data);
  }, [id]);

  const handleComment = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: form.name,
        text: form.text,
        date: new Date().toLocaleDateString("uk-UA"),
      },
    ]);
    setForm({ name: "", text: "" });
  };

  if (!router.isReady || !city) {
    return (
      <div className={styles.container}>
        <p style={{ color: "#888", padding: "40px 0", textAlign: "center" }}>
          Завантаження...
        </p>
      </div>
    );
  }

  const backRegion = city.region || region || "";

  return (
    <div className={styles.container}>
      {/* Back */}
      <Link
        href={`/dashboard?data=${backRegion}`}
        className={styles.backLink}
      >
        ← {translateRegionNameToUkrainian(backRegion) || "Назад"}
      </Link>

      {/* Header */}
      <header className={styles.header}>
        <h1>{city.name}</h1>
        <p className={styles.tagline}>{city.description}</p>
      </header>

      {/* Hero image */}
      {city.imageUrl && (
        <div className={styles.heroImage}>
          <Image
            src={city.imageUrl}
            alt={city.name}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      )}

      {/* Quick info */}
      <div className={styles.quickInfo}>
        <div className={styles.infoCard}>
          <span className={styles.infoLabel}>Населення</span>
          <span className={styles.infoValue}>{city.population}</span>
        </div>
        <div className={styles.infoCard}>
          <span className={styles.infoLabel}>Засноване</span>
          <span className={styles.infoValue}>{city.founded} р.</span>
        </div>
        <div className={styles.infoCard}>
          <span className={styles.infoLabel}>Регіон</span>
          <span className={styles.infoValue}>
            {translateRegionNameToUkrainian(backRegion) || backRegion}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`${styles.tab} ${activeTab === t.key ? styles.activeTab : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className={styles.tabContent}>
        {/* About */}
        {activeTab === "about" && (
          <div className={styles.tabPane}>
            <h2>Про місто</h2>
            <p className={styles.mainText}>{city.info}</p>
            <div className={styles.infoBlock}>
              <h3>Коротко</h3>
              <ul>
                <li>Населення: {city.population}</li>
                <li>Засноване: {city.founded} р.</li>
                <li>
                  Область:{" "}
                  {translateRegionNameToUkrainian(backRegion) || backRegion}
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Attractions */}
        {activeTab === "attractions" && (
          <div className={styles.tabPane}>
            <h2>Визначні місця</h2>
            {city.attractions?.length > 0 ? (
              <div className={styles.attractionsList}>
                {city.attractions.map((item, i) => (
                  <div key={i} className={styles.attractionCard}>
                    <span className={styles.attractionNumber}>{i + 1}</span>
                    <span className={styles.attractionText}>{item}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#999" }}>Дані відсутні</p>
            )}
          </div>
        )}

        {/* Discussion */}
        {activeTab === "discussion" && (
          <div className={styles.tabPane}>
            <h2>Обговорення</h2>
            <div className={styles.commentForm}>
              <h3>Поділіться враженнями</h3>
              <form onSubmit={handleComment}>
                <input
                  type="text"
                  placeholder="Ваше ім'я"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Ваш коментар..."
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  rows={4}
                  required
                />
                <button type="submit">Опублікувати</button>
              </form>
            </div>
            <div className={styles.commentsList}>
              {comments.length === 0 ? (
                <p className={styles.noComments}>
                  Коментарів ще немає. Будьте першими!
                </p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className={styles.comment}>
                    <div className={styles.commentHeader}>
                      <strong>{c.name}</strong>
                      <span className={styles.commentDate}>{c.date}</span>
                    </div>
                    <p>{c.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Archive */}
        {activeTab === "archive" && (
          <div className={styles.tabPane}>
            <h2>Архіви</h2>
            <div className={styles.archiveBox}>
              <h3>Документи та рукописи</h3>
              <p>
                Архівні матеріали щодо {city.name} зберігаються в Державному
                архіві Тернопільської області та регіональних архівних відділах.
              </p>
              <ul>
                <li>Метричні книги XVII–XIX ст.</li>
                <li>Офіційні документи австрійської доби</li>
                <li>Земельні записи та кадастри</li>
                <li>Фотографічні колекції</li>
              </ul>
            </div>
            <div className={styles.archiveBox}>
              <h3>Фотогалерея</h3>
              <p>Розділ в розробці — матеріали поступово додаються.</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={styles.related}>
        <h3>Інші міста Тернопільщини</h3>
        <Link
          href={`/dashboard?data=${backRegion}`}
          className={styles.relatedLink}
        >
          Повернутись до карти →
        </Link>
      </div>
    </div>
  );
}
