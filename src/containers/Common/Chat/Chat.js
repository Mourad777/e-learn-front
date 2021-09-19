import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import socketIOClient from "socket.io-client";
import * as actions from "../../../store/actions/index";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { Avatar } from "@material-ui/core";
import StyledBadge from "./StyledBadge";
import BottomBar from "./BottomBar";
import { getKey } from "../../../utility/uploadFile";
import "./Chat.css";
import { getKeyFromAWSUrl } from "../../../utility/getKeyFromUrl";
import VideoPlayer from "../../../components/UI/VideoPlayer/VideoPlayer";
import AudioPlayerAdvanced from "../../../components/UI/AudioPlayer/AudioPlayerAdvanced"
import { getCourse } from "../../../utility/getCourse";
import { matchPath, Redirect } from "react-router-dom";
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { runChatTimeout } from "./util/chatTimout";
import {
  isOfficeHourCheck,
  getStartOrEndTime,
} from "../../../utility/officehour-check";

const token = localStorage.getItem('token');

const socket = socketIOClient(process.env.REACT_APP_SERVER_URL, {
  query: { token },
});

// Always make sure the window is scrolled down to the last message.
const scrollToBottom = () => {
  const chatContainer = document.getElementById("chat");
  if (chatContainer) {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
}

const handleWindowClose = (token, fileAWSKey, setFileAWSKey, setFile) => {
  const url = `${process.env.REACT_APP_SERVER_URL}delete-files`;
  const formData = new FormData();
  formData.append("url", fileAWSKey);
  formData.append("Authorization", "Bearer " + token);
  setFileAWSKey('');
  setFile('');
  fetch(url, {
    method: 'put',
    headers: new Headers({
      'Authorization': "Bearer " + token,
    }),
    body: formData,
    keepalive: true,
  });
};

const Chat = ({
  selectedCourse,
  fetchStudents,
  notifications,
  markAsSeen,
  fetchNotifications,
  course,
  students,
  instructorPanel,
  studentPanel,
  configuration,
  userId,
  width,
  uploading,
  deleteFile,
  uploadFile,
  isSmallDrawer,
  history,
}) => {

  const [chat, setChat] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [content, setContent] = useState("");
  const [file, setFile] = useState("");
  const [fileAWSKey, setFileAWSKey] = useState("");
  const [recorder, setRecorder] = useState(null);
  const [stream, setStream] = useState(null);
  const [audioRecorder, setAudioRecorder] = useState(null);
  const [audioTimeoutId, setAudioTimeoutId] = useState(null);
  const [selectedChatUser, setSelectedChatUser] = useState({});
  const [selectedChatUserId, setSelectedChatUserId] = useState(null);
  const [isOfficeHour, setIsOfficeHour] = useState(true);


  const currentFileAWSKey = useRef();
  currentFileAWSKey.current = fileAWSKey;

  useEffect(() => {
    const { isIrregOfficeHour, isRegOfficeHour } = isOfficeHourCheck(
      course,
      Date.now()
    );

    if (isIrregOfficeHour || isRegOfficeHour) {
      setIsOfficeHour(true);
    } else {
      setIsOfficeHour(false);
    }

    let timeoutId;
    const startEndTime = getStartOrEndTime(course, Date.now());
    runChatTimeout(startEndTime, timeoutId, course, setIsOfficeHour);
    return () => {
      clearTimeout(timeoutId)
    }
  }, [course])
  const mounted = useRef();
  useEffect(() => {
    if (!students && !mounted.current && selectedCourse) {
      fetchStudents(selectedCourse, localStorage.getItem('token'))
      mounted.current = true;
    }
  })

  useEffect(() => {
    window.addEventListener("beforeunload", () => handleWindowClose(token, currentFileAWSKey.current, setFileAWSKey, setFile));

    //get chat user
    const url = history.location.pathname;
    const match = matchPath(url, {
      path: "/instructor-panel/course/:courseId/chat/user/:userId",
      exact: true,
    }) || matchPath(url, {
      path: "/student-panel/course/:courseId/chat/user/:userId",
      exact: true,
    })
    let recipientId;
    if (match) {
      recipientId = match.params.userId;
      if (recipientId) {
        setSelectedChatUserId(recipientId)
      }
    }

    const notificationToMark = (notifications || []).find((n) => {
      if (
        (n.toSpecificUser === userId &&
          n.fromUser === recipientId) ||
        (n.toSpecificUser === recipientId &&
          n.fromUser === userId)
      ) {
        return n;
      }
    });
    if (notificationToMark) {
      markAsSeen(notificationToMark._id, token);
      fetchNotifications(token);
    }
    socket.emit("join", {

      recipient: recipientId,
      course: course._id,
    });

    // Load the last 10 messages in the window.
    socket.on("init", (data) => {
      const msg = data.messages;
      const activeUsers = data.activeUsers;
      setChat(chat => [...chat, ...msg].reverse());
      setActiveUsers(activeUsers);
      scrollToBottom();
    });

    socket.on("activeUsers", (activeUsers) => {
      setActiveUsers(activeUsers)
    });

    // Update the chat if a new message is broadcasted.
    socket.on("push", (msg) => {
      setChat(chat => [...chat, msg]);
      scrollToBottom();
    });
    return () => {
      handleWindowClose(token, currentFileAWSKey.current, setFileAWSKey, setFile)
      window.removeEventListener("beforeunload", handleWindowClose);
      if (currentFileAWSKey.current) {
      }
      socket.emit("leave", {
        recipient: recipientId,
      });
      socket.off("activeUsers");
      socket.off("push");
    }
  }, [])


  useEffect(() => {
    if (course.courseInstructor && students && selectedChatUserId) {
      let populatedRecipient;
      if (selectedChatUserId === (course.courseInstructor || {})._id) {
        populatedRecipient = (course.courseInstructor || {})
      } else {
        populatedRecipient = (students || []).find(st => st._id === selectedChatUserId)
      }
      setSelectedChatUser(populatedRecipient)
    }
  }, [course, students, selectedChatUserId])


  // Save the message the user is typing in the input field.
  const handleContent = (event) => {
    setContent(event.target.value)
  }

  const handleSetRecorder = ({ recorder, stream }) => {
    setRecorder(recorder);
    setStream(stream)
  }

  const handleSetAudioRecorder = ({ audioRecorder, audioTimeoutId }) => {
    setAudioRecorder(audioRecorder);
    setAudioTimeoutId(audioTimeoutId)
  }
  // When the user is posting a new message.
  const handleSubmit = (event) => {
    //checks if message is only white space, spaces, tabs, line breaks
    // if (content.replace(/\s/g, '').length > 0) {
    //   return
    // }
    // Prevent the form to reload the current page.
    // event.preventDefault();
    // if (file && content) {
    //   return;
    // }

    let userTypeRecipient;
    if (students.find(st => st._id === selectedChatUser._id)) {
      userTypeRecipient = 'student'
    }
    if (selectedChatUser._id === course.courseInstructor._id) {
      userTypeRecipient = 'instructor'
    }

    const userTypeSender = localStorage.getItem('userType');

    socket.emit("message", {
      content: content,
      recipient: selectedChatUser,
      course: course._id,
      userTypeRecipient: userTypeRecipient,
      userTypeSender: userTypeSender,
      file: fileAWSKey ? fileAWSKey : null,
    });

    setChat(chat => [...chat, {
      sender: userId,
      content: content,
      file: file,
    }]);
    setContent("");
    setFile("");
    setFileAWSKey("");
    setRecorder(null);
    setAudioRecorder(null);
    setAudioTimeoutId(null);
    scrollToBottom()
  };


  const onHandleAttachedFile = (file) => {
    if (!file) {
      setFile("");
      setFileAWSKey("");
      if (fileAWSKey) {
        deleteFile([fileAWSKey], token);
      }
      return;
    }
    const path = `users/${userId}/chat`;
    const key = getKey(file, path);
    const fileType = "chat";
    uploadFile(file, key, token, fileType); //file type is meta data to auto delete after x days
    setFile(file);
    setFileAWSKey(key);
    scrollToBottom();
  };


  let chatAlwaysOpen;
  if (configuration) {
    chatAlwaysOpen = configuration.isChatAllowedOutsideOfficehours;
  }
  if (studentPanel && configuration) {
    chatAlwaysOpen = (
      configuration.coursesIsChatAllowedOutsideOfficehours || []
    ).includes((course || {})._id);
  }
  const instructor = (course || {}).courseInstructor;
  const isSelectedInstructor = (selectedChatUser || {})._id === (instructor || {})._id;
  let pictureBoxHeight = 200;
  if (width < 460) pictureBoxHeight = 150;
  if (width < 360) pictureBoxHeight = 100;
  if (!selectedChatUser) return null
  // http://localhost:3000/student-panel/course/5f890b35b9ab74be4e6d1f50/chat/user/5f88df681dff8d19ee760200


  const { isIrregOfficeHour, isRegOfficeHour } = isOfficeHourCheck(
    course,
    Date.now()
  );
  return (
    <div className="Chat">
      {(
        (course || {}).regularOfficeHours &&
        (typeof configuration.isChatAllowedOutsideOfficehours === 'boolean' || typeof configuration.coursesIsChatAllowedOutsideOfficehours === 'boolean') &&
        !chatAlwaysOpen &&
        (!isIrregOfficeHour && !isRegOfficeHour) && selectedChatUserId &&
        ((studentPanel && (selectedChatUserId === (instructor || {})._id))
          || (instructorPanel))
      ) && (
          <Redirect to={`/${instructorPanel ? 'instructor' : 'student'}-panel/course/${selectedCourse}/chat/contacts`} />
        )}
      <IconButton onClick={() => {
        history.push(`/${instructorPanel ? 'instructor' : 'student'}-panel/course/${course._id}/chat/contacts`)
      }}>
        <ArrowBackIcon />
      </IconButton>
      <div style={{ display: "flex" }}>
        {activeUsers.includes(selectedChatUser._id) ? (
          <StyledBadge
            overlap="circle"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            variant="dot"
          >
            <Avatar src={selectedChatUser.profilePicture} />
          </StyledBadge>
        ) : (
          <Avatar src={selectedChatUser.profilePicture} />
        )}
        {(selectedChatUser || {}).firstName && (
          <Typography style={{ padding: "10px" }}>
            {`${(selectedChatUser || {}).firstName} ${(selectedChatUser || {}).lastName
              }`}
          </Typography>
        )}

      </div>
      <div id="chat-wrapper" style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        minHeight:500,
      }}>
        <div
          // style={{ maxHeight: "calc(93vh - 219px)" }}
          id="chat"
          // elevation={3}
          style={{



            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: -17, /* Increase/Decrease this value for cross-browser compatibility */
            overflowY: 'scroll',


            marginBottom:
              width < 500
                ? file
                  ? 150
                  : 120
                : file
                  ? 100
                  : 70,
          }}
        >
          <div id="chat-flex-wrapper" style={{
            display: "flex",
            flexDirection: "column",
          }}>
            {chat.map((el, index) => {
              let fileExtension;
              let url;
              if (el.file) {
                if (el.file instanceof File) {
                  url = URL.createObjectURL(el.file);
                  fileExtension = (el.file || {}).name
                    .toLowerCase()
                    .split(".")
                    .pop();

                } else {
                  url = el.file;
                  fileExtension = (getKeyFromAWSUrl(el.file) || "")
                    .toLowerCase()
                    .split(".")
                    .pop();

                }
              }
              const isImage =
                fileExtension === "jfif" ||
                fileExtension === "jpeg" ||
                fileExtension === "jpg" ||
                fileExtension === "png";
              const isVideo =
                fileExtension === "mp4" ||
                fileExtension === "avi" ||
                fileExtension === "mkv" ||
                fileExtension === "webm";
              const isAudio = fileExtension === "mp3";
              const isPDF = fileExtension === "pdf";
              const isDOCX = fileExtension === "docx" || fileExtension === "doc";
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: el.sender === userId ? "flex-end" : "flex-start",
                    alignSelf: el.sender === userId ? "flex-end" : "flex-start",
                    maxWidth: "80%",
                    minWidth: el.file ? isAudio ? "20%" : '50%' : "10%",
                    borderRadius: 5,
                    padding: 5,
                    marginBottom: 5,
                    backgroundColor: el.sender === userId ? "#0288d1" : "#455a64",
                  }}
                  key={index}
                >
                  {/* <Typography variant="caption" className="name">
                  {senderInstructor
                    ? `${instructor.firstName} ${instructor.lastName}`
                    : `${senderStudent.firstName} ${senderStudent.lastName}`}
                </Typography> */}
                  {el.file && isImage && (
                    <div
                      style={{
                        backgroundImage: `url("${url}")`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        height: pictureBoxHeight,
                        borderRadius: "3px",
                        width: "100%",
                        // margin: "auto",
                      }}
                    />
                  )}
                  {el.file && (isPDF || isDOCX) && (
                    <a href={url}>
                      <div
                        style={{
                          borderRadius: "3px",
                          width: "50%",
                          // margin: "auto",
                        }}
                      >
                        {isDOCX && (
                          <i
                            style={{ color: "white" }}
                            className="fas fa-file-word fa-2x"
                          ></i>
                        )}
                        {isPDF && (
                          <i
                            style={{ color: "white" }}
                            className="far fa-file-pdf fa-2x"
                          ></i>
                        )}
                      </div>
                    </a>
                  )}
                  {el.file && isAudio && <div className={`chatAudio[${index}]`}><AudioPlayerAdvanced noSeek audioSource={url} /></div>}
                  {el.file && isVideo && <VideoPlayer url={url} />}
                  {el.file && (isVideo || isImage || isAudio) && (
                    <a href={url}>
                      <i
                        style={{ color: "white", padding: "5px 0" }}
                        className="fas fa-file-download fa-2x"
                      ></i>
                    </a>
                  )}
                  <Typography
                    style={{ fontSize: "0.8em", color: "white" }}
                    variant="body1"
                    className="content"
                  >
                    {el.content}
                  </Typography>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <BottomBar
        isSmallDrawer={isSmallDrawer}
        isOfficeHour={isOfficeHour}
        isSelectedInstructor={isSelectedInstructor}
        content={content}
        handleContent={handleContent}
        handleSubmit={handleSubmit}
        isInstructorPanel={instructorPanel}
        chatAlwaysOpen={chatAlwaysOpen}
        handleAttachedFile={onHandleAttachedFile}
        loadedFile={file}
        isUploading={uploading}
        onSetRecorder={handleSetRecorder}
        onSetAudioRecorder={handleSetAudioRecorder}
        recorder={recorder}
        stream={stream}
        audioRecorder={audioRecorder}
        audioTimeoutId={audioTimeoutId}
        isFile={!!file}
      />
    </div>
  );

}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchNotifications: (token) => {
      dispatch(actions.fetchNotificationsStart(token));
    },
    markAsSeen: (notificationId, token) => {
      dispatch(actions.markAsSeenStart(notificationId, token));
    },
    uploadFile: (file, key, type, token) => {
      dispatch(actions.uploadFileStart(file, key, type, token));
    },
    deleteFile: (file, token) => {
      dispatch(actions.deleteFilesStart(file), token);
    },
    fetchStudents: (courseId, token) =>
      dispatch(actions.fetchStudentsStart(courseId, token)),
    setChatUser: (user) => {
      dispatch(actions.setChatUser(user));
    },
  };
};

const mapStateToProps = (state) => {
  const populatedCourse = getCourse(state.common.courses, state.common.selectedCourse) || {};
  const students = state.common.students;
  return {
    students,
    userId: state.authentication.userId,
    course: populatedCourse,
    selectedCourse: state.common.selectedCourse,
    token: state.authentication.token,
    instructorPanel: state.authentication.instructorLoggedIn,
    studentPanel: state.authentication.studentLoggedIn,
    // selectedChatUser: chatUser || {},
    notifications: state.common.notifications,
    configuration: state.common.configuration,
    uploading: state.common.uploading,
    width: state.common.width,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
