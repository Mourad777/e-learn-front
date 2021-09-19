import React from 'react';
import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import classes from "./Details.module.css";
import DOMPurify from "dompurify";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import MobileStepper from "@material-ui/core/MobileStepper";
import Accordion from "../../../../components/UI/Accordion/Accordion";
import { getTestRecources } from '../../../../utility/getTestResources';
import TestMaterials from "../../../StudentPanel/Test/TestMaterials/TestMaterials";

const McTestDetails = ({ test,handleNext,handleBack,activeStep,boxStyle,t,previewAudio,getBox,theme }) => (
                <div style={{ marginTop: 20, ...boxStyle }}>
                    <Typography variant="h6" gutterBottom>
                        {t("testReview.multiplechoicesection")}
                    </Typography>
                    <Accordion
                        disabled={
                            !getTestRecources(test, "mc").readingMaterials.content &&
                            !getTestRecources(test, "mc").audioMaterials.audio &&
                            !getTestRecources(test, "mc").videoMaterials.video
                        }
                        index="mcSectionPreview"
                        summary={t("testReview.sectionResources")}
                    >
                        <TestMaterials
                            audioId="mcAudioMaterialPreviewTest"
                            pdfIndex={0}
                            readingContent={
                                getTestRecources(test, "mc").readingMaterials.content
                            }
                            audioSource={getTestRecources(test, "mc").audioMaterials.audio}
                            videoSource={getTestRecources(test, "mc").videoMaterials.video}
                            onPreview={() => previewAudio("mcAudioMaterialPreviewTest")}
                            fileUpload={
                                getTestRecources(test, "mc").readingMaterials.fileUpload
                            }
                        />
                    </Accordion>

                    {(test.multipleChoiceQuestions || []).map((question, index) => {
                        if (index !== activeStep[0]) return null;
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
                                {question.answerOptions.map((option, index) => (
                                    <Typography
                                        className={
                                            question.correctAnswers.includes((index + 1).toString())
                                                ? classes.GreenText
                                                : classes.RedText
                                        }
                                        key={option + index}
                                        variant="body2"
                                        gutterBottom
                                    >
                                        {option}
                                    </Typography>
                                ))}
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
                        steps={test.multipleChoiceQuestions.length}
                        position="static"
                        variant="text"
                        activeStep={activeStep[0]}
                        nextButton={
                            <Button
                                size="small"
                                onClick={() => handleNext(0)}
                                disabled={
                                    activeStep[0] === test.multipleChoiceQuestions.length - 1
                                }
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
                                onClick={() => handleBack(0)}
                                disabled={activeStep[0] === 0}
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

export default McTestDetails;