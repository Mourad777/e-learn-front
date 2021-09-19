
export const checkValidity = (noErrors,testFormSection,formErrors) => {
    const isValidFinal =
    noErrors ||
    (!formErrors.infoPageOneError && testFormSection === "info1") ||
    (!formErrors.infoPageTwoError && testFormSection === "info2") ||
    (!formErrors.infoPageThreeError && testFormSection === "info3") ||
    (!formErrors.infoPageFourError && testFormSection === "info4") ||
    (!formErrors.mcSectionPageError && testFormSection === "mc") ||
    (!formErrors.essayPageError && testFormSection === "essay") ||
    (!formErrors.speakingPageError && testFormSection === "speaking") ||
    (!formErrors.fillblankPageError && testFormSection === "fillblanks") ||
    (formErrors.fillblankPageError !== false && formErrors.fillblankPageError !== true && testFormSection === "fillblanks");

    return isValidFinal
}