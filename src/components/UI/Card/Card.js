import React from "react";
import classes from "./Card.module.css";
import Card from "@material-ui/core/Card";

const simpleCard = (props) => {
  return (
    <Card className={classes.card}>
      <div className={classes.cardContent}>{props.children}</div>
    </Card>
  );
};

export default simpleCard;
