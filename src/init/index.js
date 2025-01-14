import { loadProtos } from "./loadProtos.js";
import { testAllConnections } from "../utils/db/testConnection.js";
import pools from "../db/database.js";
import { loadGameAssets } from "./assets.js";

// 서버 시작 함수. 시작 시 게임 세션도 같이 만든다.
const initServer = async () => {
  try {
    await loadGameAssets();
    await loadProtos();
    await testAllConnections(pools);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

export default initServer;
