import { userSessions } from "./sessions.js";
import User from "../classes/models/user.class.js";

export const addUser = (id, socket, playerId, latency) => {
  const user = new User(id, socket, playerId, latency);
  userSessions.push(user);
  return user;
};

export const removeUser = (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);
  if (index !== -1) {
    return userSessions.splice(index, 1)[0];
  }
};

export const getUserById = (id) => {
  return userSessions.find((user) => user.id === id);
};

export const getUserBySocket = (socket) => {
  return userSessions.find((user) => user.socket === socket);
};

export const getUser = () => {
  return userSessions
};