import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { useTranslation } from "react-i18next";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    overflow: "auto",
    maxHeight: 300,
  },
  listSection: {
    backgroundColor: "inherit",
  },
  ul: {
    backgroundColor: "inherit",
    padding: 0,
  },
}));

function PinnedSubheaderList({
  input:{onChange, value},
  meta,
  instructors,
  courseEditing,
  currentInstructorId,
}) {
  const classes = useStyles();
  const { t, i18n } = useTranslation("common");
  return (
      <List className={classes.root} subheader={<li />}>
        {(instructors || []).map((instructor) => (
          <li key={`section-${instructor._id}`} className={classes.listSection}>
            <ul className={classes.ul}>
              {(instructor.coursesTeaching || []).length > 0 ||
              ((instructor.coursesTeaching || []).length > 1 &&
                instructor._id === currentInstructorId) ? (
                <Aux>
                  <ListSubheader>{`${t("courseForm.instructor")}: ${instructor.firstName}`}</ListSubheader>

                  {(instructor.coursesTeaching || []).map((course, index) => {
                    if (course._id !== courseEditing) {
                      const handleChange = (event) => {
                        const arr = [...value];
                        if (event.target.checked) {
                          arr.push(course._id);
                        } else {
                          arr.splice(arr.indexOf(course._id), 1);
                        }
                        return onChange(arr);
                      };
                      const checked = value.includes(course._id);

                      return (
                        <ListItem key={`item-${instructor._id}-${course._id}`}>
                          <FormControlLabel
                            key={`checkbox-${index}`}
                            control={
                              <Checkbox
                                name={`${course.courseName}[${index}]`}
                                value={course._id}
                                checked={checked}
                                onChange={handleChange}
                              />
                            }
                            label={`Course ${course.courseName}`}
                          />
                        </ListItem>
                      );
                    }
                  })}
                </Aux>
              ) : null}
            </ul>
          </li>
        ))}
      </List>
    );
}

export default PinnedSubheaderList