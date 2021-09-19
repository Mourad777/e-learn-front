import React from "react";
import { connect } from "react-redux";
import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import PieChart from "../../../../components/UI/PieChart/PieChart";
import TestMaterials from "../../../StudentPanel/Test/TestMaterials/TestMaterials";
import Accordion from "../../../../components/UI/Accordion/Accordion";
import { getTestRecources } from "../../../../utility/getTestResources";
import TestInfo from "../../../Forms/GradeTestForm/TestInfo/TestInfo";
import { useTheme } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { getPieChartData } from "./getPieChartData";
import McTestDetails from "./McTestDetails";
import EssayTestDetails from "./EssayTestDetails";
import SpeakingTestDetails from "./SpeakingTestDetails";
import FillblankTestDetails from "./FillblankTestDetails";

const Details = ({ modalDocument: test, width, isDarkTheme }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState([0, 0, 0]);
  const { t } = useTranslation();

  const handleNext = (i) => {
    setActiveStep((prevActiveStep) => {
      const newSteps = [...prevActiveStep];
      newSteps[i] = newSteps[i] + 1;
      return newSteps;
    });
  };

  const getBox = (type) => {
    let box = {
      background: "#1976d2",
      borderRadius: 4,
      color: "white",
      padding: 10,
    };
    if (type === "question") box.background = "#1976d2";
    if (type === "solution") box.background = "#388e3c";
    return box;
  };

  const boxStyle = {
    // margin: '15px 0',
    padding: 10,
    borderRadius: 4,
    backgroundColor: isDarkTheme ? "#424242" : "white",
  };

  const handleBack = (i) => {
    setActiveStep((prevActiveStep) => {
      const newSteps = [...prevActiveStep];
      newSteps[i] = newSteps[i] - 1;
      return newSteps;
    });
  };

  const pieChartData = getPieChartData(test, width, t);

  const previewAudio = (audioId) => {
    const audio = document.getElementById(audioId);
    audio.play();
  };

  const display = (
    <Aux>
      <TestInfo test={test} />
      {Object.values(test.sectionWeights).filter((i) => i).length > 1 && (
        <div style={{ height: width > 450 ? 300 : 200 }}>
          <PieChart data={pieChartData} />
        </div>
      )}
      <Accordion
        index="testSectionReview"
        summary={
          test.assignment
            ? t("testReview.assignmentResources")
            : t("testReview.testResources")
        }
        disabled={
          !getTestRecources(test, "test").readingMaterials.content &&
          !getTestRecources(test, "test").audioMaterials.audio &&
          !getTestRecources(test, "test").videoMaterials.video
        }
      >
        <TestMaterials
          audioId="testAudioMaterialReviewTest"
          pdfIndex={4}
          readingContent={
            getTestRecources(test, "test").readingMaterials.content
          }
          audioSource={getTestRecources(test, "test").audioMaterials.audio}
          videoSource={getTestRecources(test, "test").videoMaterials.video}
          onPreview={() => previewAudio("testAudioMaterialReviewTest")}
          fileUpload={
            getTestRecources(test, "test").readingMaterials.fileUpload
          }
        />
      </Accordion>

      {(test.sectionWeights || {}).mcSection && (
        <McTestDetails
          test={test}
          handleNext={handleNext}
          handleBack={handleBack}
          activeStep={activeStep}
          boxStyle={boxStyle}
          t={t}
          previewAudio={previewAudio}
          getBox={getBox}
          theme={theme}
        />
      )}


      {(test.sectionWeights || {}).essaySection && (
        <EssayTestDetails
          test={test}
          handleNext={handleNext}
          handleBack={handleBack}
          activeStep={activeStep}
          boxStyle={boxStyle}
          t={t}
          previewAudio={previewAudio}
          getBox={getBox}
          theme={theme}
        />
      )}


      {(test.sectionWeights || {}).speakingSection && (
        <SpeakingTestDetails
          test={test}
          handleNext={handleNext}
          handleBack={handleBack}
          activeStep={activeStep}
          boxStyle={boxStyle}
          t={t}
          previewAudio={previewAudio}
          getBox={getBox}
          theme={theme} />
      )}

      {(test.sectionWeights || {}).fillBlankSection && (
        <FillblankTestDetails
          test={test}
          handleNext={handleNext}
          handleBack={handleBack}
          activeStep={activeStep}
          boxStyle={boxStyle}
          t={t}
          previewAudio={previewAudio}
        />
      )}
    </Aux>
  );

  return display;
};

const mapStateToProps = (state) => {
  return {
    modalDocument: state.common.modalDocument,
    width: state.common.width,
    isDarkTheme: state.common.isDarkTheme,
  };
};

export default connect(mapStateToProps)(Details);
