import { loadProtos } from './loadProtos.js';
import { v4 as uuidv4 } from 'uuid';
import { addGameSession } from '../session/game.session.js';
import { testAllConnections } from '../utils/db/testConnection.js';
import pools from '../db/database.js';

// 서버 시작 함수. 시작 시 게임 세션도 같이 만든다.
const initServer = async () => {
  try {
    await loadProtos();
    await testAllConnections(pools);

    const gameId = uuidv4();
    const gameSession = addGameSession(gameId);
    
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

export default initServer;