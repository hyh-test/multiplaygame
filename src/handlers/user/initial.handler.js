import { addUser } from "../../session/user.session.js";
import {
  HANDLER_IDS,
  RESPONSE_SUCCESS_CODE,
} from "../../constants/handlerIds.js";
import { createResponse } from "../../utils/response/createResponse.js";
import { handleError } from "../../utils/error/errorHandler.js";
import {
  createUser,
  findUserByDeviceID,
  updateUserLogin,
} from "../../db/user/user.db.js";
import { getGameSession, addGameSession } from "../../session/game.session.js";

const gameId = 1000000;

const initialHandler = async ({ socket, userId, payload }) => {
  try {
    const { deviceId, playerId, latency } = payload;

    console.log("playerId, latency,", playerId, latency);
    console.log("Received latency:", latency);

    let userData = await findUserByDeviceID(deviceId);

    if (!userData) {
      userData = await createUser(deviceId);
    } else {
      await updateUserLogin(userData.id);
    }

    const user = addUser(socket, deviceId, playerId, latency);

    let gameSession = getGameSession(gameId);
    if (!gameSession) {
      gameSession = addGameSession(gameId);
    }

    if (gameSession.getUser(userData.deviceId)) {
      throw new CustomError(
        ErrorCodes.USER_ALREADY_EXIST,
        "해당 유저가 이미 존재합니다."
      );
    }

    gameSession.addUser(user);

    // 유저 정보 응답 생성
    const initialResponse = createResponse(
      HANDLER_IDS.INITIAL,
      RESPONSE_SUCCESS_CODE,
      { userId: user.id },
      deviceId
    );

    // 소켓을 통해 클라이언트에게 응답 메시지 전송
    socket.write(initialResponse);
  } catch (error) {
    handleError(socket, error);
  }
};

export default initialHandler;
