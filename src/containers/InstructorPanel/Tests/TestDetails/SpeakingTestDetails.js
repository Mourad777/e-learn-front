import React from 'react'
import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import VolumeUpRoundedIcon from "@material-ui/icons/VolumeUpRounded";
import DOMPurify from "dompurify";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import MobileStepper from "@material-ui/core/MobileStepper";
import Accordion from "../../../../components/UI/Accordion/Accordion";
import { getTestRecources } from '../../../../utility/getTestResources';
import TestMaterials from "../../../StudentPanel/Test/TestMaterials/TestMaterials";

const SpeakingTestDetails = ({ test, handleNext, handleBack, activeStep, boxStyle, t, previewAudio, getBox, theme }) => (
    <div style={{ marginTop: 20, ...boxStyle }}>
        <Typography variant="h6" gutterBottom>
            {t("testReview.speakingsection")}
        </Typography>
        <Accordion
            index="speakingSectionPreview"
            summary={t("testReview.sectionResources")}
            disabled={
                !getTestRecources(test, "speaking").readingMaterials.content &&
                !getTestRecources(test, "speaking").audioMaterials.audio &&
                !getTestRecources(test, "speaking").videoMaterials.video
            }
        >
            <TestMaterials
                audioId="speakingAudioMaterialPreviewTest"
                pdfIndex={2}
                readingContent={
                    getTestRecources(test, "speaking").readingMaterials.content
                }
                audioSource={
                    getTestRecources(test, "speaking").audioMaterials.audio
                }
                videoSource={
                    getTestRecources(test, "speaking").videoMaterials.video
                }
                onPreview={() =>
                    previewAudio("speakingAudioMaterialPreviewTest")
                }
                fileUpload={
                    getTestRecources(test, "speaking").readingMaterials.fileUpload
                }
            />
        </Accordion>
        {(test.speakingQuestions || []).map((question, index) => {
            if (index !== activeStep[2]) return null;
            return (
                <Aux key={question + index}>
                    <Typography
                        style={{ marginTop: 20 }}
                        variant="subtitle1"
                        gutterBottom
                    >
                        {`${t("testReview.question")} ${index + 1}`}
                    </Typography>
                    {question.question && (
                        <div
                            style={getBox("question")}
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(question.question),
                            }}
                        />
                    )}
                    {question.questionAudio && (
                        <div>
                            <audio
                                id={`audioQuestion[${index}]`}
                                src={question.questionAudio}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <Button
                                    startIcon={<VolumeUpRoundedIcon />}
                                    color="primary"
                                    onClick={() => {
                                        previewAudio(`audioQuestion[${index}]`);
                                    }}
                                >
                                    {t("testReview.buttons.playQuestion")}
                                </Button>
                            </div>

                        </div>
                    )}
                    {question.audio && (
                        <div>
                            <audio
                                id={`audioAnswer[${index}]`}
                                src={question.audio}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <Button
                                    startIcon={<VolumeUpRoundedIcon />}
                                    color="primary"
                                    onClick={() => {
                                        previewAudio(`audioAnswer[${index}]`);
                                    }}
                                >
                                    {t("testReview.buttons.playAnswer")}
                                </Button>
                            </div>
                        </div>
                    )}
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
            steps={test.speakingQuestions.length}
            position="static"
            variant="text"
            activeStep={activeStep[2]}
            nextButton={
                <Button
                    size="small"
                    onClick={() => handleNext(2)}
                    disabled={activeStep[2] === test.speakingQuestions.length - 1}
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
                    onClick={() => handleBack(2)}
                    disabled={activeStep[2] === 0}
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

export default SpeakingTestDetails;