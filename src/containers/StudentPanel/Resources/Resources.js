import React from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { getCourse } from "../../../utility/getCourse";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next";

const CourseResources = ({ course, courses, openModal }) => {
  const populatedCourse = getCourse(courses,course);
  const {t} = useTranslation("common");
  return (
    <Aux>
      <Typography align="center" variant="h4" gutterBottom>{t("layout.drawer.resources")}</Typography>
      <List>
        {(populatedCourse.resources||[]).map((r) => {
          const ext = (r.resource || "").split(".").pop();
          let icon;
          if (ext === "pdf") icon = <i className="far fa-file-pdf fa-2x"></i>;
          if (ext === "docx" || ext === "doc")
            icon = <i className="fas fa-file-word fa-2x"></i>;
          if (ext === "jpeg" || ext === "jpg" || ext === "jfif")
            icon = <i className="fas fa-file-image fa-2x"></i>;
          if (ext === "mp4" || ext === "avi")
            icon = <i className="far fa-file-video fa-2x"></i>
          return (
            <ListItem
              key={r._id}
              button
              onClick={() =>
                openModal(
                  { loadedFile: r.loadedResource, ext },
                  "courseResource"
                )
              }
            >
              {icon && <span style={{ marginRight: 20 }}>{icon}</span>}

              <ListItemText primary={r.resourceName} />
            </ListItem>
          );
        })}
      </List>
    </Aux>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    openModal: (doc, type) => {
      dispatch(actions.openModal(doc, type));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    course: state.common.selectedCourse,
    courses: state.common.courses,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseResources);
