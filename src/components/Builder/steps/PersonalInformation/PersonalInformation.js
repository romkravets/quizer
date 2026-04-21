import Input from "../../inputs/Input"
import TextArea from "../../inputs/TextArea"

const PersonalInformation = ({values, setValues, errors}) => {
  const handleChange = (fieldName, value) => {
    setValues(fieldName, value)
  }

  return (
    <form>
      <Input
        placeholder="Наприклад: Замки Тернопільщини"
        name="quizTitle"
        label="Назва квесту"
        type="text"
        value={values?.quizTitle || ""}
        handleChange={(event) => handleChange('quizTitle', event.target.value)}
        require
      />
      <TextArea
        placeholder="Коротко опишіть про що цей тест, для кого він призначений"
        name="quizSynopsis"
        type="text"
        label="Опис квесту"
        value={values.quizSynopsis || ""}
        error={errors?.quizSynopsis}
        handleChange={(event) => handleChange('quizSynopsis', event.target.value)}
      />
    </form>
  )
}

export default PersonalInformation
