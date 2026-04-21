import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import styles from "./CityList.module.css";
import { citiesData } from "../../helpers/citiesData";

export default function CityList({ region }) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const cities = citiesData[region]?.cities ?? [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cities;
    return cities.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
    );
  }, [cities, search]);

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((city) => {
      const letter = city.name[0].toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter].push(city);
    });
    return Object.entries(map).sort(([a], [b]) =>
      a.localeCompare(b, "uk")
    );
  }, [filtered]);

  if (cities.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🗺</span>
          <p className={styles.emptyTitle}>Дані незабаром</p>
          <p className={styles.emptyText}>
            Міста та села цієї області поки що в розробці
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.searchRow}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>⌕</span>
            <input
              className={styles.search}
              type="text"
              placeholder="Пошук міста чи села..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
          </div>
          <span className={styles.countBadge}>{filtered.length} місць</span>
        </div>
      </div>

      <div className={styles.list}>
        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>🔍</span>
            <p className={styles.emptyTitle}>Нічого не знайдено</p>
            <p className={styles.emptyText}>Спробуйте інший запит</p>
          </div>
        ) : (
          grouped.map(([letter, items]) => (
            <div key={letter} className={styles.letterGroup}>
              <div className={styles.letterLabel}>{letter}</div>
              {items.map((city) => (
                <button
                  key={city.id}
                  className={styles.cityRow}
                  onClick={() =>
                    router.push(`/city/${city.id}?region=${region}`)
                  }
                >
                  <span className={styles.cityDot} />
                  <div className={styles.cityInfo}>
                    <p className={styles.cityName}>{city.name}</p>
                    {city.description && (
                      <p className={styles.cityDesc}>{city.description}</p>
                    )}
                  </div>
                  <div className={styles.cityTags}>
                    {city.founded && (
                      <span className={styles.tag}>з {city.founded} р.</span>
                    )}
                    {city.population && (
                      <span className={styles.tag}>{city.population}</span>
                    )}
                  </div>
                  <span className={styles.arrow}>›</span>
                </button>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
