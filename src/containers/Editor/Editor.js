import React, { Component } from "react";
import { getConfiguration } from "./Configuration";
import CKEditor from "@ckeditor/ckeditor5-react";
import axios from "axios";
import {
  ClassicEditor,
  BalloonEditor,
} from "@ckeditor/ckeditor5-build-classic/build/ckeditor";
import { debounce } from "../../store/utility";
import { connect } from "react-redux";
import {
  change,
  touch,
  getFormValues,
  updateSyncErrors,
  getFormSyncErrors,
} from "redux-form";
import * as actions from "../../store/actions/index";
import classes from "./Editor.module.css";
import validateTestForm from "../Forms/TestForm/validate";
import { getFile } from "../../utility/getFile";
import imageCompression from "browser-image-compression";
import { getKey } from "../../utility/uploadFile";
import '@ckeditor/ckeditor5-build-classic/build/translations/es.js'
// import './custom.css'


class UploadAdapter {
  constructor(loader, token, path) {
    // Save Loader instance to update upload progress.
    this.loader = loader;
    this.token = token;
    this.path = path;
  }

  async upload() {
    const resolvedLoader = await new Promise((resolve) => {
      resolve(this.loader.file);
    }).then(async (file) => {
      const compressionOptions = {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressedImage = await imageCompression(file, compressionOptions);
      const compressedFile = new File([compressedImage], compressedImage.name);

      const resolvedFileUpload = await new Promise(async (resolve, reject) => {
        const key = getKey(compressedFile, this.path);
        const fileInfo = new FormData();

        fileInfo.append("key", key);

        const uploadConfig = await axios({
          url: `${process.env.REACT_APP_SERVER_URL}upload`,
          method: "PUT",
          headers: {
            Authorization: "Bearer " + this.token,
          },
          data: fileInfo,
        });

        let form = new FormData();
        Object.keys(uploadConfig.data.presignedUrl.fields).forEach((key) => {
          form.append(key, uploadConfig.data.presignedUrl.fields[key]);
        });
        form.append("file", file);

        const response = await axios.post(
          uploadConfig.data.presignedUrl.url,
          form
        );

        console.log("Image upload adapter response: ", response);
        const previewImageBlob = await getFile(key, "image/jpeg", this.token);

        resolve({
          ...uploadConfig,
          default: previewImageBlob.toString(),
        });
      });
      return resolvedFileUpload;
    });
    return resolvedLoader;
  }

  abort() {
    // Reject promise returned from upload() method.
  }
}

class TextEditor extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      previousImages: [],
      editingImages: [],
      latestTestFormValues: {},
      keys: [],
      editorContent: null,
    };
  }

  componentDidMount() {
    const imgUrlBlobs = Array.from(
      new DOMParser()
        .parseFromString((this.props.input || {}).value, "text/html")
        .querySelectorAll("img")
    ).map((img) => img.getAttribute("src"));

    const imgUrlBlobsAdjusted = imgUrlBlobs.map((item) => {
      if ((item || '').includes(process.env.REACT_APP_AWS_URL)) {
        //get the s3 key from presigned url
        return item.match(
          new RegExp(process.env.REACT_APP_AWS_URL + "(.*)" + "\\?X-Amz")
        )[1];
      }
      return item;
    });

    this.setState({ editingImages: imgUrlBlobsAdjusted });
  }

  componentWillReceiveProps(nextProps) {
    const latestTestFormValues = nextProps.testFormValues;
    this.setState({
      latestTestFormValues: latestTestFormValues,
    });
  }

  handleContentStringChange = (string) => {
    this.setState({ editorContent: string });
  };

  getImgUrl = (contentString) => {
    //a but deletes instructor feedback image in written section
    //when reviewing test part so make a check to leave
    // function if reviewing test
    if (this.props.testReviewing) return;
    const imgUrls = Array.from(
      new DOMParser()
        .parseFromString(contentString, "text/html")
        .querySelectorAll("img")
    ).map((img) => img.getAttribute("src"));
    const fixedImgUrls = imgUrls.map((item) => {
      if (item && item.includes(process.env.REACT_APP_AWS_URL)) {
        return item.match(
          new RegExp(process.env.REACT_APP_AWS_URL + "(.*)" + "\\?X-Amz")
        )[1];
      }
      return item;
    });
    const oldImgState = this.state.previousImages;
    this.setState({ previousImages: fixedImgUrls });
    const updatedImgState = this.state.previousImages;
    //check to see if the length of the array of updated image state is
    //less than the length of the array of the old state
    //in that case get the img url and send a request to delete it

    const urlToDelete = oldImgState.find(
      (url) => !updatedImgState.includes(url)
    );
    if (!this.state.editingImages.includes(urlToDelete) && urlToDelete) {
      this.props.deleteImg(urlToDelete, this.props.token);
    }
  };

  getEditorType(editorType) {
    if (editorType === "balloon") return BalloonEditor;
    return ClassicEditor;
  }

  render() {
    const {
      meta = {},
      error,
      input = {},
      field = "",
      reduxForm = "",
      testFormErrors,
      updateTestFormErrors,
      changeField,
      questionType,
      type,
      border,
      isModal,
      token,
      path,
      readOnly,
      testFormSection,
      noImage,
      blockFillblankSynchronization,
      isDarkTheme,
    } = this.props;
    let questionErrorMessage;
    let editorError;
    if (reduxForm !== "studentTest") {
      const latestTestFormErrors =
        validateTestForm(this.state.latestTestFormValues) || {};

      const oldQuestionErrorMessage = (
        (testFormErrors || {}).fillBlankQuestions || {}
      ).question;
      questionErrorMessage = (
        validateTestForm(this.state.latestTestFormValues) || {}
      ).fillBlankQuestions.question;

      const answers = (validateTestForm(this.state.latestTestFormValues) || {})
        .fillBlankQuestions.answers;
      if (
        (answers || []).length > 0 &&
        (questionErrorMessage || "").includes("Create at least 1 blank")
      ) {
        meta.error = "";
      }

      if (
        (reduxForm === "testForm" && testFormSection === "fillblanks") ||
        (reduxForm === "questionForm" && questionType === "fillInBlank")
      ) {
        editorError = questionErrorMessage;
      } else {
        editorError = meta.error || error;
      }
      if (
        questionErrorMessage !== oldQuestionErrorMessage &&
        questionErrorMessage &&
        (questionType === "fillInBlank" || testFormSection === "fillblanks") &&
        (reduxForm === "testForm" || reduxForm === "questionForm")
      ) {
        updateTestFormErrors(reduxForm, {
          ...latestTestFormErrors,
          fillBlankQuestions: {
            question: questionErrorMessage,
            answers,
          },
          fillblankPageError: testFormErrors.fillblankPageError,
        });
      }
    }
    const content = (input || {}).value || "";
    return (
      <div className={["App", classes[border]].join(" ")}>
        {this.props.label && (
          <div className={classes.textLabel}>{`${this.props.label}:`}</div>
        )}
        <CKEditor
          config={getConfiguration(this.props, noImage)}
          editor={this.getEditorType(type)}
          data={content || ""}
          onInit={(editor) => {
            editor.isReadOnly = readOnly;
            const createdAdapter = (loader) => {
              return new UploadAdapter(loader, token, path);
            };
            editor.plugins.get(
              "FileRepository"
            ).createUploadAdapter = createdAdapter;
          }}
          onChange={(event, editor) => {
            this.props.makeTouched(meta.form, field);
            const contentString = editor.getData();
            this.handleContentStringChange(contentString);
            if (reduxForm) {
              changeField(reduxForm, field, contentString);
            }
            this.getImgUrl(contentString);
          }}
        />
        <span className={classes.errorText}>
          {(meta.error || error) &&
            meta.touched &&
            !blockFillblankSynchronization
            ? editorError
            : ""}
        </span>
      </div>
    );
  }
}
const mapStateToProps = (state, myProps) => {
  return {
    testFormValues: getFormValues(myProps.reduxForm)(state),
    testFormErrors: getFormSyncErrors(myProps.reduxForm)(state),
    testReviewing: state.studentTesttestReviewing,
    questionType: state.instructorQuestion.creatingQuestionType,
    fillBlankSection: state.instructorTest.testPanelFormFillInBlanksSection,
    token: state.authentication.token,
    testFormSection: state.instructorTest.testFormSection,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeField: (form, field, value) => {
      dispatch(change(form, field, value));
    },
    makeTouched: (form, field) => {
      dispatch(touch(form, field));
    },
    deleteImg: (img, token) => {
      dispatch(actions.deleteFilesStart([img]), token);
    },
    updateTestFormErrors: (form, values) => {
      dispatch(updateSyncErrors(form, values));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(TextEditor);
