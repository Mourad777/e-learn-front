import React from "react";
import { useTranslation } from "react-i18next";
import DropdownSelect from "../FormElements/DropdownSelect/DropdownSelect";

const LanguageChooser = ({shrinkLabel}) => {
  const { t, i18n } = useTranslation();
  const documentTypeOptions = [
    { value: "en", primaryText: t("languages.english") },
    { value: "es", primaryText: t("languages.spanish") },
  ];
  return (
    <div
      style={{
        // bottom: 10,
        // position: "absolute",
        // width: "100%",
        // left: 3,
        margin:'5px 0 0 3px'
      }}
    >
      <DropdownSelect
        fullWidth
        simple
        component={DropdownSelect}
        input={{
          value: localStorage.getItem("i18nextLng"),
          onChange: (e) => i18n.changeLanguage(e.target.value),
        }}
        options={documentTypeOptions}
      />
    </div>
  );
};

export default LanguageChooser;
