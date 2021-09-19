import React, { useEffect } from "react";
import { connect } from "react-redux";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import RenderDocuments from "./RenderDocuments";
import { useTranslation } from "react-i18next";
import Spinner from "../../../components/UI/Spinner/Spinner"
import * as actions from "../../../store/actions/index";
import Typography from "@material-ui/core/Typography";
import Folder from './Folder';

const Modules = ({ course, token, modules, history, loading, fetchModules }) => {
  const { t } = useTranslation();
  useEffect(() => {
    fetchModules(course, token)
  }, [])
  const [openModule, setOpenModule] = React.useState(-1);
  const handleExpandedFolder = (type, index) => {
    setOpenModule(openModule === index ? -1 : index);
  };

  return (
    <List>
      <Typography align="center" variant="h4" gutterBottom>{t("layout.drawer.modules")}</Typography>
      <Spinner active={loading} transparent />
      {((modules || {}).modules || []).map((module, mIdx) => {
        const isDisabledInput =
          (openModule !== -1 && openModule !== `module[${mIdx}]`) || module.isDisabled;

        return (
          <Aux key={`module[${mIdx}]`}>
            <ListItem

              style={{
                background: openModule === `module[${mIdx}]` ? "#1769aa" : "",
                color: openModule === `module[${mIdx}]` ? "white" : "",
                opacity: isDisabledInput ? 0.2 : 1,
                cursor: isDisabledInput ? "auto" : "pointer",
                borderLeft:
                  openModule !== -1 && !isDisabledInput
                    ? "5px solid #2196f3"
                    : "none",
              }}
              button={!isDisabledInput}
              onClick={() => {
                if (isDisabledInput) return;
                handleExpandedFolder("module", `module[${mIdx}]`);
              }}
            >
              <ListItemText
                primaryTypographyProps={{ variant: "h6" }}
                primary={`${t("studentModules.module")} ${mIdx + 1} ${module.moduleName}`}
              />
              {openModule === `module[${mIdx}]` ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              )}
            </ListItem>
            <Collapse
              in={openModule === `module[${mIdx}]`}
              timeout="auto"
              unmountOnExit
            >
              <div style={{ borderLeft: "5px solid #2196f3" }}>
                <RenderDocuments folder={module.folder} />
                <List component="div" disablePadding>
                  {module.subjects.length > 0 && (
                    // <Subjects subjects={module.subjects} moduleIndex={mIdx} />
                    <Folder folderType="subject" module={module} subjects={module.subjects} moduleIndex={mIdx} history={history} />
                  )}
                </List>
              </div>
            </Collapse>
          </Aux>
        );
      })}
    </List>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchModules: (courseId, token) =>
      dispatch(actions.fetchModulesStart(courseId, token)),
  }
}

const mapStateToProps = (state, myProps) => {
  return {
    students: state.common.students,
    modules: state.common.modules,
    course: myProps.match.params.courseId,
    token: localStorage.getItem('token'),

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Modules);
