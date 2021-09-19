import React from "react"
import { Field } from "redux-form";
import TextField from "../../../components/UI/FormElements/TextField/TextField";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import CollapseContent from "./CollapseContent"
import IconButton from "@material-ui/core/IconButton";
import DescriptionIcon from "@material-ui/icons/Description";
import FolderIcon from "@material-ui/icons/CreateNewFolder";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        overflowX: "hidden",
        maxWidth: 600,
        margin: "30px auto",
        paddingLeft: theme.spacing(1),
        paddingTop: 30,
    },
    nested: {
        paddingLeft: theme.spacing(1.5),
    },
    nestedTwice: {
        paddingLeft: theme.spacing(2),
    },
    nestedFile: {
        paddingLeft: theme.spacing(5),
    },
}));

const updateDocs = (modulesFormValues, folderType, moduleIndex, subjectIndex, topicIndex, index) => {
    const docs = (modulesFormValues || {}).modules;
    const docsCopy = [...docs];
    let slicedItem
    if (folderType === "module") {
        (docsCopy || []).splice(index, 1);
    }
    if (folderType === "subject") {
        (
            ((docsCopy || [])[moduleIndex] || {}).subjects || []
        ).splice(index, 1);
    }
    if (folderType === "topic") {
        (
            (
                (((docsCopy || [])[moduleIndex] || {}).subjects || [])[
                subjectIndex
                ] || {}
            ).topics || []
        ).splice(index, 1);

    }
    return docsCopy
}

const RenderFolder = ({
    fields,
    meta: { error },
    moduleIndex,
    subjectIndex,
    topicIndex,
    subjects,
    topics,
    handleOpenFolder,
    updateCategories,
    modulesFormValues,
    onSelectDocument,
    secondaryBlue,
    t,
    folderType,
    modules,

}) => {
    const classes = useStyles();
    const [openFolder, setOpenFolder] = React.useState(-1);

    const handleExpandedFolder = (type, index) => {
        setOpenFolder(openFolder === index ? -1 : index);
    };
    return (
        <Aux>
            {(fields || []).map((subject, index) => {

                let node, fieldName, folderHandlerArguments, fieldArrayName, folderDocs, childFolderType;

                if (folderType === 'module') {
                    node = `node[${index}]`;
                    fieldName = `modules.${index}.moduleName`;
                    folderHandlerArguments = [index]
                    fieldArrayName = `modules.${index}.subjects`;
                    folderDocs = (modules[index] || {}).folder
                    childFolderType = 'subject'
                }
                if (folderType === 'subject') {
                    node = `node[${moduleIndex}][${index}]`;
                    fieldName = `modules.${moduleIndex}.subjects.${index}.subjectName`;
                    folderHandlerArguments = [moduleIndex, index]
                    fieldArrayName = `modules.${moduleIndex}.subjects.${index}.topics`;
                    folderDocs = (subjects[index] || {}).folder
                    childFolderType = 'topic'
                }
                if (folderType === 'topic') {
                    node = `node[${moduleIndex}][${subjectIndex}][${index}]`;
                    fieldName = `modules.${moduleIndex}.subjects.${subjectIndex}.topics.${index}.topicName`;
                    folderHandlerArguments = [moduleIndex, subjectIndex, index]
                    folderDocs = (topics[index] || {}).folder
                }
                const isDisabledInput =
                    openFolder !== -1 &&
                    openFolder !== node;
                return (
                    <Aux key={node}>
                        <ListItem
                            style={{
                                opacity: isDisabledInput ? 0.2 : 1,
                                cursor: isDisabledInput ? "auto" : "pointer",
                                borderLeft:
                                    !isDisabledInput && openFolder !== -1
                                        ? `4px ${secondaryBlue} solid`
                                        : "",
                                marginLeft: 15,
                            }}
                            button
                            onClick={() => {
                                if (isDisabledInput) return;
                                handleExpandedFolder(
                                    folderType,
                                    node,
                                );
                            }}
                            className={classes.nested}
                        >
                            <ListItemText
                                style={{ flex: "none" }}
                                primary={`${index + 1}.`}
                            />
                            <Field
                                simple
                                disabled={isDisabledInput}
                                name={fieldName}
                                onBlur={updateCategories}
                                component={TextField}
                                label={`${t(`instructorModules.${folderType}`)} ${index + 1}`}
                            />
                            <ListItemIcon>
                                <IconButton
                                    style={{ cursor: isDisabledInput ? "auto" : "pointer" }}
                                    onClick={(e) => {
                                        if (isDisabledInput) return;
                                        e.stopPropagation();
                                        handleOpenFolder(folderHandlerArguments);
                                    }}
                                >
                                    <FolderIcon />
                                </IconButton>
                            </ListItemIcon>
                            <IconButton
                                style={{ cursor: isDisabledInput ? "auto" : "pointer" }}
                                onClick={(e) => {
                                    if (isDisabledInput) return;
                                    e.stopPropagation();
                                    const updatedDocs = updateDocs(modulesFormValues, folderType, moduleIndex, subjectIndex, topicIndex, index);
                                    updateCategories(e, updatedDocs, "deleting");
                                }}
                            >
                                <DeleteIcon fontSize="small" style={{ color: secondaryBlue }} />
                            </IconButton>

                            {openFolder === node ? (
                                <ExpandLess />
                            ) : (
                                    <ExpandMore />
                                )}
                        </ListItem>

                        <Collapse
                            in={openFolder === node}
                            timeout="auto"
                            unmountOnExit
                        >
                            <CollapseContent
                                folderDocs={folderDocs}
                                folderType={folderType}
                                childFolderType={childFolderType}
                                fieldArrayName={fieldArrayName}
                                moduleIndex={moduleIndex}
                                subjectIndex={subjectIndex}
                                index={index}
                                t={t}
                                subjects={subjects}
                                modules={modules}
                                secondaryBlue={secondaryBlue}
                                onSelectDocument={onSelectDocument}
                                handleOpenFolder={handleOpenFolder}
                                updateCategories={updateCategories}
                                modulesFormValues={modulesFormValues}
                                classes={classes}
                                isDisabledInput={isDisabledInput}
                            />

                        </Collapse>
                    </Aux>
                );
            })}
            <ListItem button onClick={() => fields.push()}>
                <AddIcon style={{ color: secondaryBlue }}>
                    <DescriptionIcon />
                </AddIcon>
                <Typography style={{ color: secondaryBlue }}>{t(`instructorModules.buttons.add${folderType}`)}</Typography>
            </ListItem>
        </Aux>
    );
};

export default RenderFolder