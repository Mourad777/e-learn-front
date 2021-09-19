//This function is for the fill in the blanks section of a test or question form
//it serves to detect where to insert/remove a blank relative to other blanks
//for example in front, at the end, in between blank x and y ect..

const syncInput = (
  previousCorrectAnswers = [],
  currentCorrectAnswers = [],
  answers = [],
  errors
) => {
  const numberOfBlanksToInsert =
    currentCorrectAnswers.length - previousCorrectAnswers.length;

  if (currentCorrectAnswers.length === previousCorrectAnswers.length) return;
  const defaultValues = {
    marks: 1,
    incorrectAnswerOptions: {
      incorrectAnswerOne: "",
      incorrectAnswerTwo: "",
      incorrectAnswerThree: "",
    },
    selectableAnswer: false,
    audio: false,
    browserAudioFile: null,
    audioFile: null,
  };
  const defaultError = {
    marks: null,
    answerOptions: {
      incorrectAnswerThree: null,
    },
    browserAudioFile: null,
  };
  if (previousCorrectAnswers.length < currentCorrectAnswers.length) {
    const indexToInsert = currentCorrectAnswers.findIndex((item, index) => {
      return !previousCorrectAnswers.includes(item);
    });
    if (currentCorrectAnswers.length > 0) {
      if (indexToInsert === 0) {
        //insertAtBeginning
        answers.unshift({ ...defaultValues, answer: currentCorrectAnswers[0] });
        errors.unshift(defaultError);
      } else {
        //insert at position
        const insert = (arr, index, newItem) => [
          ...arr.slice(0, index),
          newItem,
          ...arr.slice(index),
        ];

        const position = previousCorrectAnswers.length - 1
        currentCorrectAnswers.splice.apply(previousCorrectAnswers, [position, 0].concat(previousCorrectAnswers));
        const emptyArray = new Array(numberOfBlanksToInsert);

        const answersToUpdate = insert(answers, indexToInsert, {
          ...defaultValues,
          answer: currentCorrectAnswers[indexToInsert],
        });

        const errorsToUpdate = insert(errors, indexToInsert, defaultError);

        return {
          answersToUpdate: answersToUpdate.map((answer, index) => {
            return {
              ...answer,
              answer: currentCorrectAnswers[index],
            };
          }),
          errorsToUpdate: errorsToUpdate,
        };
      }
    }
  }
  if (previousCorrectAnswers.length > currentCorrectAnswers.length) {
    //removeAtPosition
    const findIndices = (arr, currentAnswersList) => {
      let indices = [];
      arr.forEach((item, index) => {
        if (!currentAnswersList.includes(arr[index])) {
          indices.push(index);
        }
      });
      return indices;
    };
    const indicesToSplice = findIndices(
      previousCorrectAnswers,
      currentCorrectAnswers
    );
    if (indicesToSplice.length === 1) {
      answers.splice(indicesToSplice[0], 1);
      errors.splice(indicesToSplice[0], 1);
    } else {
      const startIndex = indicesToSplice[0];
      const numberOfElementsToRemove = indicesToSplice.length;
      answers.splice(startIndex, numberOfElementsToRemove);
      errors.splice(startIndex, numberOfElementsToRemove);
    }
  }

  //////////////////////
  /////////////////////
  //is this condition ever used???
  if (
    previousCorrectAnswers.length < currentCorrectAnswers.length &&
    !answers
  ) {
    //addAtEnd
    const position = previousCorrectAnswers.length - 1
    currentCorrectAnswers.splice.apply(previousCorrectAnswers, [position, 0].concat(previousCorrectAnswers));
    const emptyArray = new Array(numberOfBlanksToInsert);

    answers = emptyArray.map(ans=>{
      return defaultValues;
    });
    errors= emptyArray.map(e=>defaultError);
  }

  return {
    answersToUpdate: answers.map((answer, index) => {
      return {
        ...answer,
        answer: currentCorrectAnswers[index],
      };
    }),
    errorsToUpdate: errors,
  };
};
export default syncInput;
