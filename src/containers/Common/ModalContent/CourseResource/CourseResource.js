import React from "react";
import { connect } from "react-redux";
import FileViewer from "react-file-viewer";
import PdfViewer from "../../../../components/UI/PdfViewer/PdfViewer";
import VideoPlayer from "../../../../components/UI/VideoPlayer/VideoPlayer";
const CourseResource = ({ modalDocument: { loadedFile, ext } }) => {
  let document;
  if (ext === "jfif" || ext === "jpeg" || ext === "jpg") {
    document = (
      <div
        style={{
          backgroundImage: `url("${loadedFile}")`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          height: "300px",
          borderRadius: "3px",
          width: "100%",
          margin: "auto",
        }}
      ></div>
    );
  }
  if (ext === "docx" || ext === "doc") {
    document = <FileViewer fileType={ext} filePath={loadedFile} />;
  }
  if (ext === "pdf") {
    document = <PdfViewer url={loadedFile} />;
  }
  if (ext === "mp4" || ext === "avi")
    document = <VideoPlayer url={loadedFile} />;
  return <div>{document}</div>;
};

const mapStateToProps = (state) => {
  return {
    modalDocument: state.common.modalDocument,
  };
};

export default connect(mapStateToProps)(CourseResource);
