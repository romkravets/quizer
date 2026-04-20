import { useState } from "react";
import { useRouter } from "next/router";
import styles from "./RegionMap.module.css";

export default function RegionMap({ region, placesData }) {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState(null);

  const places = placesData?.places ?? [];

  return (
    <div className={styles.mapWrapper}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/region-map/${region}.jpeg`}
        alt={region}
        className={styles.mapImage}
        draggable={false}
      />

      {places.map((place) => (
        <button
          key={place.id}
          className={`${styles.pin} ${hoveredId === place.id ? styles.pinHovered : ""}`}
          style={{ left: `${place.x}%`, top: `${place.y}%` }}
          onClick={() => router.push(`/city/${place.id}?region=${region}`)}
          onMouseEnter={() => setHoveredId(place.id)}
          onMouseLeave={() => setHoveredId(null)}
          aria-label={place.name}
        >
          <span className={styles.pinDot} />
          <span className={styles.pinPulse} />
          <span className={styles.pinLabel}>{place.name}</span>
        </button>
      ))}
    </div>
  );
}
