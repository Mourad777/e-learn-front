import React from "react";
import { connect } from "react-redux";
import { change } from "redux-form";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import DropdownSelect from "../../../components/UI/FormElements/DropdownSelect/DropdownSelect";
import TextField from "../../../components/UI/FormElements/TextField/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import EditIcon from "@material-ui/icons/Edit";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import { addQuestionToTest } from "./addQuestionToTest";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";


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
  createButton: {
    margin: "20px 0 20px 0",
  },
}));

const Questions = ({
  questions,
  selecting,
  questionType,
  indexToAdd,
  onBlockSync,
  addQToTest,
  course,
  isTest,
}) => {
  const history = useHistory();
  const { t } = useTranslation()
  const classes = useStyles();
  const [difficultyFilter, setDifficultyFilter] = React.useState("");
  const [tagFilter, setTagFilter] = React.useState("");
  const [languageFilter, setLanguageFilter] = React.useState("");

  const handleResetFilter = () => {
    setDifficultyFilter("");
    setTagFilter("");
    setLanguageFilter("");
  };

  const getQuestionToAdd = (id) => {
    const foundQuestion = (questions || []).find(
      (question) => id === question._id
    );
    return foundQuestion;
  };

  const difficultyDropdownOptions = [
    { value: "", primaryText: "" },
    { value: "easy", primaryText: t("questions.easy") },
    { value: "medium", primaryText: t("questions.medium") },
    { value: "hard", primaryText: t("questions.hard") },
  ];
  const languageDropdownOptions = (questions || [])
    .filter((item) => item.language !== "" || item.language !== null) //1. Filter out questions that do not have a language assigned to them
    .reduce(function (a, b) {
      //2. Remove duplicates
      if (a.map((item) => item.language).indexOf(b.language) < 0) a.push(b);
      return a;
    }, [])
    .map((item) => {
      //3. Transform the array into the proper format that the select component expects
      return { value: item.language, primaryText: item.language };
    });
  let mcIndex = 0;
  let essayIndex = 0;
  let speakingIndex = 0;
  let fillInBlankIndex = 0;
  return (
    <Aux>
      {!selecting && (
        <div style={{ display: 'flex',justifyContent:'center' }}>
          <Button
            color="primary"
            className={classes.createButton}
            onClick={(e) => {
              e.stopPropagation();
              let qType;
              if (questionType === "Multiple-choice questions") qType = "mc";
              if (questionType === "Essay questions") qType = "essay";
              if (questionType === "Speaking questions") qType = "speaking";
              if (questionType === "Fill-in-the-blanks questions")
                qType = "fillInBlank";
              history.push(`/instructor-panel/course/${course}/${isTest ?'tests':'assignments'}/question-bank/new/${qType}`)
            }}
          >
            {t("questions.buttons.createQuestion")}
          </Button>
        </div>
      )}

      <Typography variant="subtitle1">{t("questions.filterQuestions")}</Typography>

      <div className={classes.flex}>
        <div className={classes.searchItem}>
          <DropdownSelect
            fullWidth
            simple
            textLabel={t("questions.difficulty")}
            label="difficulty"
            options={difficultyDropdownOptions}
            input={{
              onChange: (e) => {
                setDifficultyFilter(e.target.value);
              },
              value: difficultyFilter,
            }}
          />
        </div>
        <div className={classes.searchItem}>
          {" "}
          <DropdownSelect
            fullWidth
            simple
            textLabel={t("questions.language")}
            label="language"
            options={[
              { primaryText: "", value: "" },
              ...languageDropdownOptions,
            ]}
            input={{
              onChange: (e) => {
                setLanguageFilter(e.target.value);
              },
              value: languageFilter,
            }}
          />
        </div>
        <div className={classes.searchItem}>
          {" "}
          <TextField
            label={"Tag"}
            width="97.5%"
            simple
            textLabel={t("questions.tag")}
            input={{
              onChange: (e) => {
                setTagFilter(e.target.value);
              },
              value: tagFilter,
            }}
          />
        </div>
      </div>
      <Button
        fullWidth
        color="secondary"
        size="small"
        onClick={handleResetFilter}
        style={{ margin: "5px 0 0 0" }}
      >
        {t("questions.buttons.resetFilters")}
      </Button>

      {(questions || [])
        .filter((item) => {
          //language filter
          if (languageFilter === "" || item.language === languageFilter)
            return item;
        })
        .filter((item) => {
          //difficulty filter
          if (difficultyFilter === "" || item.difficulty === difficultyFilter)
            return item;
        })
        .filter((item) => {
          //tag filter
          const foundTag = (item.tags || []).find((tag) => {
            if (tag.toLowerCase().includes(tagFilter.toLowerCase())) return tag;
          });
          if (foundTag || tagFilter === "") return item;
        })
        .map((question, index) => {
          let qType; //this gives the correct question number for each question type
          if (question.type === "mc") mcIndex += 1;
          if (question.type === "essay") essayIndex += 1;
          if (question.type === "speaking") speakingIndex += 1;
          if (question.type === "fillInBlank") fillInBlankIndex += 1;
          //qtype is used to match the way the question type is written in the question object
          if (questionType === "Multiple-choice questions") qType = "mc";
          if (questionType === "Essay questions") qType = "essay";
          if (questionType === "Speaking questions") qType = "speaking";
          if (questionType === "Fill-in-the-blanks questions")
            qType = "fillInBlank";
          if (question.type !== qType) return;
          return (
            <List key={question._id}>
              <ListItem
                dense
                button
                onClick={(e) => {
                  if (selecting) {
                    //case for adding a question to a test or assignment in a test or assignment form
                    e.stopPropagation();
                    addQuestionToTest(
                      getQuestionToAdd(question._id),
                      indexToAdd,
                      (field, value) => {
                        addQToTest(field, value);
                      },
                      onBlockSync
                    );
                  } else {
                    //case for editing the question in the question bank section
                    history.push(`/instructor-panel/course/${course}/${isTest ?'tests':'assignments'}/question-bank/edit/${question._id}`)
                  }
                }}
              >
                {selecting ? (
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                ) : (
                    <ListItemIcon>
                      <EditIcon />
                    </ListItemIcon>
                  )}
                {question.type === "mc" && (
                  <ListItemText
                    primary={
                      mcIndex +
                      " " +
                      ((question.mcQuestion || {}).question || "")
                        .replace(/<[^>]+>/g, "") //gets rid of tags around text
                        .slice(0, 25) +
                      "..." //return 15 characters from the question
                    }
                  />
                )}
                {question.type === "essay" && (
                  <ListItemText
                    primary={
                      essayIndex +
                      " " +
                      ((question.essayQuestion || {}).question || "")
                        .replace(/<[^>]+>/g, "")
                        .slice(0, 25) +
                      "..."
                    }
                  />
                )}
                {question.type === "speaking" && (
                  <ListItemText
                    primary={
                      (
                        speakingIndex +
                        " " +
                        (question.speakingQuestion || {}).question || ""
                      )
                        .replace(/<[^>]+>/g, "")
                        .slice(0, 25) + "..."
                    }
                  />
                )}
                {question.type === "fillInBlank" && (
                  <ListItemText
                    primary={
                      (
                        fillInBlankIndex +
                        " " +
                        (question.fillBlankQuestions || {}).question || ""
                      )
                        .replace(/<[^>]+>/g, "")
                        .slice(0, 25) + "..."
                    }
                  />
                )}
              </ListItem>
            </List>
          );
        })}
    </Aux>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    addQToTest: (field, value) => {
      dispatch(change("testForm", field, value));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    course:state.common.selectedCourse,
    questions: state.instructorQuestion.questionBank,
    questionEditing: state.instructorQuestion.questionEditing,
    editing: state.common.editing,
    creatingQuestionType: state.instructorQuestion.creatingQuestionType,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Questions);
