import { removeUser } from "../session/user.session.js";
import { getGameSession } from "../session/game.session.js";
import { getUserBySocket } from "../session/user.session.js";
import { findUserByDeviceID, updateUserLastposition } from "../db/user/user.db.js";

const gameId = 1000000;

export const onEnd = (socket) => async () => {
  console.log("클라이언트 연결이 종료되었습니다.");

  const user = getUserBySocket(socket);
  const userUuid = (await findUserByDeviceID(user.id)).id
  console.log("저장된 좌표 ", userUuid,user.x, user.y)
  await updateUserLastposition(userUuid, user.x, user.y);


  // 세션에서 유저 삭제
  removeUser(socket);
  const gameSession = getGameSession(gameId)
  gameSession.removeUser(socket);
};
