import React, { useEffect } from "react";
import { connect } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import MobileStepper from "@material-ui/core/MobileStepper";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import Editor from "../../../Editor/Editor";
import VideoPlayer from "../../../../components/UI/VideoPlayer/VideoPlayer";
import AudioPlayer from "../../../../components/UI/AudioPlayer/AudioPlayerAdvanced";
import * as actions from "../../../../store/actions/index";
import { useTranslation } from "react-i18next";
import { getCourse } from "../../../../utility/getCourse";
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from "react-router-dom";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "99%",
    flexGrow: 1,
    [theme.breakpoints.up("960px")]: {
      // maxWidth: 800,
      maxWidth: 400,
    },
  },
  header: {
    display: "flex",
    alignItems: "center",
    height: 50,
    paddingLeft: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
  },
  img: {
    height: "100%",
    maxWidth: 300,
    overflow: "hidden",
    display: "block",
    width: "100%",
    [theme.breakpoints.up("960px")]: {
      maxWidth: 800,
      maxWidth: 400,
    },
  },
  editor: {
    width: "100%",
  },
}));

function Lesson({
  markAsSeen,
  markSlideAsSeen,
  token,
  studentLoggedIn,
  courses,
  course,
  notifications,
  closeModal,
  match,
}) {
  const history = useHistory()
  const lessonId = match.params.lessonId;
  const populatedCourse = getCourse(courses, course)||{}
  const { t } = useTranslation()
  const lesson = (populatedCourse.lessons||[]).find(
    (l) => l._id === lessonId
  )||{};
  const slides = (lesson || {}).lessonSlides || [];

  const classes = useStyles();
  const theme = useTheme();

  const [activeStep, setActiveStep] = React.useState(0);
  const [videoPlaying, setVideoPlaying] = React.useState(false);
  const [markAsSeenTimouts, setMarkAsSeenTimouts] = React.useState([]);
  const maxSteps = slides.length;
  const slide = ((lesson || {}).lessonSlides || [])[activeStep] || {};
  useEffect(() => {
    const handleMarkSlide = () => {
      markSlideAsSeen(lesson._id, activeStep, token, 'noSpinner');
    };
    const audio = document.querySelectorAll("audio");
    if (audio.length > 0) {
      audio[0].addEventListener("ended", handleMarkSlide);
    }

    markAsSeenTimouts.forEach((to) => clearTimeout(to));
    let markAsSeenTimout;
    if (!slide.seen && !slide.video && !slide.audio) {
      markAsSeenTimout = setTimeout(handleMarkSlide, 5000);
    }

    setMarkAsSeenTimouts((prevTimouts) => {
      return [...prevTimouts, markAsSeenTimout];
    });

    return () => {
      if (audio.length > 0) {
        audio[0].removeEventListener("ended", handleMarkSlide);
      }
      clearTimeout(markAsSeenTimout);
      markAsSeenTimouts.forEach((to) => clearTimeout(to));
    };
  }, [activeStep]);

  useEffect(() => {
    if(slides.length === 0)return
    if (activeStep + 1 > slides.length) {
      setActiveStep(slides.length - 1);
    }
    if (!slides.length || slides.length === 0) {
      closeModal()
    }
  }, [slides.length,populatedCourse]);

  useEffect(() => {
    const notificationToMark = (notifications || []).find((n) => {
      if (n.documentId === lesson._id && studentLoggedIn && !n.seen) return n;
    });
    if (notificationToMark) {
      markAsSeen(notificationToMark._id, token);
    }
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  if (!lesson) return null;
  return (
    <div className={classes.root}>
      <IconButton onClick={() => {
        history.push(`/${studentLoggedIn ? 'student' : 'instructor'}-panel/course/${course}/lessons`)
      }}>
        <ArrowBackIcon />
      </IconButton>
      <Typography gutterBottom align="center" variant="h4">{lesson.lessonName}</Typography>
      {studentLoggedIn && slide.seen && (
        <Alert severity="success"> {t("lessons.completed")}</Alert>
      )}
      <div style={{ minHeight: 300 }}>
        {slide.slideContent && !slide.video && (
          <div className={classes.editor}>
            <Editor
              videoPlaying={videoPlaying}
              type="balloon"
              readOnly={true}
              input={{
                value: slide.slideContent + " ",
              }}
            />
          </div>
        )}
        {slide.audio && (
          <div className={`lessonPreview[${activeStep}]`}>
            <AudioPlayer key={`slideAudio[${activeStep}]`} audioSource={slide.audio} />
          </div>
        )}
        {slide.video && !slide.slideContent && (
          <VideoPlayer
            play={() => setVideoPlaying(true)}
            pause={() => setVideoPlaying(false)}
            ended={() => {
              setVideoPlaying(false);
              markSlideAsSeen(lesson._id, activeStep, token, 'noSpinner');
            }}
            url={slide.video}
          />
        )}
      </div>
      <MobileStepper
        steps={maxSteps}
        position="static"
        variant="text"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            {t("lessons.buttons.next")}
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === "rtl" ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            {t("lessons.buttons.back")}
          </Button>
        }
      />
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    markSlideAsSeen: (lessonId, slideNumber, token, spinner) => {
      dispatch(actions.markSlideAsSeenStart(lessonId, slideNumber, token, spinner));
    },
    markAsSeen: (id, token) => {
      dispatch(actions.markAsSeenStart(id, token));
    },
    closeModal: () => {
      dispatch(actions.closeModal());
    },
  };
};

const mapStateToProps = (state) => {
  return {
    modalDocument: state.common.modalDocument,
    token: state.authentication.token,
    studentLoggedIn: state.authentication.studentLoggedIn,
    courses: state.common.courses,
    course: state.common.selectedCourse,
    notifications: state.common.notifications,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Lesson);
