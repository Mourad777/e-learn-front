import i18n from "../../i18n/index"

const validate = (formValues = {}) => {
  const errors = {};
  errors.isValid = true
  errors.documentsAreValid = true
  const isEditingPassword = formValues.isEditingPassword;
  const emailPattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  // const namePattern = /^[a-zA-Z ]*$/;
  if (!formValues.firstName) {
    errors.firstName = i18n.t("account.errors.enterFirstName");
    errors.isValid = false
  }
  if(!/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g.test(formValues.firstName)){
    errors.firstName = i18n.t("account.errors.enterFirstNameOnlyAlpha");
    errors.isValid = false
  }
  if (!formValues.lastName) {
    errors.lastName = i18n.t("account.errors.enterLastName");
    errors.isValid = false
  }
  if(!/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g.test(formValues.lastName)){
    errors.lastName = i18n.t("account.errors.enterLastNameOnlyAlpha");
    errors.isValid = false
  }

  if (!formValues.dob) {
    errors.dob = i18n.t("account.errors.enterDateOfBirth");
    errors.isValid = false
  }

  // if(!formValues.sex) {
  //     errors.sex = i18n.t("account.errors.makeSelection");
  //     errors.isValid = false
  // }

  if (!emailPattern.test(formValues.email)) {
    errors.email = i18n.t("account.errors.enterValidEmail");
    errors.isValid = false
  }

  if (!formValues.email) {
    errors.email =i18n.t("account.errors.required");
    errors.isValid = false
  }

  if (!formValues.newPassword && isEditingPassword) {
    errors.newPassword =i18n.t("account.errors.requiredOrSelectKeepPassword");
    errors.isValid = false
  }

  if (!formValues.newPasswordConfirm && isEditingPassword) {
    errors.newPasswordConfirm =i18n.t("account.errors.requiredOrSelectKeepPassword");
    if(!formValues.isPassword){
      errors.newPasswordConfirm =i18n.t("account.errors.requiredOrSelectRemovePassword");
    }
    errors.isValid = false
  }

  if (!formValues.currentPassword && isEditingPassword && formValues.isPassword) {
    errors.currentPassword =i18n.t("account.errors.requiredOrSelectKeepPassword");
    errors.isValid = false
  }

  if (!passwordPattern.test(formValues.newPassword) && isEditingPassword) {
    errors.newPassword =
    i18n.t("account.errors.passwordConditions");
      errors.isValid = false
  }

  if (formValues.newPasswordConfirm !== formValues.newPassword) {
    errors.newPasswordConfirm =  i18n.t("account.errors.passwordMismatched");
    errors.isValid = false
  }
  //documents validation
  errors.documents = (formValues.documents||[]).map((d,i)=>{
    let documentError = null;
      if(!d) documentError =  i18n.t("account.errors.selectDocAndType");
      if(!(d||{}).document)documentError =i18n.t("account.errors.selectPdfWordJpg");
      if((d||{}).document instanceof File && (d||{}).document.size > 25 * 1000000) documentError =`${i18n.t("account.errors.docMustBeLessThan",{size:formValues.maxFileSize}) }`
      if(documentError || !(d||{}).documentType){
          errors.documentsAreValid = false
          errors.isValid = false
        }
      if(documentError || !(d||{}).documentType) errors.atIndex = i
      return {
        documentType:!(d||{}).documentType ? i18n.t("account.errors.mustSelectDocType"): null,
        document:documentError,
      }
  })

  return errors;
};

export default validate