import CustomError from "../utils/error/customError.js";
import { handleError } from "../utils/error/errorHandler.js";
import { removeUser } from "../session/user.session.js";
import { getGameSession } from "../session/game.session.js";

const gameId = 1000000;

export const onError = (socket) => async(err) => {
  console.error("소켓 오류:", err);
  handleError(socket, new CustomError(500, `소켓 오류: ${err.message}`));

  const user = getUserBySocket(socket);
    const userUuid = (await findUserByDeviceID(user.id)).id
    console.log("저장된 좌표 하지만", userUuid,user.x, user.y)
    await updateUserLastposition(userUuid, user.x, user.y);

  // 세션에서 유저 삭제
  removeUser(socket);

  const gameSession = getGameSession(gameId);
  gameSession.removeUser(socket);
};
