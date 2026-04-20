import { useState } from "react";
import styles from "./RegionMap.module.css";

const TABS = [
  { key: "history", label: "Історія" },
  { key: "archives", label: "Архіви" },
  { key: "interesting", label: "Цікаві місця" },
  { key: "photos", label: "Фото" },
];

export default function PlaceDrawer({ place, onClose }) {
  const [activeTab, setActiveTab] = useState("history");

  if (!place) return null;

  return (
    <div className={styles.drawerOverlay} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.drawerHeader}>
          <h2 className={styles.drawerTitle}>{place.name}</h2>
          <button className={styles.drawerClose} onClick={onClose} aria-label="Закрити">
            ✕
          </button>
        </div>

        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.drawerBody}>
          {activeTab === "history" && (
            <p className={styles.historyText}>{place.history}</p>
          )}

          {activeTab === "archives" && (
            <div className={styles.list}>
              {place.archives.length === 0 ? (
                <p className={styles.empty}>Архівні дані відсутні</p>
              ) : (
                place.archives.map((arc, i) => (
                  <div key={i} className={styles.card}>
                    <h3 className={styles.cardTitle}>{arc.title}</h3>
                    <p className={styles.cardDesc}>{arc.description}</p>
                    {arc.address && (
                      <p className={styles.cardMeta}>📍 {arc.address}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "interesting" && (
            <div className={styles.list}>
              {place.interesting.length === 0 ? (
                <p className={styles.empty}>Даних немає</p>
              ) : (
                place.interesting.map((item, i) => (
                  <div key={i} className={styles.card}>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <p className={styles.cardDesc}>{item.description}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "photos" && (
            <div className={styles.photoGrid}>
              {place.photos.length === 0 ? (
                <p className={styles.empty}>Фото відсутні</p>
              ) : (
                place.photos.map((photo, i) => (
                  <div key={i} className={styles.photoItem}>
                    <img src={photo.url} alt={photo.caption} className={styles.photo} />
                    <p className={styles.photoCaption}>{photo.caption}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
