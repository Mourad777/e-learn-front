import React from 'react'
import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import DOMPurify from "dompurify";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import MobileStepper from "@material-ui/core/MobileStepper";
import Accordion from "../../../../components/UI/Accordion/Accordion";
import { getTestRecources } from '../../../../utility/getTestResources';
import TestMaterials from "../../../StudentPanel/Test/TestMaterials/TestMaterials";

const EssayTestDetails = ({ test,handleNext,handleBack,activeStep,boxStyle,t,previewAudio,getBox,theme }) => (
    <div style={{ marginTop: 20, ...boxStyle }}>
        <Typography variant="h6" gutterBottom>
            {t("testReview.essaysection")}
        </Typography>
    
        <Accordion
            disabled={
                !getTestRecources(test, "essay").readingMaterials.content &&
                !getTestRecources(test, "essay").audioMaterials.audio &&
                !getTestRecources(test, "essay").videoMaterials.video
            }
            index="essaySectionPreview"
            summary={t("testReview.sectionResources")}
        >
            <TestMaterials
                audioId="essayAudioMaterialPreviewTest"
                pdfIndex={1}
                readingContent={
                    getTestRecources(test, "essay").readingMaterials.content
                }
                audioSource={
                    getTestRecources(test, "essay").audioMaterials.audio
                }
                videoSource={
                    getTestRecources(test, "essay").videoMaterials.video
                }
                onPreview={() => previewAudio("essayAudioMaterialPreviewTest")}
                fileUpload={
                    getTestRecources(test, "essay").readingMaterials.fileUpload
                }
            />
        </Accordion>
        {(test.essayQuestions || []).map((question, index) => {
            if (index !== activeStep[1]) return null;
            return (
                <Aux key={question + index}>
                    <Typography
                        style={{ marginTop: 20 }}
                        variant="subtitle1"
                        gutterBottom
                    >
                        {`${t("testReview.question")} ${index + 1}`}
                    </Typography>
                    <div
                        style={getBox("question")}
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(question.question),
                        }}
                    />
                    {question.solution && (
                        <div style={{ marginTop: 20 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                {t("testReview.solution")}
                            </Typography>
                            <div style={getBox("solution")}>
                                <Typography variant="body2" gutterBottom>
                                    {question.solution}
                                </Typography>
                            </div>
                        </div>
                    )}
                </Aux>
            );
        })}
        <MobileStepper
            steps={test.essayQuestions.length}
            position="static"
            variant="text"
            activeStep={activeStep[1]}
            nextButton={
                <Button
                    size="small"
                    onClick={() => handleNext(1)}
                    disabled={activeStep[1] === test.essayQuestions.length - 1}
                >
                    {t("testReview.buttons.next")}
                    {theme.direction === "rtl" ? (
                        <KeyboardArrowLeft />
                    ) : (
                        <KeyboardArrowRight />
                    )}
                </Button>
            }
            backButton={
                <Button
                    size="small"
                    onClick={() => handleBack(1)}
                    disabled={activeStep[1] === 0}
                >
                    {theme.direction === "rtl" ? (
                        <KeyboardArrowRight />
                    ) : (
                        <KeyboardArrowLeft />
                    )}
                    {t("testReview.buttons.back")}
                </Button>
            }
        />
    </div>
)

export default EssayTestDetails;