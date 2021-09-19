import React from "react";
import classes from "./Spinner.module.css";

const Spinner = ({ active, transparent }) => {
  if (active) return <div className={transparent ? classes.Backdrop : null}><div className={transparent ? classes.loader : classes.Loader}>Loading...</div></div> ;
//   if (active && transparent)
//     return <div className={classes.ldsGrid}></div>;
  return null
};

export default Spinner;
