import React from "react"
import { connect } from "react-redux"
import { FieldArray } from "redux-form";
import List from "@material-ui/core/List";
import AssessmentIcon from "@material-ui/icons/Assessment";
import EditIcon from "@material-ui/icons/Edit";
import ChromeReaderModeIcon from "@material-ui/icons/ChromeReaderMode";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import { Typography } from "@material-ui/core";
import RenderFolder from "./Folder"
import { getCourse } from "../../../utility/getCourse";

const CollapseContent = ({ 
    course, 
    folderDocs, 
    folderType, 
    classes, 
    isDisabledInput, 
    childFolderType, 
    fieldArrayName, 
    moduleIndex, 
    subjectIndex, 
    index, 
    t, 
    subjects, 
    modules, 
    handleOpenFolder, 
    updateCategories, 
    secondaryBlue, 
    onSelectDocument, 
    modulesFormValues,
    courses,
}) => {
    const populatedCourse = getCourse(courses,course)
    const lessons = (populatedCourse || {}).lessons;
    const tests = ((populatedCourse || {}).tests || []).filter((item) => !item.assignment);
    const assignments = ((populatedCourse || {}).tests || []).filter(
        (item) => item.assignment
    );

    return (
        <div style={{ marginLeft: 15, borderLeft: `4px ${secondaryBlue} solid` }}>
            {(folderDocs || []).map(
                (document) => {
                    const lessonOne =
                        (folderDocs || []).find(
                            (i) => i.documentType === "lesson"
                        ) || {};
                    const testOne =
                        (folderDocs || []).find(
                            (i) => i.documentType === "test"
                        ) || {};
                    const assignmentOne =
                        (folderDocs || []).find(
                            (i) => i.documentType === "assignment"
                        ) || {};
                    let populatedDocument;
                    if (document.documentType === "test")
                        populatedDocument = (tests || []).find(
                            (test) => document.documentId === test._id
                        );
                    if (document.documentType === "assignment")
                        populatedDocument = (assignments || []).find(
                            (assignment) => document.documentId === assignment._id
                        );
                    if (document.documentType === "lesson")
                        populatedDocument = (lessons || []).find(
                            (lesson) => document.documentId === lesson._id
                        );
                    if (!populatedDocument) return null;
                    let icon;
                    if (document.documentType === "test")
                        icon = (
                            <AssessmentIcon fontSize="small" color="primary" />
                        );
                    if (document.documentType === "assignment")
                        icon = <EditIcon fontSize="small" color="primary" />;
                    if (document.documentType === "lesson")
                        icon = (
                            <ChromeReaderModeIcon
                                fontSize="small"
                                color="primary"
                            />
                        );
                    return (
                        <Aux key={document.documentId}>
                            {["assignment", "test", "lesson"].map((type, i) => {
                                let firstDoc;
                                //to show the header: tests, lessons assignments for each category or subcategories
                                if (i === 0) firstDoc = assignmentOne;
                                if (i === 1) firstDoc = testOne;
                                if (i === 2) firstDoc = lessonOne;
                                if (
                                    document.documentId === firstDoc.documentId &&
                                    document.documentType === type
                                ) {
                                    return (
                                        <ListItem
                                            key={`${type}[document.documentId]`}
                                            style={{ marginLeft: 15 }}
                                        >
                                            <ListItemText
                                                primary={t(`instructorModules.${type}s`)}
                                            />
                                        </ListItem>
                                    );
                                }
                                return null;
                            })}
                            <ListItem
                                className={classes.nestedFile}
                                key={document.documentId}
                                button
                                onClick={() => {
                                    if (isDisabledInput) return;
                                    onSelectDocument(
                                        document.documentType,
                                        document.documentId
                                    );
                                }}
                            >
                                <ListItemIcon>{icon}</ListItemIcon>
                                {document.documentType === "test" && (
                                    <ListItemText
                                        primary={`${populatedDocument.testName}`}
                                    />
                                )}
                                {document.documentType === "assignment" && (
                                    <ListItemText
                                        primary={`${populatedDocument.testName}`}
                                    />
                                )}
                                {document.documentType === "lesson" && (
                                    <ListItemText
                                        primary={`${populatedDocument.lessonName}`}
                                    />
                                )}
                            </ListItem>
                        </Aux>
                    );
                }
            )}
            {folderType !== "topic" && (
                <List
                    component="div"
                    disablePadding
                    subheader={
                        <Typography
                            variant="h6"
                            align="center"
                            style={{ color: secondaryBlue }}
                        >
                            {t(`instructorModules.${childFolderType}`)}
                        </Typography>
                    }
                >
                    <FieldArray
                        name={fieldArrayName}
                        component={RenderFolder}
                        moduleIndex={folderType === "module" ? index : moduleIndex}
                        subjectIndex={folderType === "subject" ? index : subjectIndex}
                        topicIndex={folderType === "topic" ? index : null}
                        t={t}
                        topics={folderType === "subject" ? (subjects[index] || {}).topics : null}
                        subjects={folderType === "module" ? (modules[index] || {}).subjects : null}
                        tests={tests}
                        assignments={assignments}
                        lessons={lessons}
                        handleOpenFolder={(id) => {
                            handleOpenFolder(id);
                        }}
                        updateCategories={(e, values, action) =>
                            updateCategories(e, values, action)
                        }
                        secondaryBlue={secondaryBlue}
                        modulesFormValues={modulesFormValues}
                        folderType={childFolderType}
                        onSelectDocument={(documentType, documentId) => {
                            onSelectDocument(documentType, documentId);
                        }}
                    />
                </List>)}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        course: state.common.selectedCourse,
        courses: state.common.courses,
    };
};

export default connect(mapStateToProps)(CollapseContent)