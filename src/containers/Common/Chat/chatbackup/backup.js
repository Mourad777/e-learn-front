import React from "react";
import { connect } from "react-redux";
import socketIOClient from "socket.io-client";
import * as actions from "../../../store/actions/index";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { Avatar } from "@material-ui/core";
import StyledBadge from "./StyledBadge";
import BottomBar from "./BottomBar";
import { uploadFile, getKey } from "../../../utility/uploadFile";
import "./Chat.css";
import { getFile } from "../../../utility/getFile";

class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chat: [],
      activeUsers: [],
      content: "",
      file: "",
    };
  }

  componentDidMount() {
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
      console.log('data: ',data)
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
      console.log("user changed");
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
    } else {
      console.log("user did not change");
    }
  }

  componentWillUnmount() {
    console.log("unmounting chat");
    this.socket.emit("leave", {
      recipient: this.props.selectedChatUser,
    });
    this.socket.off("activeUsers");
    this.socket.off("push");
  }

  // Save the message the user is typing in the input field.
  handleContent(event) {
    this.setState({
      content: event.target.value,
    });
  }
  // When the user is posting a new message.
  handleSubmit = (event) => {
    // Prevent the form to reload the current page.
    event.preventDefault();
    this.setState(async (state) => {
      const path = `users/${this.props.userId}/chat`;
      const key = getKey(state.file, path);
      let previewImageBlob = "";
      if (state.file) {
        const fileType = "chat";
        await uploadFile(state.file, key, this.props.token, fileType); //file type is meta data to auto delete after x days
        previewImageBlob = await getFile(key, "image/jpeg", this.token);
        console.log("previewImageBlob", previewImageBlob);
      }

      //check to see if file is image
      // Send the new message to the server.
      this.socket.emit("message", {
        content: state.content,
        recipient: this.props.selectedChatUser,
        course: this.props.course._id,
        userType: this.props.userType,
        file: state.file ? key : null,
      });

      // Update the chat with the user's message and remove the current message.
      return {
        chat: [
          ...state.chat,
          {
            sender: this.props.userId,
            content: state.content,
            file: previewImageBlob,
          },
        ],
        content: "",
        file: "",
      };
    }, this.scrollToBottom);
  };

  // Always make sure the window is scrolled down to the last message.
  scrollToBottom() {
    const chat = document.getElementById("chat");
    chat.scrollTop = chat.scrollHeight;
  }

  onHandleAttachedFile = (file) => {
    this.setState({ file });
  };

  render() {
    console.log("state in chat: ", this.state);
    const {
      selectedChatUser = {},
      course,
      students = [],
      isOfficeHour,
      instructorPanel,
      configuration,
    } = this.props;
    let chatAlwaysOpen = configuration.isChatAllowedOutsideOfficehours;
    if (!instructorPanel) {
      chatAlwaysOpen = (
        configuration.coursesIsChatAllowedOutsideOfficehours || []
      ).includes(course._id);
    }
    const instructor = course.courseInstructor;
    const isSelectedInstructor = selectedChatUser._id === instructor._id;
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
          <Typography style={{ padding: "10px" }} variant="h6" className="name">
            {`${(selectedChatUser || {}).firstName} ${
              (selectedChatUser || {}).lastName
            }`}
          </Typography>
        </div>
        <Paper
          style={{ maxHeight: "calc(93vh - 219px)" }}
          id="chat"
          elevation={3}
        >
          {this.state.chat.map((el, index) => {
            const senderStudent =
              (students || []).find((student) => student._id === el.sender) ||
              {};
            const senderInstructor = instructor._id === el.sender;
            return (
              <div key={index}>
                <Typography variant="caption" className="name">
                  {senderInstructor
                    ? `${instructor.firstName} ${instructor.lastName}`
                    : `${senderStudent.firstName} ${senderStudent.lastName}`}
                </Typography>
                {el.file && (
                  <div
                    style={{
                      backgroundImage: `url("${el.file}")`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      height: "200px",
                      borderRadius: "3px",
                      width: "100%",
                      margin: "auto",
                    }}
                  />
                )}
                <Typography variant="body1" className="content">
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
  };
};

const mapStateToProps = (state) => {
  return {
    students: state.common.students,
    userId: state.authentication.userId,
    course: state.common.selectedCourse,
    token: state.authentication.token,
    selectedChatUser: state.common.selectedChatUser,
    notifications: state.common.notifications,
    configuration: state.common.configuration,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
