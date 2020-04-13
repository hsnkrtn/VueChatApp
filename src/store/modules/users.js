import {
  app,
  storage,
  db,
  usersRef,
  typingNow,
  getMessages,
  onlineUsers,
} from "../../base";
import newFriendShipRequest from "../../constants/newFriendShipRequest";
import Message from "../../constants/Message";

import Vue from "vue";
import { pathOr } from "../../../node_modules/ramda";
const state = {
  users: [],
  onlineUsers: [],
  user: {},
  currentConversationWith: {},
};

const mutations = {
  ADD_USER(state, user) {
    state.users.push(user);
  },
  GET_ONLINE_USERS(state) {
    Vue.http.get("onlineUsers.json").then(({ data }) => {
      state.onlineUsers = Object.values(data);
    });
  },
  SET_USERS(state, users) {
    state.users = users;
  },
  UPDATE_MEMBER(state, user) {
    state.users.find((cUser, index) => {
      if (cUser.key === user.key) {
        state.users[index] = cUser;
      }
    });
  },
  SET_USER(state, user) {
    state.user = { ...user, messages: Object.values(user.messages) };
  },
  SET_CURRENT_CONVERSATION_WITH(state, currentConversationWith) {
    state.currentConversationWith = currentConversationWith;
  },
  SET_MY_MESSAGES(state, messages) {
    state.user.messages = messages;
  },
  SET_MY_FRIENDSHIP_REQUESTS(state, friendshipRequests) {
    state.user.friendshipRequests = friendshipRequests;
  },
};
const actions = {
  addUser: ({ commit }, user) => {
    commit("ADD_USER", getSingleUserData(user));
  },
  getOnlineUsers: ({ commit }) => {
    commit("GET_ONLINE_USERS");
  },
  setUsers: ({ commit }) => {
    usersRef.on("value", (snap) => {
      const filteredUsers = Object.entries(snap.val()).map((entry) =>
        getSingleUserData({ ...entry[1], key: entry[0] })
      );
      commit("SET_USERS", filteredUsers);
    });
  },
  updateMember: ({ commit }, userKey) => {
    usersRef.child(userKey).on("value", (snap) => {
      const user = getSingleUserData(snap.val());
      commit("UPDATE_MEMBER", user);
    });
  },
  initUser: ({ commit }, user) => {
    commit("SET_USER", user);
  },
  setCurrentConversationWith: ({ commit }, currentConversationWith) => {
    commit("SET_CURRENT_CONVERSATION_WITH", currentConversationWith);
  },
  setMyMessages: ({ commit }) => {
    usersRef.child(`${state.user.key}/messages`).on("value", (snap) => {
      commit("SET_MY_MESSAGES", Object.values(snap.val()));
    });
  },
  sendAFriendshipRequest({ commit }) {
    sendAFriendshipRequestFunc();
  },
  acceptFriendshipRequest({ commit }) {
    const requestId = state.user.friendshipRequests.filter(
      (req) =>
        req.from === state.currentConversationWith.userName ||
        req.to === state.currentConversationWith.userName
    )[0].id;
    acceptRequest(state.user.key, requestId);
    acceptRequest(state.currentConversationWith.key, requestId);
  },
  setMyFriendshipRequests({ commit }) {
    usersRef
      .child(`${state.user.key}/friendshipRequests`)
      .on("value", (snap) => {
        commit("SET_MY_FRIENDSHIP_REQUESTS", snap.val());
      });
  },
  sendMessage({commit},messageText) {
    console.log('text from store',messageText)

    let myNewMessage = new Message();
    myNewMessage.from = state.user.userName;
    myNewMessage.to = state.currentConversationWith.userName;
    myNewMessage.text = messageText;
    myNewMessage.sendingTime = getSendingTime();
    myNewMessage.avatarUrl = null;
    sendMessageToUser({ ...myNewMessage, gelesen: true }, state.user.key);
    sendMessageToUser({...myNewMessage}, state.currentConversationWith.key);
  },
};
const getters = {
  users: (state) => state.users,
  onlineUsers: (state) => state.onlineUsers,
  publicUser: (state) => state.users.find((user) => user.userName === "public"),
  user: (state) => state.user,
  messagesBetweenCurrentUserData: (state) =>
    state.user.messages.filter((mes) =>
      isMessageBetweenUserAndCurrentUser(mes, state.currentConversationWith)
    ),
  currentConversationWith: (state) => state.currentConversationWith,
  hasfriendShipRequest: (state) =>
    state.user.friendshipRequests.some(
      (req) =>
        req.from === state.currentConversationWith.userName ||
        req.to === state.currentConversationWith.userName
    ),
    friendshipRequest: (state) =>{
      const hasRequest= state.user.friendshipRequests.some(
         (req) =>
           req.from === state.currentConversationWith.userName ||
           req.to === state.currentConversationWith.userName
       )
       if(hasRequest){
         return state.user.friendshipRequests.filter(
          (req) =>
            req.from === state.currentConversationWith.userName ||
            req.to === state.currentConversationWith.userName
        )[0]
       }
       return undefined
    }
};
function getSingleUserData(person) {
  const userName = pathOr(null, ["userName"], person);
  const gender = pathOr(null, ["gender"], person);
  const avatarUrl = pathOr(null, ["avatarUrl"], person);
  const dateOfBirth = pathOr(null, ["dateOfBirth"], person);
  const id = pathOr(null, ["id"], person);
  const key = pathOr(null, ["key"], person);
  return {
    userName,
    gender,
    avatarUrl,
    dateOfBirth,
    id,
    key,
  };
}
function isMessageBetweenUserAndCurrentUser(message) {
  return (
    (message.to === state.user.userName &&
      message.from === state.currentConversationWith.userName) ||
    (message.to === state.currentConversationWith.userName &&
      message.from === state.user.userName)
  );
}
function sendAFriendshipRequestFunc() {
  let myNewFriendShipRequest = new newFriendShipRequest();
  myNewFriendShipRequest.from = state.user.userName;
  myNewFriendShipRequest.to = state.currentConversationWith.userName;
  myNewFriendShipRequest.avatarUrl = state.user.avatarUrl;
  myNewFriendShipRequest.approved = false;
  myNewFriendShipRequest.sendingTime = getSendingTime();
  const myKey = state.user.key;
  const currentUserKey = state.currentConversationWith.key;
  setRequest(myKey, myNewFriendShipRequest);
  setRequest(currentUserKey, myNewFriendShipRequest);
}
function setRequest(key, request) {
  usersRef.child(`${key}/friendshipRequests`).once("value", (snap) => {
    const requests = snap.val();
    requests.push(request);
    usersRef.child(`${key}/friendshipRequests`).set(requests);
  });
}
function acceptRequest(userKey, requestId) {
  usersRef.child(`${userKey}/friendshipRequests`).on("value", (snap) => {
    let requests = snap.val();
    requests.find((req) => req.id === requestId).approved = true;
    usersRef.child(`${userKey}/friendshipRequests`).set(requests);
  });
}
function getSendingTime() {
  const date = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `${hour}:${minute < 10 ? "0" + minute : minute}`;
}
function sendMessageToUser(message, key){
  usersRef.child(`${key}/messages`).once("value", (snap) => {
    let messages = snap.val();
    messages.push(message)
    usersRef.child(`${key}/messages`).set(messages);
  });
}
export default {
  state,
  mutations,
  actions,
  getters,
};
