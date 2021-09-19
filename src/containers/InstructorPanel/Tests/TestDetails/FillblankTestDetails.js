import React from 'react'
import { getProcessedFillblankText } from './getProcessedFillblankText';
import Typography from "@material-ui/core/Typography";
import Accordion from "../../../../components/UI/Accordion/Accordion";
import { getTestRecources } from '../../../../utility/getTestResources';
import TestMaterials from "../../../StudentPanel/Test/TestMaterials/TestMaterials";

const FillblankTestDetails = ({ test, boxStyle, t, previewAudio }) => (

  <div style={{ marginTop: 20, ...boxStyle }}>
    <Typography variant="h6" gutterBottom>
      {t("testReview.fillintheblankssection")}
    </Typography>
    <Accordion
      index="fillblanksSectionPreview"
      summary={t("testReview.sectionResources")}
      disabled={
        !getTestRecources(test, "fillblanks").readingMaterials
          .content &&
        !getTestRecources(test, "fillblanks").audioMaterials.audio &&
        !getTestRecources(test, "fillblanks").videoMaterials.video
      }
    >
      <TestMaterials
        audioId="fillblanksAudioMaterialPreviewTest"
        pdfIndex={3}
        readingContent={
          getTestRecources(test, "fillblanks").readingMaterials.content
        }
        audioSource={
          getTestRecources(test, "fillblanks").audioMaterials.audio
        }
        videoSource={
          getTestRecources(test, "fillblanks").videoMaterials.video
        }
        onPreview={() =>
          previewAudio("fillblanksAudioMaterialPreviewTest")
        }
        fileUpload={
          getTestRecources(test, "fillblanks").readingMaterials
            .fileUpload
        }
      />
    </Accordion>
    <div
      style={{ marginTop: 20 }}
      dangerouslySetInnerHTML={{
        __html: getProcessedFillblankText(test, t)
      }}
    />
  </div>
)

export default FillblankTestDetails;