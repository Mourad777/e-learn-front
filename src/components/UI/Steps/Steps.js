import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import MobileStepper from "@material-ui/core/MobileStepper";
import CssOverrides from "./CssOverrides";

const styles = {
  rootProgress: {
    width: "200%",
    flexGrow: 1,
    padding: 0,
    marginBottom: "10px",
    backgroundColor:'white'
  },
  // backButton: {
  //   marginRight: theme.spacing(1),
  // },
  // instructions: {
  //   marginTop: theme.spacing(1),
  //   marginBottom: theme.spacing(1),
  // },
  root: {
    MuiLinearProgress: {
      backgroundColor: "red !important",
      // colorPrimary: {
      //   backgroundColor: "red !important",
      // },
    },
  },
  Danger: {
    backgroundColor: "red !important",
  },
};

const Steps = ({
  activeStep,
  completed,
  stepsLabels,
  error,
  steps,
  progress,
  classes,
  danger,
}) => {
  let stepper = (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {(stepsLabels || []).map((label, index) => (
          <Step
            completed={
              (completed || []).includes(index) ? true : index <= activeStep - 1
            }
            key={label}
          >
            <StepLabel error={error === index}>{""}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );

  if (progress)
    stepper = (
      <div style={{overflowX:'hidden'}}>
        <MobileStepper
          variant="progress"
          steps={steps}
          position="static"
          activeStep={activeStep}
          className={classes.rootProgress}
        />
        </div>
    );
    if (progress && danger)
    stepper = (
      <CssOverrides>
        <MobileStepper
          variant="progress"
          steps={steps}
          position="static"
          activeStep={activeStep}
          className={classes.rootProgress}
        />
      </CssOverrides>
    );
  return stepper;
};

export default withStyles(styles)(Steps);
