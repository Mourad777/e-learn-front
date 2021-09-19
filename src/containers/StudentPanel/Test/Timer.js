import React, { useEffect } from "react";
import { connect } from "react-redux";
import Stepper from "../../../components/UI/Steps/Steps";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import moment from "moment";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next";

const Timer = ({ testInSession, classes, submitTest }) => {
  const { t } = useTranslation();
  const endTime = testInSession.endTime;
  const [timeLeft, setTimeLeft] = React.useState(null);
  useEffect(() => {
    const testTimeChecker = setInterval(() => {
      const timeRemaining = endTime - Date.now();
      setTimeLeft(timeRemaining);
      if (timeRemaining < 0) {
        submitTest();
        clearInterval(testTimeChecker);
      }
    }, 1000);
    return () => {
      clearInterval(testTimeChecker);
    };
  }, []);
  const hour = parseInt(
    moment(parseInt((testInSession || {}).endTime)).format("H")
  );
  const hours = parseInt(
    moment(parseInt((testInSession || {}).endTime)).format("HH")
  );
  const testEnd = moment(parseInt((testInSession || {}).endTime)).format(
    "HH:mm"
  );
  return (
    <div style={{overflow:'hidden'}}>
      {timeLeft > 0 && (
        <Stepper
          danger={timeLeft / 1000 < 60}
          activeStep={
            parseInt((testInSession || {}).timer) * 60 - timeLeft / 1000 - 1
          }
          steps={parseInt((testInSession || {}).timer) * 60}
          progress
        />
      )}
      {timeLeft > 0 && (
        <div
          className={timeLeft / 1000 < 60 ? classes.timerDanger : classes.timer}
        >
          {(testInSession || {}).timer && (
            <div>
              <Typography variant="subtitle1">
                {`${t("testSession.testClosesAt", {
                  laOrLas: hour === 1 ? "la" : "las",
                  time: testEnd,
                })}`}
              </Typography>
              {timeLeft / 1000 < 300 &&
                timeLeft / 1000 > 60 &&
                (testInSession || {}).timer > 5 && (
                  <div className={classes.timeWarning}>
                    <Typography variant="caption">
                      {t("testSession.lessThanFiveMin")}
                    </Typography>
                  </div>
                )}
              {timeLeft / 1000 < 60 && (
                <div className={classes.timeWarning}>
                  <Typography variant="caption">
                    {t("testSession.lessThanOneMin")}
                  </Typography>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    testInSession: state.studentTest.testInSession,
  };
};

export default connect(mapStateToProps)(Timer);
