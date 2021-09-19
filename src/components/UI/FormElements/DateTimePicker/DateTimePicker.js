import React from "react";
import classes from "./DateTimePicker.module.css";
import "./DateTimePicker.css";
import "date-fns";
import DatePicker from "react-date-picker";
import DateTimePicker from "react-datetime-picker";
import TimeRangePicker from "@wojtekmaj/react-timerange-picker";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
// import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import Aux from "../../../../hoc/Auxiliary/Auxiliary";
//used for course start day and course end day
import { connect } from "react-redux";
// const LightTheme = React.lazy(() => import('./LightTheme'));
// const DarkTheme = React.lazy(() => import('./DarkTheme'));
function DateTimeSelector({
  input,
  type,
  error,
  handleChange,
  options,
  fullWidth,
  meta,
  noPaddingBottom,
  maxDate,
  account,
  width,
  isDarkTheme,
}) {
  
  let picker;
  const { disablePast, minDate } = options;
  const locale = localStorage.getItem("i18nextLng");
  if (type === "date")
    picker = (
      <DatePicker
        format="y/MM/dd"
        locale={locale}

        className={[
          account ? classes.accountGeneral : classes.general,
          (meta.error || error) && meta.touched ? classes.noPaddingWrapperError : classes.noPaddingWrapper,
          fullWidth ? classes.fullWidth : "",
          width < 360 ? classes.smallWidth : "",
        ].join(" ")}
        value={input.value}
        onChange={handleChange}
        minDate={minDate ? new Date(minDate) : disablePast ? new Date() : null}
        maxDate={maxDate}
      />
    );
  if (type === "dateTime")
    picker = (
      <DateTimePicker

        locale={locale}
        format="y/MM/dd h:mm a"
        className={[
          classes.general,
          classes.wrapper,
          width < 360 ? classes.smallWidth : "",
          // noPaddingBottom ? classes.noPaddingBottom : classes.regularPadding,
          fullWidth ? classes.fullWidth : "",
        ].join(" ")}
        value={input.value}
        onChange={handleChange}
        disableClock
        minDate={minDate ? new Date(minDate) : disablePast ? new Date() : null}
      />
    );
  if (type === "timeRange")
    picker = (
      <TimeRangePicker
        locale={locale}
        className={[
          classes.general,
          classes.timeRangeWrapper,
          fullWidth ? classes.fullWidth : "",
          width < 360 ? classes.smallWidth : "",
        ].join(" ")}
        value={input.value}
        onChange={handleChange}
        format="h:mm a"
        disableClock
        minDate={minDate ? new Date(minDate) : disablePast ? new Date() : null}
      />
    );
  if (type === "dateTimeRange")
    picker = (
      <DateTimeRangePicker

        locale={locale}
        format="y/MM/dd h:mm a"
        className={[
          classes.general,
          classes.wrapper,
          fullWidth ? classes.fullWidth : "",
          width < 360 ? classes.smallWidth : "",
        ].join(" ")}
        value={input.value}
        onChange={handleChange}
        disableClock
        minDate={minDate ? new Date(minDate) : disablePast ? new Date() : null}
      />
    );

  return (
    <Aux>
      {/* <React.Suspense fallback={<></>}>
        {!isDarkTheme && <LightTheme/>}
      </React.Suspense>
      <React.Suspense fallback={<></>}>
        {isDarkTheme && <DarkTheme/>}
      </React.Suspense> */}
      {options.label && (
        <span className={classes.label}>{`${options.label}:`}</span>
      )}
      {picker}
      <span className={classes.errorText}>
        {(meta.error || error) && meta.touched ? meta.error || error : ""}
      </span>
    </Aux>
  );
}

const mapStateToProps = (state) => {
  return {
    width: state.common.width,
    isDarkTheme: state.common.isDarkTheme,
  };
};



export default connect(mapStateToProps)(DateTimeSelector);
