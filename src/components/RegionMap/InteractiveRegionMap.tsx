import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { getCitiesByRegion } from '../../helpers/citiesData';
import styles from './RegionMap.module.css';

function FitBounds({ bounds }: { bounds: [[number, number], [number, number]] | null }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) map.fitBounds(bounds, { padding: [20, 20] });
  }, [bounds, map]);
  return null;
}

export default function InteractiveRegionMap({ regionName }: { regionName: string }) {
  const [activeCity, setActiveCity] = useState<any>(null);
  // isMounted gates MapContainer — only render after Leaflet is fully loaded in browser
  const [isMounted, setIsMounted] = useState(false);
  const iconRef = useRef<any>(null);
  const { bounds, center, zoom, cities } = getCitiesByRegion(regionName);

  useEffect(() => {
    import('leaflet').then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/marker-icon-2x.png',
        iconUrl: '/marker-icon.png',
        shadowUrl: '/marker-shadow.png',
      });
      iconRef.current = new L.Icon({
        iconUrl: '/marker-icon-2x.png',
        shadowUrl: '/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });
      // Only set isMounted AFTER icon is ready — prevents MapContainer from
      // rendering before Leaflet is initialized (which caused the style crash)
      setIsMounted(true);
    });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.mapWrapper}>
        {!isMounted ? (
          <div style={{ height: '420px', width: '100%', borderRadius: '8px', background: '#f0ebe3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b7355' }}>
            Завантаження карти…
          </div>
        ) : (
        // key={regionName} forces a clean remount when the region changes —
        // Leaflet's MapContainer cannot reinitialize on the same DOM node
        <MapContainer
          key={regionName}
          center={center as [number, number]}
          zoom={zoom}
          style={{ height: '420px', width: '100%', borderRadius: '8px' }}
          scrollWheelZoom={false}
        >
          {bounds && <FitBounds bounds={bounds} />}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {cities.map((city: any) => (
            <Marker
              key={city.id}
              position={[city.lat, city.lng]}
              icon={iconRef.current || undefined}
              eventHandlers={{ click: () => setActiveCity(city) }}
            >
              <Popup>
                <strong>{city.name}</strong><br />
                {city.description}<br />
                <small>Населення: {city.population}</small>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        )}
      </div>

      {/* Інформаційна панель про місто */}
      {activeCity && (
        <div className={styles.cityInfoPanel}>
          <button
            className={styles.closeBtn}
            onClick={() => setActiveCity(null)}
          >
            ✕
          </button>

          <h3>{activeCity.name}</h3>
          <p className={styles.subtitle}>{activeCity.description}</p>

          <div className={styles.details}>
            <div className={styles.detail}>
              <span className={styles.label}>Населення:</span>
              <span>{activeCity.population}</span>
            </div>
            <div className={styles.detail}>
              <span className={styles.label}>Заснована:</span>
              <span>{activeCity.founded}</span>
            </div>
          </div>

          <p className={styles.info}>{activeCity.info}</p>

          {activeCity.attractions?.length > 0 && (
            <div className={styles.attractions}>
              <h4>Визначні місця:</h4>
              <ul>
                {activeCity.attractions.map((attr: string, idx: number) => (
                  <li key={idx}>{attr}</li>
                ))}
              </ul>
            </div>
          )}

          <Link
            href={`/city/${activeCity.id}`}
            className={styles.detailsLink}
          >
            Детальніше про місто →
          </Link>
        </div>
      )}

      {/* Легенда міст */}
      <div className={styles.legend}>
        <p className={styles.legendTitle}>Міста регіону ({cities.length}):</p>
        <div className={styles.citiesList}>
          {cities.map((city: any) => (
            <button
              key={city.id}
              className={`${styles.cityButton} ${
                activeCity?.id === city.id ? styles.active : ''
              }`}
              onClick={() => setActiveCity(city)}
            >
              <span className={styles.cityDot}></span>
              {city.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
