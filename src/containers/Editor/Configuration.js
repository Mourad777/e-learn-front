export const getConfiguration = (props, noImage) => {
  const language = localStorage.getItem('i18nextLng')
  let configuration = {
    // height: '1000px',
    // placeholder:'',
    // ckfinder: {
    //   uploadUrl: `${process.env.REACT_APP_SERVER_URL}ckuploader`,
    // },
    language,
    toolbar: {
      viewportTopOffset: 56,
      items: !noImage
        ? [
            // "undo",
            // "redo",
            "highlight",
            "imageUpload",
            // "italic",
            "bold",
            // "blockQuote",
            "imageTextAlternative",
            "imageStyle:full",
            "imageStyle:side",
            // "link",
            "numberedList",
            "bulletedList",
            "heading",
            // "mediaEmbed",
            // "insertTable",
            // "tableColumn",
            // "tableRow",
            // "mergeTableCells"
          ]
        : [
            "highlight",
            "bold",
            "imageTextAlternative",
            "numberedList",
            "bulletedList",
            "heading",
          ],
    },
    highlight: {
      options: [
        {
          model: "yellowMarker",
          class: "marker-yellow",
          title: "Yellow marker",
          color: "var(--ck-highlight-marker-yellow)",
          type: "marker",
        },
        {
          model: "greenMarker",
          class: "marker-green",
          title: "Green marker",
          color: "var(--ck-highlight-marker-green)",
          type: "marker",
        },
        {
          model: "redPen",
          class: "pen-red",
          title: "Red pen",
          color: "var(--ck-highlight-pen-red)",
          type: "pen",
        },
      ],
    },
  };

  if (
    props.testPanelFormFillBlankSection &&
    props.fillInBlankTestFormTextEditorContent
  ) {
    configuration.maxWidth = "50%";
    configuration.placeholder = "Write some text..";
    configuration.highlight.options = [
      {
        model: "yellowMarker",
        class: "marker-yellow",
        title: "Yellow marker",
        color: "var(--ck-highlight-marker-yellow)",
        type: "marker",
      },
    ];
    configuration.toolbar = {
      viewportTopOffset: 56,
      items: [
        "highlight",
        "undo",
        "redo",
        "imageUpload",
        "imageTextAlternative",
        "imageStyle:full",
        "imageStyle:side",
        "bold",
        "italic",
        "numberedList",
        "bulletedList",
        "heading",
      ],
    };
  }

  if (!props.courseDetailSection && props.instructorLoggedIn) {
    configuration.placeholder =
      "Write a syllabus so that students will know what to expect in the course...";
  }
  if ((props.lessonFormTextEditorContent || [])[props.index]) {
    configuration.placeholder = "";
  }
  if (props.testPanelFormEssaySection && props.essayTestFormTextEditorContent) {
    if (props.essayTestFormTextEditorContent[props.index]) {
      configuration.placeholder = "Start writing a question...";
    }
  }
  if (props.testPanelFormMcSection && props.mcTestFormTextEditorContent) {
    if (props.mcTestFormTextEditorContent[props.index]) {
      configuration.placeholder = "Start writing a question...";
    }
  }
  if (
    props.testPanelFormSpeakingSection &&
    props.speakingTestFormTextEditorContent
  ) {
    if (props.speakingTestFormTextEditorContent[props.index]) {
      configuration.placeholder =
        "Start writing some text, use the yellow marker to highlight text that needs to be pronounced by the student";
    }
  }
  
  return configuration;
};
