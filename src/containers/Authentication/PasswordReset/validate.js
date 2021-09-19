import i18n from "../../../i18n/index"

export const validate = (formValues={}) => {
    const errors = {}
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
    
    if(!passwordPattern.test(formValues.password)) {
        errors.password = i18n.t("account.errors.passwordConditions")
    }

    if(!formValues.password) {
        errors.password = i18n.t("account.errors.required")
    }

    if (!formValues.confirmPassword ) {
        errors.confirmPassword = i18n.t("account.errors.required") ;
      } else if (formValues.confirmPassword !== formValues.password) {
        errors.confirmPassword = i18n.t("account.errors.passwordMismatched") ;
      }

    return errors
}