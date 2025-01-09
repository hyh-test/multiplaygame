import Game from '../classes/models/game.class.js';
import { gameSessions } from './sessions.js';

// uuid를 매개변수로 받아 게임 세션을 하나 생성한다.
// 서버가 열렸을 때만 실행한다.
export const addGameSession = (id) => {
  const session = new Game(id);
  gameSessions.push(session);
  return session;
};

// 게임 세션을 제거한다.(1개 밖에 없으므로 index는 항상 0이다.)
export const removeGameSession = () => {
  return gameSessions.splice(0, 1)[0];
};

// 게임 세션을 조회한다. 
export const getGameSession = () => {
  return gameSessions[0];
};