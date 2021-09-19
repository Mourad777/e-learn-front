import React, { Fragment } from "react";
// import CssOverrides from "./CssOverrides";
import { makeStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginBottom: "20px",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    // flexBasis: '33.33%',
    flexShrink: 0,
  },
  headingModules: {
    fontSize: theme.typography.pxToRem(18),
    // flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    marginLeft: "10px",
  },
  flex: {
    display: "flex",
    marginTop: 10,
    justifyContent: "space-between",
  },
  searchItem: {
    flexGrow: 1,
    width: "98%",
  },
}));

const Accordion = ({
  index,
  disabled,
  summary,
  expandedSummary,
  secondaryText,
  noDetails,
  children,
}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    setExpanded(isExpanded ? panel : -1);
  };
  
  return (

      <Fragment>
        <ExpansionPanel
          disabled={disabled}
          expanded={expanded === index}
          onChange={!noDetails ? handleChange(index) : null}
        >
          <ExpansionPanelSummary
            expandIcon={!noDetails ? <ExpandMoreIcon /> : null}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <div>
              <Typography className={classes.heading}>{!expanded || expanded === -1 ? summary : expandedSummary||summary}</Typography>
              <Typography className={classes.secondaryHeading}>
                {secondaryText}
              </Typography>
            </div>
          </ExpansionPanelSummary>
          {!noDetails ? (
            <ExpansionPanelDetails>{children}</ExpansionPanelDetails>
          ) : null}
        </ExpansionPanel>
      </Fragment>

  );
};

export default Accordion;