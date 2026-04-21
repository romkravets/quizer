import { useContext } from "react"
import { RegionContext } from "../../../../../pages/_app"
import { translateRegionNameToUkrainian } from "../../../../helpers/functions"

const QUESTION_COUNTS = [
  { value: "5",  label: "5 питань" },
  { value: "10", label: "10 питань" },
  { value: "15", label: "15 питань" },
  { value: "20", label: "20 питань" },
]

const Settings = ({ values, setValues }) => {
  const contextRegion = useContext(RegionContext)
  const regionName = translateRegionNameToUkrainian(contextRegion?.region)

  return (
    <form>
      <div className="builder-step-intro">
        <p className="builder-step-intro-text">
          Налаштуйте параметри тесту перед тим, як додавати питання
        </p>
      </div>

      <div className="builder-settings-grid">
        <div className="builder-setting-card">
          <div className="builder-setting-label">Область</div>
          <div className="builder-setting-value">{regionName || "—"}</div>
          <p className="builder-setting-hint">
            Тест буде прив&apos;язано до цієї області на карті
          </p>
        </div>

        <div className="builder-setting-card">
          <label className="label" htmlFor="nrOfQuestions">
            Питань за сесію
          </label>
          <select
            id="nrOfQuestions"
            className="form-select"
            value={values.nrOfQuestions}
            onChange={(e) => setValues("nrOfQuestions", e.target.value)}
          >
            {QUESTION_COUNTS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <p className="form-hint">
            Скільки питань показується гравцю за одну сесію
          </p>
        </div>

        <div className="builder-setting-card">
          <label className="label" htmlFor="startBtn">
            Текст кнопки старту
          </label>
          <input
            id="startBtn"
            className="form-input"
            type="text"
            value={values.appLocale?.startQuizBtn || ""}
            onChange={(e) =>
              setValues("appLocale", {
                ...values.appLocale,
                startQuizBtn: e.target.value,
              })
            }
            placeholder="Розпочати тест"
          />
          <p className="form-hint">Текст на кнопці початку тесту для гравця</p>
        </div>

        <div className="builder-setting-card">
          <label className="label" htmlFor="resultText">
            Текст результату
          </label>
          <input
            id="resultText"
            className="form-input"
            type="text"
            value={values.appLocale?.resultPageHeaderText || ""}
            onChange={(e) =>
              setValues("appLocale", {
                ...values.appLocale,
                resultPageHeaderText: e.target.value,
              })
            }
            placeholder="Ви набрали <correctIndexLength> з <questionLength>"
          />
          <p className="form-hint">
            Можна використовувати <code>&lt;correctIndexLength&gt;</code> та{" "}
            <code>&lt;questionLength&gt;</code>
          </p>
        </div>
      </div>
    </form>
  )
}

export default Settings
