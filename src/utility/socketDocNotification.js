import socketIOClient from "socket.io-client";

export const docSocketNotification = (ioNotification,token) => {
  const socket = socketIOClient(process.env.REACT_APP_SERVER_URL, {
    query: { token: token },
  });
    socket.emit("notifyOfDocUpdate", {
      notificationType: ioNotification.notification,
      userType: ioNotification.userType,
      userId: ioNotification.userId,
      testId: ioNotification.testId,
      courseId: ioNotification.course,
      action: ioNotification.action,
      message: ioNotification.message,
    });
};
