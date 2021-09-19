import i18n from "../../../i18n/index"

const validate = (formValues = {}) => {
  const errors = {};
  errors.isValid = true
  errors.resourcesAreValid = true

  errors.resources = (formValues.resources||[]).map((r,i)=>{
    let resourceNameError;
      if(!(r||{}).resourceName || !(r.resourceName||'').trim()) resourceNameError =  i18n.t("resources.errors.giveResourceName");
      if(!(r||{}).resource)resourceNameError = i18n.t("resources.errors.selectResource");
      if((r||{}).resource instanceof File && (r||{}).resource.size > formValues.instructorFileSizeLimit * 1000000) {
        resourceNameError =i18n.t("resources.errors.fileSize",{size:`${formValues.instructorFileSizeLimit}MB`});
      }
      if(resourceNameError || resourceNameError){
          errors.resourcesAreValid = false
          errors.isValid = false
        }
      return {
        resourceName:resourceNameError,
        // resource:resourceError,
      }
  })

  return errors;
};

export default validate