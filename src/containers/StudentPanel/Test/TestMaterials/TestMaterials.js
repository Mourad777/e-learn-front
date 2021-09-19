import React from "react";
import PdfViewer from "../../../../components/UI/PdfViewer/PdfViewer";
import { getKeyFromAWSUrl } from "../../../../utility/getKeyFromUrl";
import FileViewer from "react-file-viewer";
import AudioPreview from "../../../../components/UI/AudioPlayer/AudioPlayerAdvanced";
import Typography from "@material-ui/core/Typography";
import DOMPurify from "dompurify";
import '../Test.css'
import { useTranslation } from "react-i18next";
import VideoPlayer from "../../../../components/UI/VideoPlayer/VideoPlayer";


const TestMaterials = ({
  readingContent,
  audioSource,
  videoSource,
  fileUpload,
  materialsSection,
}) => {
  const questionBox = {
    background: '#1976d2',
    borderRadius: 4,
    color: 'white',
    padding: 10,
    marginTop: 40,
  }
  const { t } = useTranslation();
  let document;
  const documentKey = getKeyFromAWSUrl(readingContent);
  const documentExtension = (documentKey || "").split(".").pop();
  if (fileUpload) {
    if (documentExtension === "pdf") {
      document = <PdfViewer url={readingContent} index={materialsSection} />;
    }
    if (
      documentExtension === "jfif" ||
      documentExtension === "jpgeg" ||
      documentExtension === "jpg"
    ) {
      document = (
        <div
          style={{
            backgroundImage: `url("${readingContent}")`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            height: "200px",
            borderRadius: "3px",
            width: "100%",
            margin: "auto",
          }}
        />
      );
    }
  }
  if (documentExtension === "docx" || documentExtension === "doc") {
    document = (
      <FileViewer fileType={documentExtension} filePath={readingContent} />
    );
  }
  return (
    <div style={{ marginBottom: 20 }}>
      {readingContent && (
        <Typography paragraph variant="h6">
          {t("testMaterials.useTheFollowingContent")}
        </Typography>
      )}
      {!fileUpload && readingContent && (
        <div
          style={questionBox}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(readingContent),
          }}
        />
      )}
      {fileUpload && readingContent && <div>{document}</div>}
      {audioSource && (
        <div style={{ marginTop: 40 }}>
          <Typography paragraph variant="h6">
            {t("testMaterials.useTheAudio")}
          </Typography>
          <AudioPreview audioSource={audioSource} />
        </div>
      )}
      {videoSource && (
        <div style={{ marginTop: 40 }}>
          <Typography paragraph variant="h6">
            {t("testMaterials.useTheVideo")}
          </Typography>
          <VideoPlayer url={videoSource} />
        </div>
      )}
    </div>
  );
};

export default TestMaterials;
