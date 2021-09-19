import React from 'react'
import classes from "../TestForm.module.css";

export const renderField = ({ input, label, type, meta: { touched, error } }) => (
    <div>
      <label>{label}</label>
      <div>
        <input
          className={[classes.InputField, classes.FullWidth].join(" ")}
          {...input}
          placeholder={label}
          type={type}
        />
        {touched && error && <span>{error}</span>}
      </div>
    </div>
  );