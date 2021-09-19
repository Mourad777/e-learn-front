import i18n from "../../../i18n/index";

const validate = (values = {}) => {
  const errors = {
    mcSection:[],
    essaySection:[],
    speakingSection:[],
    fillInBlankSection:[],
  };

  let isValid = true
  const test = values.instructorTest||{}
  if( (parseFloat(values.gradeAdjusted) > 100 || parseFloat(values.gradeAdjusted) < 0) && values.gradeOverride) {
    errors.gradeAdjusted = i18n.t("gradeTestForm.errors.finalGradeBetweenZeroAndHundred")
    isValid = false
  }
  if( (parseFloat(values.latePenalty) > 100 || parseFloat(values.latePenalty) < 0)) {
    errors.latePenalty = i18n.t("gradeTestForm.errors.latePenaltyBetweenZeroAndHundred")
    isValid = false
  }
  if(values.gradeOverride && !values.gradeAdjusted){
    errors.gradeAdjusted = i18n.t("gradeTestForm.errors.provideGrade")
    isValid = false
  }
  const mcQuestions = test.multipleChoiceQuestions||[]
  errors.mcSection = (values.mcSection||[]).map((item,index)=>{
    const marks = (mcQuestions[index]||{}).marks
    let marksError;
    if(parseFloat(item.marks) < 0)marksError = i18n.t("gradeTestForm.errors.valueCantBeNegative")
    if(parseFloat(item.marks) > marks)marksError = `${i18n.t("gradeTestForm.errors.valueCantBeGreaterThan")} ${marks}`
    if((!item.marks || item.marks === "") && item.marks !== 0)marksError = i18n.t("gradeTestForm.errors.required")
    if(marksError)isValid = false
    return {
      marks: marksError
    }
  })

  const essayQuestions = test.essayQuestions||[]
  errors.essaySection = (values.essaySection||[]).map((item,index)=>{
    const marks = (essayQuestions[index]||{}).marks
    let marksError
    if(parseFloat(item.marks) < 0)marksError = i18n.t("gradeTestForm.errors.valueCantBeNegative")
    if(parseFloat(item.marks) > marks)marksError = `${i18n.t("gradeTestForm.errors.valueCantBeGreaterThan")} ${marks}`
    if((!item.marks || item.marks === "") && item.marks !== 0)marksError = i18n.t("gradeTestForm.errors.required")
    if(marksError)isValid = false
    return {
      marks: marksError
    }
  })
  const speakingQuestions = test.speakingQuestions||[]
  errors.speakingSection = (values.speakingSection||[]).map((item,index)=>{
    const marks = (speakingQuestions[index]||{}).marks
    let marksError
    if(parseFloat(item.marks) < 0)marksError = i18n.t("gradeTestForm.errors.valueCantBeNegative")
    if(parseFloat(item.marks) > marks)marksError = `${i18n.t("gradeTestForm.errors.valueCantBeGreaterThan")} ${marks}`
    if((!item.marks || item.marks === "") && item.marks !== 0)marksError = i18n.t("gradeTestForm.errors.required")
    if(marksError)isValid = false
    return {
      marks: marksError
    }
  })
  const fillBlankQuestions = (test.fillInBlanksQuestions||{}).blanks||[]
  errors.fillInBlankSection = (values.fillInBlankSection||[]).map((item,index)=>{
    const marks = (fillBlankQuestions[index]||{}).marks
    let marksError
    if(parseFloat(item.marks) < 0)marksError = i18n.t("gradeTestForm.errors.valueCantBeNegative")
    if(parseFloat(item.marks) > marks)marksError = `${i18n.t("gradeTestForm.errors.valueCantBeGreaterThan")} ${marks}`
    if((!item.marks || item.marks === "") && item.marks !== 0)marksError = i18n.t("gradeTestForm.errors.required")
    if(marksError)isValid = false
    return {
      marks: marksError
    }
  })
  errors.isValid = isValid
  return errors;
};

export default validate;
