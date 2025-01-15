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
  findUserLastpositionByID
} from "../../db/user/user.db.js";
import { getGameSession, addGameSession } from "../../session/game.session.js";

const gameId = 1000000;

const initialHandler = async ({ socket, userId, payload }) => {
  try {
    const { deviceId, playerId, latency } = payload;

    let userData = await findUserByDeviceID(deviceId);

    if (!userData) {
      userData = await createUser(deviceId);
    } else {
      await updateUserLogin(userData.id);
    }
    
    console.log(userData.id)
    // 해당 유저의 마지막 위치를 가져온다.
    const lastpositon = await findUserLastpositionByID(userData.id);
    console.log(lastpositon)

    const user = addUser(socket, deviceId, playerId, latency);

    user.x = lastpositon.x;
    user.y = lastpositon.y;

    console.log("불러온", user.x,user.y)

    //찾아서 없으면 만들고 있으면 그냥 가져오기.
    let gameSession = getGameSession(gameId);
    if (!gameSession) {
      gameSession = addGameSession(gameId);
    }

    //만약 게임세션에 이미 이 유저가 존재할떄 
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
      {
        userId: user.id,
        x: user.x,
        y: user.y, 
        message: "게임참가완료"
      },
      deviceId
    );

    // 소켓을 통해 클라이언트에게 응답 메시지 전송
    socket.write(initialResponse);
  } catch (error) {
    handleError(socket, error);
  }
};

export default initialHandler;
