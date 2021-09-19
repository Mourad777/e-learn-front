import React from "react";
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

class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chat: [],
      activeUsers: [],
      content: "",
      file: "",
      fileAWSKey: "",
      recorder: null,
      stream: null,
      audioRecorder: null,
      audioTimeoutId: null,
    };
  }

  componentDidMount() {
    this.props.fetchStudents(this.props.selectedCourse, this.props.token)
    window.addEventListener("visibilitychange", this.handleWindowClose);
    this.socket = socketIOClient(process.env.REACT_APP_SERVER_URL, {
      query: { token: this.props.token },
    });
    const notificationToMark = (this.props.notifications || []).find((n) => {
      if (
        (n.toSpecificUser === this.props.userId &&
          n.fromUser === this.props.selectedChatUser._id) ||
        (n.toSpecificUser === this.props.selectedChatUser._id &&
          n.fromUser === this.props.userId)
      ) {
        return n;
      }
    });
    if (notificationToMark) {
      this.props.markAsSeen(notificationToMark._id, this.props.token);
      this.props.fetchNotifications(this.props.token);
    }

    // this.socket.open()
    this.socket.emit("join", {
      recipient: this.props.selectedChatUser,
      course: this.props.course._id,
    });

    // Load the last 10 messages in the window.
    this.socket.on("init", (data) => {
      const msg = data.messages;
      const activeUsers = data.activeUsers;
      this.setState(
        (state) => ({
          chat: [...state.chat, ...msg.reverse()],
          activeUsers,
        }),
        this.scrollToBottom
      );
    });

    this.socket.on("activeUsers", (activeUsers) => {
      this.setState({
        activeUsers,
      });
    });

    // Update the chat if a new message is broadcasted.
    this.socket.on("push", (msg) => {
      this.setState(
        (state) => ({
          chat: [...state.chat, msg],
        }),
        this.scrollToBottom
      );
    });
  }
  
  componentDidUpdate(prevProps) {

    if (this.props.selectedChatUser._id !== prevProps.selectedChatUser._id) {
      const notificationToMark = (this.props.notifications || []).find((n) => {
        if (
          (n.toSpecificUser === this.props.userId &&
            n.fromUser === this.props.selectedChatUser._id) ||
          (n.toSpecificUser === this.props.selectedChatUser._id &&
            n.fromUser === this.props.userId)
        ) {
          return n;
        }
      });
      if (notificationToMark) {
        this.props.markAsSeen(notificationToMark._id, this.props.token);
        this.props.fetchNotifications(this.props.token);
      }

      // this.socket.open()
      this.socket.emit("join", {
        recipient: this.props.selectedChatUser,
        course: this.props.course._id,
      });

      // Load the last 10 messages in the window.
      this.socket.on("init", (data) => {
        const msg = data.messages;
        const activeUsers = data.activeUsers;
        this.setState(
          (state) => ({
            chat: [...state.chat, ...msg.reverse()],
            activeUsers,
          }),
          this.scrollToBottom
        );
      });
    } 
  }

  componentWillUnmount() {
    window.removeEventListener("visibilitychange", this.handleWindowClose);
    if (this.state.fileAWSKey) {
      // this.props.deleteFile([this.state.fileAWSKey]);
    }
    this.socket.emit("leave", {
      recipient: this.props.selectedChatUser,
    });
    this.socket.off("activeUsers");
    this.socket.off("push");
  }

  handleWindowClose = (ev) => {
    ev.preventDefault();
    ev.returnValue = '';

    const url = `${process.env.REACT_APP_SERVER_URL}delete-files`;
    const formData = new FormData();
    formData.append("url", this.state.fileAWSKey);
    formData.append("Authorization", "Bearer " + this.props.token);

    this.setState({ fileAWSKey: '', file: '' })
    fetch(url, {
      method: 'put',
      headers: new Headers({
        'Authorization': "Bearer " + this.props.token,
        // 'Content-Type': 'application/x-www-form-urlencoded'
      }),
      body: formData,
      keepalive: true,
    });

  };

  // Save the message the user is typing in the input field.
  handleContent(event) {
    this.setState({
      content: event.target.value,
    });
  }

  handleSetRecorder = ({ recorder, stream }) => {
    this.setState({
      recorder,
      stream,
    });
  }

  handleSetAudioRecorder = ({ audioRecorder, audioTimeoutId }) => {
    this.setState({
      audioRecorder,
      audioTimeoutId,
    });
  }
  // When the user is posting a new message.
  handleSubmit = (event) => {
    //checks if message is only white space, spaces, tabs, line breaks
    if (!this.state.content.replace(/\s/g, '').length) {
      return
    }
    // Prevent the form to reload the current page.
    event.preventDefault();
    if (!this.state.file && !this.state.content) {
      return;
    }
    this.setState((state) => {

      this.socket.emit("message", {
        content: state.content,
        recipient: this.props.selectedChatUser,
        course: this.props.course._id,
        userType: this.props.userType,
        file: state.fileAWSKey ? state.fileAWSKey : null,
      });

      // Update the chat with the user's message and remove the current message.
      return {
        chat: [
          ...state.chat,
          {
            sender: this.props.userId,
            content: state.content,
            file: state.file,
          },
        ],
        content: "",
        file: "",
        fileAWSKey: "",
        recorder: null,
        audioRecorder: null,
        audioTimeoutId: null,
      };
    }, this.scrollToBottom);
  };

  // Always make sure the window is scrolled down to the last message.
  scrollToBottom() {
    const chat = document.getElementById("chat");
    chat.scrollTop = chat.scrollHeight;
  }

  onHandleAttachedFile = (file) => {
    if (!file) {
      this.setState({ file: "", fileAWSKey: "" });
      if (this.state.fileAWSKey) {
        this.props.deleteFile([this.state.fileAWSKey], this.props.token);
      }
      return;
    }
    const path = `users/${this.props.userId}/chat`;
    const key = getKey(file, path);
    const fileType = "chat";
    this.props.uploadFile(file, key, this.props.token, fileType); //file type is meta data to auto delete after x days
    this.setState({ file, fileAWSKey: key });
  };

  render() {
    const {
      selectedChatUser = {},
      course,
      students = [],
      isOfficeHour,
      instructorPanel,
      configuration,
      userId,
      width,
      uploading,
    } = this.props;
    let chatAlwaysOpen = configuration.isChatAllowedOutsideOfficehours;
    if (!instructorPanel) {
      chatAlwaysOpen = (
        configuration.coursesIsChatAllowedOutsideOfficehours || []
      ).includes((course || {})._id);
    }
    const instructor = (course || {}).courseInstructor;
    const isSelectedInstructor = (selectedChatUser || {})._id === (instructor || {})._id;
    let pictureBoxHeight = 200;
    if (width < 460) pictureBoxHeight = 150;
    if (width < 360) pictureBoxHeight = 100;
    return (
      <div className="Chat">
        <div style={{ display: "flex" }}>
          {this.state.activeUsers.includes(selectedChatUser._id) ? (
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
          <Typography style={{ padding: "10px" }}>
            {`${(selectedChatUser || {}).firstName} ${(selectedChatUser || {}).lastName
              }`}
          </Typography>
        </div>
        <Paper
          style={{ maxHeight: "calc(93vh - 219px)" }}
          id="chat"
          elevation={3}
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom:
              width < 500
                ? this.state.file
                  ? 150
                  : 120
                : this.state.file
                  ? 100
                  : 70,
          }}
        >
          {this.state.chat.map((el, index) => {
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
            const senderStudent =
              (students || []).find((student) => student._id === el.sender) ||
              {};
            const senderInstructor = instructor._id === el.sender;
            // await getFile(key, "image/jpeg", this.token)
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
        </Paper>
        <BottomBar
          isOfficeHour={isOfficeHour}
          isSelectedInstructor={isSelectedInstructor}
          content={this.state.content}
          handleContent={this.handleContent.bind(this)}
          handleSubmit={this.handleSubmit.bind(this)}
          isInstructorPanel={instructorPanel}
          chatAlwaysOpen={chatAlwaysOpen}
          handleAttachedFile={this.onHandleAttachedFile}
          loadedFile={this.state.file}
          isUploading={uploading}
          onSetRecorder={this.handleSetRecorder}
          onSetAudioRecorder={this.handleSetAudioRecorder}
          recorder={this.state.recorder}
          stream={this.state.stream}
          audioRecorder={this.state.audioRecorder}
          audioTimeoutId={this.state.audioTimeoutId}
          isFile={!!this.state.file}
        />
      </div>
    );
  }
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
  };
};

const mapStateToProps = (state) => {
  const populatedCourse = getCourse(state.common.courses, state.common.selectedCourse);
  return {
    students: state.common.students,
    userId: state.authentication.userId,
    course: populatedCourse,
    selectedCourse:state.common.selectedCourse,
    token: state.authentication.token,
    selectedChatUser: state.common.selectedChatUser,
    notifications: state.common.notifications,
    configuration: state.common.configuration,
    uploading: state.common.uploading,
    width: state.common.width,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
