import React, { Component } from "react";
import classes from "./PdfViewer.module.css";
import { Document, Page, pdfjs } from "react-pdf/dist/entry.webpack";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Button from "@material-ui/core/Button";
import { IconButton } from "@material-ui/core";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import NumberPicker from "../FormElements/NumberPicker/NumberPicker";
import { withTranslation } from "react-i18next";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class PdfViewer extends Component {
  state = {
    numPages: null,
    pageNumber: 1,
    scale: 0.6,
  };

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages, pageNumber: 1 });
  };

  previousPdfPage = () => {
    if (this.state.pageNumber > 1)
      this.setState({ pageNumber: this.state.pageNumber - 1 });
  };

  nextPdfPage = () => {
    if (this.state.pageNumber < this.state.numPages)
      this.setState({ pageNumber: this.state.pageNumber + 1 });
  };

  setPdfPage = (e) => {
    const num = parseInt(e.target.value);
    let newValue = num;
    if (num > this.state.numPages) newValue = this.state.numPages;
    if (num < 1) newValue = 1;
    if (num === NaN || !num) newValue = 1;

    this.setState({ pageNumber: parseInt(newValue) });
  };

  handleScale = (direction) => {
    // if (this.state.pageNumber < this.state.numPages)
    if (direction === "in")
      this.setState((prevState) => {
        return { scale: prevState.scale + 0.2 };
      });
    if (direction === "out")
      this.setState((prevState) => {
        return { scale: prevState.scale - 0.2 };
      });
  };

  render() {
    const { pageNumber, numPages, scale } = this.state;
    const { url,t } = this.props;
    const pageNumberOptions = {
      label:  t("pdf.goToPage"),
      size: "small",
    };
    return (
      <div>
        <p className={classes.pageNumberDisplay}>
          {t("pdf.page")} {pageNumber} {t("pdf.of")} {numPages}
        </p>
        <div className={classes.flexPositioningEven}>
          <Button
            disabled={pageNumber === 1}
            color="default"
            onClick={this.previousPdfPage}
            startIcon={<ArrowBackIosIcon />}
            size="small"
          >
            {t("pdf.page")} {pageNumber === 1 ? 1 : pageNumber - 1}
          </Button>

          <Button
            disabled={pageNumber === numPages}
            onClick={this.nextPdfPage}
            color="default"
            endIcon={<ArrowForwardIosIcon />}
            size="small"
          >
             {t("pdf.page")} {pageNumber === numPages ? numPages : pageNumber + 1}
          </Button>
        </div>
        <div style={{ display: "flex", justifyContent:'space-evenly' }}>
          <NumberPicker
            options={pageNumberOptions}
            // onChange={this.setPdfPage}
            input={{ onChange: this.setPdfPage }}
          />
        </div>
        <div style={{ overflow: "scroll", maxHeight: "450px" }}>
          <Document
            className={classes.pdfCanvas}
            file={url}
            onLoadSuccess={this.onDocumentLoadSuccess}
            onLoadError={(err) => console.log(err)}
            renderMode="svg"
          >
            <Page scale={scale} pageNumber={pageNumber} />
          </Document>
        </div>
        <div className={classes.flexPositioningEven}>
          <IconButton
            onClick={() => {
              if (this.state.scale >= 0) this.handleScale("out");
            }}
            color="primary"
            component="span"
          >
            <ZoomOutIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              this.handleScale("in");
            }}
            color="primary"
            component="span"
          >
            <ZoomInIcon />
          </IconButton>
        </div>
      </div>
    );
  }
}

export default withTranslation("common")(PdfViewer);
