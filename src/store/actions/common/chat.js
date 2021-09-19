import * as actionTypes from "../actionTypes";

export const setChatUser = (userId) => {
  return {
    type: actionTypes.SET_CHAT_USER,
    user: userId,
  };
};
