import React, { useRef, useEffect } from "react";
import { connect } from "react-redux";
import { Field, reduxForm, change, getFormValues, touch } from "redux-form";
import validate from "../validate";
import NumberPicker from "../../../../components/UI/FormElements/NumberPicker/NumberPicker";
import Checkbox from "../../../../components/UI/FormElements/Checkbox/Checkbox";
import Switch from "../../../../components/UI/Switch/Switch";
import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next";

//Step two fields
//Test sections
//equal distribution
//section weights

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const TestInfoStepTwo = ({
  formValues = {},
  setDefaultSectionWeights,
  touchCheckboxes,
  isTest,
}) => {
  const { t } = useTranslation("common");
  const sectionOptions = [
    {
      label: t("testForm.fields.mc"),
      value: "mc",
      placement: "start",
      color: "primary",
      name: "mc",
    },
    {
      label: t("testForm.fields.essay"),
      value: "essay",
      placement: "start",
      color: "primary",
      name: "essay",
    },
    {
      label: t("testForm.fields.speaking"),
      value: "speaking",
      placement: "start",
      color: "primary",
      name: "speaking",
    },
    {
      label: t("testForm.fields.fillblanks"),
      value: "fillblanks",
      placement: "start",
      color: "primary",
      name: "fillBlanks",
    },
  ];

  const equalSectionWeightsSwitchOptions = {
    label: t("testForm.fields.equallyDistributeMarks"),
    checked: false,
    disabled: !((formValues.testSections || []).length > 1),
  };
  const sectionWeightOptions = [
    "Multiple-choice",
    "Essay",
    "Speaking",
    "Fill-in-the-blanks",
  ].map((section, index) => {
    let sectionAbreviation;
    if (section === "Multiple-choice") sectionAbreviation = "mc";
    if (section === "Essay") sectionAbreviation = "essay";
    if (section === "Speaking") sectionAbreviation = "speaking";
    if (section === "Fill-in-the-blanks") sectionAbreviation = "fillblanks";
    return {
      label: t(`testForm.fields.${sectionAbreviation}`),
      size: "small",
      disabled:
        !(formValues.testSections || []).includes(sectionAbreviation) ||
        formValues.equalSectionWeight ||
        !((formValues.testSections || []).length > 1),
    };
  });

  const isEqualDistribution = formValues.equalSectionWeight;
  const previousIsEqualDistribution = usePrevious(isEqualDistribution);
  const numberOfSections = (formValues.testSections || []).length;
  const previousNumberOfSections = usePrevious(numberOfSections);
  if (
    previousIsEqualDistribution !== isEqualDistribution ||
    (previousNumberOfSections !== numberOfSections && isEqualDistribution) ||
    numberOfSections === 1
  ) {
    setDefaultSectionWeights(formValues.testSections, isEqualDistribution);
  }

  return (
    <Aux>
      <Typography paragraph variant="h4" gutterBottom>
        {t("testForm.marksDistribution")}
      </Typography>
      <Field
        name="testSections"
        title={
          isTest
            ? t("testForm.fields.testSections")
            : t("testForm.fields.assignmentSections")
        }
        component={Checkbox}
        onChange={() => touchCheckboxes("testSections")}
        options={sectionOptions}
        required={false}
        column
      />
      <Field
        name="equalSectionWeight"
        options={equalSectionWeightsSwitchOptions}
        component={Switch}
      />

      <Typography
        variant="h6"
        style={{ marginBottom: 20 }}
      >
        {t("testForm.fields.sectionWeights")}
      </Typography>
      <Field
        name="mcSectionWeight"
        component={NumberPicker}
        options={sectionWeightOptions[0]}
      />

      <Field
        name="essaySectionWeight"
        component={NumberPicker}
        options={sectionWeightOptions[1]}
      />

      <Field
        name="speakingSectionWeight"
        component={NumberPicker}
        options={sectionWeightOptions[2]}
      />

      <Field
        name="fillBlankSectionWeight"
        component={NumberPicker}
        options={sectionWeightOptions[3]}
      />
    </Aux>
  );
};
//testForm
const mapDispatchToProps = (dispatch) => {
  return {
    touchCheckboxes: (field) => {
      dispatch(touch("testForm", field));
    },
    setDefaultSectionWeights: (sections, equalDistribution) => {
      const numberOfSections = (sections || []).length;
      const weight = 100 / numberOfSections;
      if ((sections || []).includes("mc")) {
        dispatch(
          change(
            "testForm",
            `mcSectionWeight`,
            !equalDistribution && (sections || []).length === 1
              ? 100
              : parseFloat(weight.toFixed(2))
          )
        );
      } else {
        dispatch(change("testForm", `mcSectionWeight`, null));
      }
      if ((sections || []).includes("essay")) {
        dispatch(
          change(
            "testForm",
            `essaySectionWeight`,
            !equalDistribution && (sections || []).length === 1
              ? 100
              : parseFloat(weight.toFixed(2))
          )
        );
      } else {
        dispatch(change("testForm", `essaySectionWeight`, null));
      }
      if ((sections || []).includes("speaking")) {
        dispatch(
          change(
            "testForm",
            `speakingSectionWeight`,
            !equalDistribution && (sections || []).length === 1
              ? 100
              : parseFloat(weight.toFixed(2))
          )
        );
      } else {
        dispatch(change("testForm", `speakingSectionWeight`, null));
      }
      if ((sections || []).includes("fillblanks")) {
        dispatch(
          change(
            "testForm",
            `fillBlankSectionWeight`,
            !equalDistribution && (sections || []).length === 1
              ? 100
              : parseFloat(weight.toFixed(2))
          )
        );
      } else {
        dispatch(change("testForm", `fillBlankSectionWeight`, null));
      }
    },
  };
};

const mapStateToProps = (state, myProps) => {
  return {
    formValues: getFormValues("testForm")(state),
    testForm: state.form.testForm,
  };
};

const wrappedForm = reduxForm({
  form: "testForm",
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  // enableReinitialize: true,
  validate,
})(TestInfoStepTwo);

export default connect(mapStateToProps, mapDispatchToProps)(wrappedForm);
