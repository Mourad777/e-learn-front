import React from "react";
import { Field, reduxForm, change, getFormValues } from "redux-form";
import { validate } from "./validate";
import TextField from "../../../components/UI/FormElements/TextField/TextField";
import Switch from "../../../components/UI/Switch/Switch";
import Autosuggest from "../../../components/UI/FormElements/Autosuggest/Autosuggest";
import NumberPicker from "../../../components/UI/FormElements/NumberPicker/NumberPicker";
import FileInput from "../../../components/UI/FormElements/FileInput/FileInput";
import { connect } from "react-redux";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";
import DateTimePicker from "../../../components/UI/FormElements/DateTimePicker/DateTimePicker";

const languages = [
  "English",
  "French",
  "Spanish",
  "Russian",
  "Arabic",
  "Hindi",
  "Italian",
  "Mandarin",
  "Bengali",
  "Portuguese",
  "Japanese",
  "Vietnamese",
  "German",
  "Ukranian",
  "Dutch",
  "Czech",
  "Polish",
  "Indonesian",
  "Thai",
  "Romanian",
  "Persian",
  "Javanese",
  "Turkish",
  "Korean",
  "Urdu",
  "Punjabi",
  "Tagalog",
  "Amharic",
  "Igbo",
  "Somali",
  "Bavarian",
  "Kazakh",
  "Hungarian",
  "Zulu",
  "Rundi",
  "Greek",
  "Swedish",
  "Creole",
  "Nepali",
  "Croatian",
  "Uzbek",
];

const CourseFormStepOne = ({
  formValues = {},
  changeField,
  isImage,
  clearImage,
  editing,
  createdAt,
  changeDateTime,
}) => {
  const { t } = useTranslation('common')
  const handleSelectedLanguage = (oldValue, selectedLanguage) => {
    changeField("language", selectedLanguage);
  };

  const switchOptions = { label: t("courseForm.fields.courseActive"), checked: false };
  return (
    <Aux>
      <Typography paragraph variant="h5" gutterBottom>
        {t("courseForm.courseCustomization")}
      </Typography>
      <Field name="courseActive" options={switchOptions} component={Switch} />
      <Field
        name="courseName"
        type="text"
        component={TextField}
        label={t("courseForm.fields.courseName")+' *'}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Field
          name="studentCapacity"
          component={NumberPicker}
          fullWidth
          compact
          options={{ label: t("courseForm.fields.maxStudents"), size: "small" }}
          customMargin={"0 5px 0 0"}
        />
        <Field
          name="language"
          component={Autosuggest}
          id="language-autocomplete"
          selectedOption={formValues.language}
          onOptionChange={handleSelectedLanguage}
          options={languages}
          label={t("courseForm.fields.taughtIn")}
          size="small"
          minWidth={135}
        />
      </div>
      <Typography paragraph variant="h5" gutterBottom>
        {t("courseForm.courseThumbnail")}
      </Typography>
      <Field
        name="courseImage"
        onChangeFile={(image) => {
          changeField("loadedCourseImage", image);
        }}
        uploadButtonText={t("courseForm.fields.chooseImage")}
        uploadButtonMinWidth={200}
        compressImage
        editing={editing}
        loadedFile={formValues.loadedCourseImage}
        component={FileInput}
        imageFile
        type="file"
        mimeTypesAllowed={"image/jpeg"}
        extensionsAllowed={["jpeg", "jpg", "jfif"]}
      />
      <div style={{ textAlign: 'center' }}>
        <Button
          style={{ minWidth: 200 }}
          startIcon={<DeleteIcon />}
          disabled={isImage ? false : true}
          color="secondary"
          onClick={() => clearImage()}
        >
          {t("courseForm.buttons.clearImage")}
        </Button>
      </div>
      <Field
        name="cost"
        component={NumberPicker}
        fullWidth
        options={{ label: t("courseForm.fields.costUSD"), size: "small" }}
        customMargin={"0 5px 0 0"}
      />
      {/* <Field
        name="couponCode"
        type="text"
        component={TextField}
        label={t("courseForm.fields.couponCode")}
      />
      <Field
        name="couponExpiration"
        component={DateTimePicker}
        fullWidth
        options={{
          disablePast: true,
          label: t("courseForm.fields.couponExpiration"),
          minDate: createdAt,
        }}
        type="dateTime"
        handleChange={(date) =>
          changeDateTime(date, "couponExpiration")
        }
      /> */}
    </Aux>
  );

}

const mapStateToProps = (state) => {
  return {
    editing: state.common.editing,
    formValues: getFormValues("courseForm")(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeField: (field, value) => {
      dispatch(change("courseForm", field, value));
    },
    clearImage: () => {
      dispatch(change("courseForm", "courseImage", null));
      dispatch(change("courseForm", "loadedCourseImage", null));
    },
    changeDateTime: (date, field) => {
      dispatch(change("courseForm", field, date));
    },
  };
};

const wrappedForm = reduxForm({
  form: "courseForm",
  validate: validate,
  destroyOnUnmount: false,
})(CourseFormStepOne);

export default connect(mapStateToProps, mapDispatchToProps)(wrappedForm);
