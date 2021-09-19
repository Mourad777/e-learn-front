import { urlKeyConverter } from "./urlKeyConverter";

export const getUrls = (values, source, questionType) => {
  //check for empty object
  if (!values || (Object.keys(values).length === 0 && values.constructor === Object)) return []
  const getUrlsFromString = (string = "") => {
    const urls = Array.from(
      new DOMParser()
        .parseFromString(string, "text/html")
        .querySelectorAll("img")
    ).map((img) => img.getAttribute("src"));
    return urls;
  };

  if (source === "courseForm") {
    const urls = []
    const syllabusUrls = getUrlsFromString(values.syllabus) || [];
    syllabusUrls.forEach((url) => urls.push(urlKeyConverter(url)));
    return urls;
  }

  if (source === "gradeTestAnswers") {
    const initialUrls = [];
    //essay section urls
    const studentAnswers = (
      ((values || {}).essaySection || {}).answers || []
    ).map((item) => item.answer);

    studentAnswers.forEach((string) => {
      const urls = getUrlsFromString(string);
      urls.forEach((url) => {
        initialUrls.push(urlKeyConverter(url));
      });
    });
    return initialUrls;
  }
  if (source === "gradeTest") {
    const initialUrls = [];

    //essay section urls
    const instructorCorrections = ((values || {}).essaySection || []).map(
      (item) => item.instructorCorrection
    );

    instructorCorrections.forEach((string) => {
      const urls = getUrlsFromString(string);
      urls.forEach((url) => {
        initialUrls.push(urlKeyConverter(url));
      });
    });

    //speaking section urls
    const speakingAnswerAudioUrls = ((values || {}).speakingSection || []).map(
      (item) => item.audioFile
    );
    speakingAnswerAudioUrls.forEach((item) =>
      initialUrls.push(urlKeyConverter(item))
    );
    return initialUrls;
  }
  if (source === "studentTest") {
    const urls = [];
    //written section urls
    ((values || {}).essayQuestions || []).forEach((string) => {
      const urlsFromString = getUrlsFromString(string);
      urlsFromString.forEach((url) => {
        urls.push(urlKeyConverter(url));
      });
    });
    //speaking section urls
    const speakingAnswerAudioUrls = ((values || {}).speakingQuestions || [])
      .filter((item) => item)
      .map((item) => item.audioFile);
    speakingAnswerAudioUrls.forEach((item) => urls.push(urlKeyConverter(item)));
    return urls;
  }
  //get all urls from all questions of a specified course
  if (source === "courseQuestions") {
    const urls = [];
    const questions = values || [];
    questions.forEach((question) => {
      if (question.type === "mc") {
        const questionUrls =
          getUrlsFromString((question.mcQuestion || {}).question) || [];
        questionUrls.forEach((url) => urls.push(urlKeyConverter(url)));
      }
      if (question.type === "essay") {
        const questionUrls =
          getUrlsFromString((question.essayQuestion || {}).question) || [];
        questionUrls.forEach((url) => urls.push(urlKeyConverter(url)));
      }
      if (question.type === "speaking") {
        const questionUrls =
          getUrlsFromString((question.speakingQuestion || {}).question) || [];
        questionUrls.forEach((url) => urls.push(urlKeyConverter(url)));
        const audioQuestion = (question.speakingQuestion || {}).audioQuestion;
        if (audioQuestion && audioQuestion !== "")
          urls.push(urlKeyConverter(audioQuestion));
        const audioAnswer = (question.speakingQuestion || {}).audio;
        if (audioAnswer && audioAnswer !== "")
          urls.push(urlKeyConverter(audioAnswer));
      }
      if (question.type === "fillInBlank") {
        const questionUrls =
          getUrlsFromString((question.fillBlankQuestions || {}).question) || [];
        questionUrls.forEach((item) => urls.push(urlKeyConverter(item)));

        Array.from((question.fillBlankQuestions || {}).blanks || []).forEach(
          (item) => {
            if (item.audio) urls.push(urlKeyConverter(item.audio));
          }
        );
      }
    });
    return urls;
  }
  //get all urls from the 4 question types from all tests of a specified course
  if (source === "courseTests") {
    const urls = [];
    const tests = values || [];
    tests.forEach((test) => {
      (test.multipleChoiceQuestions || []).forEach((mcq) => {
        const questionUrls = getUrlsFromString(mcq.question) || [];
        questionUrls.forEach((url) => urls.push(urlKeyConverter(url)));
      });
      (test.essayQuestions || []).forEach((essayq) => {
        const questionUrls = getUrlsFromString(essayq.question) || [];
        questionUrls.forEach((url) => urls.push(urlKeyConverter(url)));
      });
      (test.speakingQuestions || []).forEach((speakingq) => {
        const questionUrls = getUrlsFromString(speakingq.question) || [];
        questionUrls.forEach((url) => urls.push(urlKeyConverter(url)));
        if (speakingq.questionAudio && speakingq.questionAudio !== "")
          urls.push(urlKeyConverter(speakingq.questionAudio));
        if (speakingq.audio && speakingq.audio !== "")
          urls.push(urlKeyConverter(speakingq.audio));
      });
      const fillBlankText = (test.fillInBlanksQuestions || {}).text;
      const fillBlankAnswers = (test.fillInBlanksQuestions || {}).blanks || [];
      const fillBlankTextUrls = getUrlsFromString(fillBlankText) || [];
      fillBlankTextUrls.forEach((url) => urls.push(urlKeyConverter(url)));
      fillBlankAnswers.forEach((blank) => {
        if (blank.audio) urls.push(urlKeyConverter(blank.audio));
      });
    });
    return urls;
  }

  if (source === "testForm") {
    const startingValues = values || {};
    const initialUrls = [];
    //mc section urls
    const mcQuestionImgStrings = (startingValues.mcQuestions || []).map(
      (item) => item.question
    );
    mcQuestionImgStrings.forEach((string) => {
      const urls = getUrlsFromString(string);
      urls.forEach((url) => {
        initialUrls.push(urlKeyConverter(url));
      });
    });
    //essay section urls
    const essayQuestionImgStrings = (startingValues.essayQuestions || []).map(
      (item) => item.question
    );
    essayQuestionImgStrings.forEach((string) => {
      const urls = getUrlsFromString(string);
      urls.forEach((url) => {
        initialUrls.push(urlKeyConverter(url));
      });
    });
    //speaking section urls
    const speakingQuestionImgStrings = (
      startingValues.speakingQuestions || []
    ).map((item) => {
      if (!item.audioQuestion) return item.question;
    });

    speakingQuestionImgStrings.forEach((string) => {
      const urls = getUrlsFromString(string);
      urls.forEach((url) => {
        initialUrls.push(urlKeyConverter(url));
      });
    });
    const speakingQuestionAudioUrls = (startingValues.speakingQuestions || [])
      .filter((item) => {
        if (item.audioQuestion) return item;
      })
      .map((item) => item.questionRecordedBlob);

    const speakingAnswerAudioUrls = (startingValues.speakingQuestions || [])
      .filter((item) => {
        if (item.audioAnswer) return item;
      })
      .map((item) => item.recordedBlob);
    speakingQuestionAudioUrls.forEach((url) =>
      initialUrls.push(urlKeyConverter(url))
    );
    speakingAnswerAudioUrls.forEach((url) =>
      initialUrls.push(urlKeyConverter(url))
    );
    //fill in blank urls
    const fillInBlankString = (startingValues.fillBlankQuestions || {})
      .question;
    const fillInBlankImgUrls = getUrlsFromString(fillInBlankString) || [];
    const fillInBlankAudioUrls = (
      (startingValues.fillBlankQuestions || {}).answers || []
    )
      .map((item) => item.browserAudioFile)
      .filter((item, index) => {
        if (
          (
            ((startingValues.fillBlankQuestions || {}).answers || [])[index] ||
            {}
          ).audio
        ) {
          return item;
        }
      });
    fillInBlankImgUrls.forEach((url) => {
      initialUrls.push(urlKeyConverter(url));
    });
    fillInBlankAudioUrls.forEach((url) => {
      initialUrls.push(urlKeyConverter(url));
    });
    //test materials
    const readingMaterials = Object.values(
      startingValues.readingMaterial || {}
    );
    readingMaterials.forEach((item) => {
      if (item.fileUpload && item.loadedPDF) {
        initialUrls.push(urlKeyConverter(item.loadedPDF));
      }
      if (!item.fileUpload && item.content) {
        (getUrlsFromString(item.content) || []).forEach((url) =>
          initialUrls.push(urlKeyConverter(url))
        );
      }
    });
    const audioMaterials = Object.values(startingValues.audioMaterial || {});
    audioMaterials.forEach((item) => {
      if (item.recordedBlob) {
        initialUrls.push(urlKeyConverter(item.recordedBlob));
      }
    });
    const videoMaterials = Object.values(startingValues.videoMaterial || {});
    videoMaterials.forEach((item) => {
      if ((item||{}).videoBlob) {
        initialUrls.push(urlKeyConverter(item.videoBlob));
      }
    });
    return initialUrls;
  }

  if (source === "questionForm") {
    let questionForm = "";
    const questionTypes = ["mc", "essay", "speaking", "fillInBlank"];
    const questionForms = [
      "mcQuestion",
      "essayQuestion",
      "speakingQuestion",
      "fillBlankQuestions",
    ];

    const startingValues = values || {};
    const initialUrls = [];

    questionTypes.forEach((type, index) => {
      if (type === questionType) {
        questionForm = questionForms[index];
      }
    });
    let questionImgString = (startingValues[questionForm] || {}).question;

    if (questionForm === "speakingQuestion") {
      questionImgString = !((startingValues.speakingQuestion || [])[0] || {})
        .audioQuestion
        ? ((startingValues.speakingQuestion || [])[0] || {}).question
        : null;
    }

    const urls = getUrlsFromString(questionImgString);
    urls.forEach((url) => {
      initialUrls.push(urlKeyConverter(url));
    });

    if (questionType === "speaking") {
      const speakingQuestionAudioUrl = (
        (startingValues.speakingQuestion || [])[0] || {}
      ).questionRecordedBlob;
      if (
        speakingQuestionAudioUrl &&
        (((values || {}).speakingQuestion || [])[0] || {}).audioQuestion !==
        false
      ) {
        initialUrls.push(urlKeyConverter(speakingQuestionAudioUrl));
      }

      const speakingAnswerAudioUrl = (
        (startingValues.speakingQuestion || [])[0] || {}
      ).recordedBlob;

      if (
        speakingAnswerAudioUrl &&
        (((values || {}).speakingQuestion || [])[0] || {}).audioAnswer !== false
      ) {
        initialUrls.push(urlKeyConverter(speakingAnswerAudioUrl));
      }
    }
    if (questionType === "fillInBlank") {
      const fillBlankQuestionBlanks =
        (startingValues.fillBlankQuestions || {}).answers || [];
      fillBlankQuestionBlanks.forEach((item, index) => {
        if (
          item.browserAudioFile &&
          (fillBlankQuestionBlanks[index] || {}).audio
        )
          initialUrls.push(urlKeyConverter(item.browserAudioFile));
      });
    }
    return initialUrls;
  }
  if (source === "lessonForm") {
    const initialUrls = [];
    //essay section urls
    const lessonImgStrings = ((values || {}).slides || [])
      .filter(item => !item.videoContent)
      .map(
        (item) => item.slideContent
      );
    lessonImgStrings.forEach((string) => {
      const urls = getUrlsFromString(string);
      urls.forEach((url) => {
        initialUrls.push(urlKeyConverter(url));
      });
    });

    const audioUrls = (values.slides || [])
      .filter((item) => {
        if (item.recordedBlob && !item.videoContent) return item;
      })
      .map((item) => item.recordedBlob);

    const videoUrls = (values.slides || [])
      .filter((item) => {
        if (item.loadedVideo && item.videoContent) return item;
      })
      .map((item) => item.loadedVideo);

    audioUrls.forEach((url) => initialUrls.push(urlKeyConverter(url)));

    videoUrls.forEach((url) => initialUrls.push(urlKeyConverter(url)));

    return initialUrls;
  }
  return getUrlsFromString(values);
};
