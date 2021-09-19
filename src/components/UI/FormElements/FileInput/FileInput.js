import React, { Component, Fragment } from "react";
import Button from "@material-ui/core/Button";
import imageCompression from "browser-image-compression";
import FileViewer from "react-file-viewer";
import { withTranslation } from "react-i18next";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import IconButton from "@material-ui/core/IconButton";

class FieldFileInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      changingDoc: false,
    };
  }
  handleFileChange = async (e, index) => {
    this.setState({ changingDoc: true });
    if (!e.target.files[0]) return;
    const {
      extensionsAllowed,
      input: { onChange, value },
    } = this.props;
    const extension = e.target.files[0].name.toLowerCase().split(".").pop();
    if (!extensionsAllowed.includes(extension)) {
      return;
    }
    const compressionOptions = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    let file = e.target.files[0];
    if (
      this.props.compressImage &&
      (extension === "jpeg" || extension === "jpg" || extension === "jfif")
    ) {
      const compressedImage = await imageCompression(
        e.target.files[0],
        compressionOptions
      );
      file = new File([compressedImage], compressedImage.name);
    }

    try {
      this.props.onChangeFile(URL.createObjectURL(file), index); //updates redux blob
      onChange(file); //updates redux file
      e.target.value = null;
    } catch (err) {
      console.log("err: ", err);
    }
  };

  handleDocChange = (value) => {
    //fixes a bug where the File viewer for docx files do not rerender
    //so this function unmounts and remounts the fileviewer
    this.setState({ changingDoc: value });
  };

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (prevState.changingDoc === true) this.handleDocChange(false);
  };

  render() {
    const {
      index,
      meta = {},
      videoFile,
      loadedFile,
      onClear,
      source,
      children,
      uploadButtonText,
      circle,
      fullSizeImage,
      mimeTypesAllowed,
      input,
      preview,
      uploadButtonMinWidth,
      attachIcon,
      disabled,
      t,
    } = this.props; //whatever props you send to the component from redux-form Field

    let loadedExt;
    if (input.value instanceof File) {
      loadedExt = (input.value || {}).name.toLowerCase().split(".").pop();
    } else {
      loadedExt = (input.value || "").toLowerCase().split(".").pop();
    }
    return (
      <Fragment>
        <div>
          <div>
            <input
              disabled={disabled}
              accept={mimeTypesAllowed}
              type="file"
              onChange={(e) => {
                console.log('e: ',e.target.files)
                if (e) e.persist();
                this.handleFileChange(e, index);
              }}
              style={{ display: "none" }}
              id={`fileInput${index}` || "contained-button-file"}
            />
          </div>
          {loadedFile &&
            preview !== false &&
            (loadedExt === "jpeg" ||
              loadedExt === "jpg" ||
              loadedExt === "jfif") && (
              <div
                style={{
                  backgroundImage: `url("${loadedFile}")`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  height: fullSizeImage ? "400px" : "200px",
                  borderRadius: circle ? "50%" : "3px",
                  maxWidth: fullSizeImage
                    ? "800px"
                    : circle
                    ? "200px"
                    : "300px",
                  width: "100%",
                  margin: "auto",
                }}
              />
            )}
          <label
            style={{ textAlign: "center", display: "block" }}
            htmlFor={`fileInput${index}` || "contained-button-file"}
          >
            {attachIcon ? (
              <IconButton style={{opacity:disabled ? 0.3 : 1}} onClick={()=>{if(disabled)return}} disabled={disabled} component="span">
                <AttachFileIcon style={{ color: "white" }} />
              </IconButton>
            ) : (
              <Button
                style={{ minWidth: uploadButtonMinWidth }}
                variant="contained"
                color="primary"
                component="span"
              >
                {uploadButtonText
                  ? uploadButtonText
                  : t("fileInput.buttons.upload")}
              </Button>
            )}
          </label>
          <div>
            {loadedFile &&
              preview !== false &&
              this.state.changingDoc === false &&
              (loadedExt === "docx" || loadedExt === "doc") && (
                <div id={`doc[${index}]`}>
                  <FileViewer fileType={loadedExt} filePath={loadedFile} />
                </div>
              )}
          </div>
          {meta.error && meta.touched && (
            <span
              style={{ color: "#E91313", fontSize: "0.7em", display: "block" }}
            >
              {meta.error}
            </span>
          )}
        </div>
        {children}
        {videoFile && (
          <Button
            type="button"
            onClick={onClear}
            color="secondary"
            disabled={!loadedFile}
          >
            {t("fileInput.buttons.clearVideo")}
          </Button>
        )}
      </Fragment>
    );
  }
}

export default withTranslation("common")(FieldFileInput);
