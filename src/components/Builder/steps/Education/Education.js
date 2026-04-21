import {useState, useEffect, useContext} from "react"
import Input from "../../inputs/Input"
import {v4 as uuid} from "uuid"
import TextArea from "../../inputs/TextArea"
import Compressor from "compressorjs"
import {ref, getDownloadURL, getStorage, uploadBytes} from "firebase/storage"
import {RegionContext, ThemeContext} from "../../../../../pages/_app"

const Education = ({
  addEducationItem,
  updateEducationItem,
  removeEducationItem,
  errors,
  values,
  setValues
}) => {

  const initialProject = {
    id: uuid(),
    question: '',
    questionType: 'text',
    questionPic: '',
    answerSelectionType: 'single',
    answers: [],
    correctAnswer: '',
    messageForCorrectAnswer: 'Відповідь правильна!. Хороша робота.',
    messageForIncorrectAnswer: 'Відповідь не правильна',
    explanation: '',
    point: '1'
  }

  const [dataInput, setDataInput] = useState(initialProject)
  const [openModal, setOpenModal] = useState(false)
  const [variant, setVariant] = useState('')
  const [variantsArray, setVariantsArray] = useState(dataInput.editing ? values.answers : [])
  const [imagesPreviewUrls, setImagesPreviewUrls] = useState('')

  const contextRegion = useContext(RegionContext)
  const contextValue = useContext(ThemeContext)

  const handleChange = (fieldName, value) => {
    setDataInput({...dataInput, [fieldName]: value})
  }

  const inputChangeVariant = (e) => setVariant(e.target.value)

  const inputSubmitVariant = (e) => {
    e.preventDefault()
    if (variant.trim()) {
      setVariantsArray([...variantsArray, variant])
      setValues({...values, answers: variantsArray})
      setVariant('')
    }
  }

  const handleDelete = (index) => {
    setVariantsArray(variantsArray.filter((_, i) => i !== index))
  }

  useEffect(() => {
    setDataInput({...dataInput, answers: variantsArray})
  }, [variantsArray])

  const handleImageChange = (e) => {
    const acceptedFiles = e.target.files
    const imageFile = acceptedFiles[0]

    const createObjectURL = (file) => {
      if (window.webkitURL) return window.webkitURL.createObjectURL(file)
      if (window.URL?.createObjectURL) return window.URL.createObjectURL(file)
    }

    new Compressor(imageFile, {
      convertTypes: ['image/png', 'image/webp', 'image/heic', 'image/heif', 'image/bmp', 'image/svg', 'image/tif', 'image/tiff', 'image/gif', 'image/raw'],
      convertSize: 0,
      maxWidth: 500,
      maxHeight: 500,
      success: (results) => {
        Array.from(acceptedFiles)?.map((file) => {
          setImagesPreviewUrls(createObjectURL(file))
          const storage = getStorage()
          const storageRef = ref(storage, `questions/images/${contextRegion.region}/${contextValue.authObj.userId}/${file.name}`)
          uploadBytes(storageRef, results, "data_url").then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => handleChange('questionPic', url))
          })
        })
      },
      error(err) { console.log(err) }
    })
  }

  return (
    <div>
      {values?.questions?.length > 0 && (
        <>
          <h3 className="builder-section-title">
            Список питань ({values.questions.length})
          </h3>
          <div className="my-quest-container">
            {values.questions.map((item, index) => (
              <div key={index} className="builder-question">
                <div className="builder-question-inner">
                  <div className="builder-question-index">Питання {index + 1}</div>
                  <h4 className="builder-question-title">{item.question}</h4>
                  {item.answers?.length > 0 && (
                    <ol className="builder-question-answers">
                      {item.answers.map((ans, i) => (
                        <li
                          key={i}
                          className={String(i + 1) === String(item.correctAnswer) ? 'correct-answer' : ''}
                        >
                          {ans}
                        </li>
                      ))}
                    </ol>
                  )}
                  <div className="builder-question-meta">
                    {item.explanation ? (
                      <span>💬 {item.explanation}</span>
                    ) : <span />}
                    <span>{item.point} бал.</span>
                  </div>
                  <div className="builder-question-button-container">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenModal(!openModal)
                        setDataInput({...item, editing: true})
                        document.getElementById('builder-form').scrollIntoView({behavior: 'smooth'})
                      }}
                    >
                      Редагувати
                    </button>
                    <button
                      type="button"
                      className="delate"
                      onClick={() => removeEducationItem(index)}
                    >
                      Видалити
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <form
        id="builder-form"
        onSubmit={(event) => {
          event.preventDefault()
          if (dataInput.editing) {
            updateEducationItem({...dataInput, editing: false})
          } else {
            addEducationItem(dataInput)
          }
          setDataInput(initialProject)
          setImagesPreviewUrls('')
          setOpenModal(!openModal)
        }}
      >
        <h3 className="builder-section-title">
          {dataInput.editing ? 'Редагування питання' : 'Нове питання'}
        </h3>

        <Input
          placeholder="Вкажіть текст запитання"
          label="Запитання"
          name="question"
          type="text"
          required
          value={dataInput?.question || ""}
          error={errors?.question}
          handleChange={(event) => handleChange('question', event.target.value)}
        />

        <div className="variants-section">
          <label className="label">Варіанти відповідей</label>
          <div className="variants-add-row">
            <input
              className="form-input"
              type="text"
              value={variant}
              onChange={inputChangeVariant}
              placeholder="Введіть варіант і натисніть + Додати"
            />
            <button
              type="button"
              className="btn-add-variant"
              onClick={inputSubmitVariant}
            >
              + Додати
            </button>
          </div>
          {dataInput?.answers?.length > 0 && (
            <ol className="variants-list">
              {dataInput.answers.map((task, index) => (
                <li key={index} className="variant-item">
                  <span className="variant-text">{index + 1}. {task}</span>
                  <button
                    type="button"
                    className="variant-delete"
                    onClick={() => handleDelete(index)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>

        <Input
          placeholder="Порядковий номер правильної відповіді (1, 2, 3…)"
          label="Правильна відповідь"
          name="correctAnswer"
          type="number"
          required
          value={dataInput?.correctAnswer || ""}
          error={errors?.correctAnswer}
          handleChange={(event) => handleChange('correctAnswer', event.target.value)}
        />

        <TextArea
          placeholder="Поясніть чому ця відповідь правильна"
          label="Пояснення до відповіді"
          name="explanation"
          type="text"
          value={dataInput?.explanation || ""}
          error={errors?.explanation}
          handleChange={(event) => handleChange('explanation', event.target.value)}
        />

        <Input
          placeholder="Наприклад: 1"
          label="Кількість балів"
          name="point"
          type="number"
          value={dataInput?.point || ""}
          error={errors?.point}
          handleChange={(event) => handleChange('point', event.target.value)}
        />

        <div className="file-upload-section">
          <label className="label">Зображення до питання</label>
          <label className="file-upload-btn" htmlFor="fotoUploader">
            📎 Обрати зображення
          </label>
          <input
            id="fotoUploader"
            type="file"
            name="avatarUploader"
            onChange={handleImageChange}
            accept="image/*, .heic, .heif"
            style={{display: 'none'}}
          />
          {(imagesPreviewUrls || dataInput.questionPic) && (
            <img
              className="file-preview"
              src={imagesPreviewUrls || dataInput.questionPic || ''}
              alt=""
            />
          )}
        </div>

        <button
          className="btn btn-continue"
          type="submit"
          onClick={() => setVariantsArray([])}
        >
          {dataInput?.editing ? 'Підтвердити редагування' : 'Зберегти питання'}
        </button>
      </form>
    </div>
  )
}

export default Education
