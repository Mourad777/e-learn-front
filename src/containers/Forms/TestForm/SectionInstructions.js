import React from "react";
import Typography from "@material-ui/core/Typography";
import Aux from "../../../hoc/Auxiliary/Auxiliary";

export const multipleChoiceInstructions = (
  <Aux>
    <Typography variant="h6" gutterBottom paragraph>
      Instructions
    </Typography>
    <Typography variant="body1" gutterBottom paragraph>
      1 Write a question in the text editor or/and include an image
    </Typography>
    <Typography variant="body1" gutterBottom paragraph>
      2 Add atleast 2 options as answers
    </Typography>
    <Typography variant="body1" gutterBottom paragraph>
      Select 1 or more answers that are correct
    </Typography>
    <Typography variant="body1" gutterBottom paragraph>
      3 Include an answer explanation that the student can see once the test has
      been graded (optional)
    </Typography>
  </Aux>
);

export const essayInstructions = (
  <Aux>
    <Typography variant="h6" gutterBottom paragraph>
      Instructions
    </Typography>
    <Typography variant="body1" gutterBottom paragraph>
      1 Write a question in the text editor or/and include an image
    </Typography>
    <Typography variant="body1" gutterBottom paragraph>
      2 Include an answer explanation that the student can see once the test has
      been graded (optional)
    </Typography>
  </Aux>
);

export const speakingInstructions = (
  <Aux>
    <Typography variant="h6" gutterBottom paragraph>
      Instructions
    </Typography>
    <Typography variant="body1" gutterBottom paragraph>
      1 Write out some text that needs to be spoken by the student
    </Typography>
    <Typography variant="body1" gutterBottom paragraph>
      2 You can also include an image in the text field to have the student say
      something about the image (optional)
    </Typography>
    <Typography variant="body1" gutterBottom paragraph>
      3 Include an audio file that plays the correct answer by recording the
      answer yourself or uploading an mp3/wav file from your computer (optional)
    </Typography>
  </Aux>
);

export const fillInBlanksInstructions = (
  <Aux>
    <Typography variant="h6" gutterBottom paragraph>
      Instructions
    </Typography>
    <Typography variant="body1" gutterBottom paragraph>
      1 Write some text in the text editor
    </Typography>
    <Typography variant="body1" gutterBottom paragraph>
      2 Highlight a piece of text with a yellow marker that the student will
      need to fill in
    </Typography>
    <Typography variant="body1" gutterBottom paragraph>
      3 Choose whether the answer should be typed out or selected from a
      dropdown list
    </Typography>
    <Typography variant="body1" gutterBottom paragraph>
      4 If the answer should be selected from a dropdown list you must create
      aleast 1 incorrect answer
    </Typography>
    <Typography variant="body1" gutterBottom paragraph>
      5 Include audio if you want the student to listen to a hint or nessary
      information to fill in the blank (optional)
    </Typography>
    <Typography variant="body1" gutterBottom paragraph>
      6 The audio can be uploaded or recorded from your mic
    </Typography>
  </Aux>
);