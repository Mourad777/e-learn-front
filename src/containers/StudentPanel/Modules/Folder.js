import React from 'react'
import { romanize } from "../../../utility/getRomanNumeral";
import { useTranslation } from "react-i18next";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import RenderDocuments from "./RenderDocuments";

const Folder = ({ subjects, topics, moduleIndex, subjectIndex, folderType }) => {
    const { t } = useTranslation();
    let docs, padding;
    if (folderType === "subject") {
        docs = subjects
        padding = [40, 40, 50]
    }
    if (folderType === "topic") {
        docs = topics
        padding = [80, 80, 90]
    }

    return (
        <Aux>
            <ListItem style={{ paddingLeft: padding[0] }}>
                <ListItemText primary={t(`studentModules.${folderType}s`)} />
            </ListItem>
            {(docs || []).map((doc, index) => {
                let key, childDocs, childFolder, secondaryText;
                if (folderType === "subject") {
                    docs = subjects
                    key = `module[${moduleIndex}]subject[${index}]`
                    childDocs = doc.topics
                    childFolder = 'topic'
                    secondaryText = `${index + 1} \. ${doc.subjectName}`
                }
                if (folderType === "topic") {
                    docs = doc.topics
                    key = `module[${moduleIndex}]subject[${subjectIndex}]topic[${index}]`
                    secondaryText = `${romanize(index + 1)}\. ${doc.topicName}`
                }
                return (
                    <Aux key={key}>
                        <ListItem style={{ paddingLeft: padding[1] }}>
                            <ListItemText secondary={secondaryText} />
                        </ListItem>
                        <div style={{ paddingLeft: padding[2] }}>
                            <RenderDocuments folder={doc.folder} />
                        </div>
                        {(folderType !== "topic") && (<List component="div" disablePadding>
                            {childDocs.length > 0 && (
                                <Folder
                                    subjects={subjects}
                                    topics={doc.topics}
                                    moduleIndex={moduleIndex}
                                    subjectIndex={folderType === "subject" ? index : null}
                                    folderType={childFolder}
                                />
                            )}
                        </List>)}
                    </Aux>
                );
            })}
        </Aux>
    );
};

export default Folder;