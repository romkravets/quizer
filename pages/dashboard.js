import { useRouter } from "next/router";
import "../src/app/globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { child, get, ref, update } from "firebase/database";
import { db } from "../src/components/db/firebase";
import { useContext } from "react";
import { RegionContext } from "./_app";
import { regions } from "../src/helpers/regionType";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import Fancybox from "../src/helpers/map";
import { translateRegionNameToUkrainian } from "../src/helpers/functions";
import CityList from "../src/components/CityList/CityList";

const Dashboard = () => {
  const tasksRef = ref(db);
  const router = useRouter();
  const [dataRegion, setDataRegion] = useState([]);
  const [loading, setLoadingDb] = useState(false);

  const contextRegion = useContext(RegionContext);

  const getFormApp = async (regionNameId) => {
    try {
      get(child(tasksRef, `regions/${regionNameId}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const dataArray =
              Object.keys(snapshot.val() || {}).length > 0
                ? Object.values(snapshot.val())
                : [];
            setDataRegion(dataArray.reverse());
            setLoadingDb(false);
          } else {
            console.log("No data available");
            setLoadingDb(false);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoadingDb(true);
    if (router.isReady) {
      contextRegion.setRegion(router.query.data);
      getFormApp(router.query.data).catch((error) => {
        console.log(error);
      });
    }
  }, [router.isReady, router.query.form]);

  const currentRegion = router.query.data;

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <ul className="dashboard-ul">
          <li className="dashboard-li-main">
            <Link href="/">Україна</Link>
          </li>
          <li className="dashboard-li-quest">
            <Link href={`/auth/login`}>+ Створити квест</Link>
          </li>
          <li className="dashboard-li-quest">
            <Link href={`/auth/login`}>Вхід</Link>
          </li>
        </ul>
      </nav>

      <div className="dashboard-content">
        <div className="region">
          <h4>{translateRegionNameToUkrainian(currentRegion)}</h4>
        </div>

        <div className="dashboard-region-panel">
          {/* Map side — зумується по кліку */}
          <div className="dashboard-map-side">
            {regions.includes(currentRegion) && (
              <Fancybox options={{ Carousel: { infinite: false } }}>
                <a
                  data-fancybox="gallery"
                  href={`/region-map/${currentRegion}.png`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/region-map/${currentRegion}.png`}
                    alt={translateRegionNameToUkrainian(currentRegion)}
                  />
                </a>
              </Fancybox>
            )}
            <p className="dashboard-map-hint">Натисніть для збільшення</p>
          </div>

          {/* City list side — пошук + алфавітний список */}
          <div className="dashboard-list-side">
            <CityList region={currentRegion} />
          </div>
        </div>

        <p className="quests-section-title">Квести, тести та вікторини</p>

        {dataRegion.length === 0 && !loading ? (
          <div
            className="empty-test-block"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <p style={{ marginBottom: "10px" }}>
              Квестів, вікторин, тестів немає
            </p>
            <div className="dashboard-li-quest">
              <Link href={`/auth/login`}>+ Створити квест</Link>
            </div>
          </div>
        ) : loading ? (
          <p className="loader">Завантаження...</p>
        ) : (
          <div>
            <div className="quests-dashboard">
              {dataRegion.map((item, index) => {
                const time = new Date(item.time).toLocaleDateString("uk-UA", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
                if (!item.status) return null;
                return (
                  <Link
                    className="dashboard-card"
                    key={index}
                    href={`/quest/${item.id}?data=${currentRegion}`}
                    target="_blank"
                    passHref
                  >
                    <div className="card-body">
                      <h3 className="card-title">{item.quizTitle}</h3>
                      {item.quizSynopsis && (
                        <p className="card-desc">{item.quizSynopsis}</p>
                      )}
                      <div className="card-meta">
                        <span className="card-tag">📅 {time}</span>
                        <span className="card-tag">👤 {item.userName}</span>
                        <span className="card-tag">
                          ✓ {item.completeQuizCount} пройдено
                        </span>
                      </div>
                      <div className="card-footer">
                        <button className="card-cta">Пройти тест →</button>
                        <button
                          className="card-like"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const dbRef = ref(
                              db,
                              `regions/${item.regionName}/${item.id}`,
                            );
                            update(dbRef, { like: item.like + 1 })
                              .then(() => getFormApp(item.regionName))
                              .catch((err) => console.log(err));
                          }}
                        >
                          ♥ <span className="card-like-count">{item.like}</span>
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
              <div
                className="dashboard-li-quest"
                style={{
                  textAlign: "center",
                }}
              >
                <Link href={`/auth/login`}>+ Створити квест</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
