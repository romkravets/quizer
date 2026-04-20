import { useRouter } from "next/router";
import "../src/app/globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { child, get, ref, update } from "firebase/database";
import { db } from "../src/components/db/firebase";
import { useContext } from "react";
import { RegionContext } from "./_app";
import Image from "next/image";
import { regions } from "../src/helpers/regionType";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import Fancybox from "../src/helpers/map";
import { translateRegionNameToUkrainian } from "../src/helpers/functions";
import RegionMap from "../src/components/RegionMap/RegionMap";

// Регіони, для яких є інтерактивна карта з точками
const INTERACTIVE_REGIONS = {
  Ternopil: "/data/ternopil-places.json",
};

const Dashboard = () => {
  const tasksRef = ref(db);
  const router = useRouter();
  const [dataRegion, setDataRegion] = useState([]);
  const [loading, setLoadingDb] = useState(false);
  const [placesData, setPlacesData] = useState(null);

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

  // Завантажуємо JSON з точками, якщо регіон підтримує інтерактивну карту
  useEffect(() => {
    if (!router.isReady) return;
    const jsonPath = INTERACTIVE_REGIONS[router.query.data];
    if (jsonPath) {
      fetch(jsonPath)
        .then((r) => r.json())
        .then(setPlacesData)
        .catch(() => setPlacesData(null));
    } else {
      setPlacesData(null);
    }
  }, [router.isReady, router.query.data]);

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
  const isInteractive = Boolean(INTERACTIVE_REGIONS[currentRegion]);

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

        <div className="dashboard-map">
          {isInteractive ? (
            // Інтерактивна карта з точками міст
            <RegionMap region={currentRegion} placesData={placesData} />
          ) : (
            // Стара поведінка — Fancybox для регіонів без даних
            regions.map((item, index) => {
              switch (currentRegion) {
                case item:
                  return (
                    <Fancybox
                      key={index}
                      options={{ Carousel: { infinite: false } }}
                    >
                      <a
                        data-fancybox="gallery"
                        href={`/region-map/${currentRegion}.jpeg`}
                      >
                        <div className="region-map-container">
                          <Image
                            src={`/region-map/${currentRegion}.jpeg`}
                            layout="fill"
                            objectFit="contain"
                            alt=""
                          />
                        </div>
                      </a>
                    </Fancybox>
                  );
                default:
                  return null;
              }
            })
          )}
        </div>

        <h2 style={{ marginLeft: "20px", fontWeight: "400" }}>
          Квести, тести та вікторини
        </h2>
        {dataRegion.length === 0 && !loading ? (
          <div
            className="loader"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <p>Квестів, вікторин, тестів немає</p>
            <div className="dashboard-li-quest">
              <Link href={`/auth/login`}>+ Створити квест</Link>
            </div>
          </div>
        ) : loading ? (
          <p className="loader">Завантаження...</p>
        ) : (
          <div className="quests-dashboard">
            {dataRegion.map((item, index) => {
              const time = new Date(item.time).toLocaleDateString("en-US");
              if (item.status) {
                return (
                  <Link
                    className="dashboard-card"
                    key={index}
                    href={`/quest/${item.id}?data=${currentRegion}`}
                    target="_blank"
                    passHref
                  >
                    <h3>{item.quizTitle}</h3>
                    <p className="description">{item.quizSynopsis}</p>
                    <p className="cart-color-second">Створено: {time}</p>
                    <p className="cart-color-second">Автор: {item.userName}</p>
                    <p className="cart-color-second">
                      Пройдено: {item.completeQuizCount}
                    </p>
                    <button>Пройти тест</button>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "10px",
                      }}
                    >
                      <span className="cart-color-second">{item.like}</span>
                      <Image
                        src="/love.svg"
                        width="20"
                        height="20"
                        alt="like"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const dbRef = ref(
                            db,
                            `regions/${item.regionName}/${item.id}`,
                          );
                          update(dbRef, { like: item.like + 1 })
                            .then(() => {
                              getFormApp(item.regionName);
                            })
                            .catch((err) => {
                              console.log(err);
                            });
                        }}
                      />
                    </div>
                  </Link>
                );
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
