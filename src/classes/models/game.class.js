import {
  createLocationPacket,
  gameStartNotification,
} from "../../utils/notification/game.notification.js";

const MAX_PLAYERS = 10;

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
  }

  addUser(user) {
    if (this.users.length >= MAX_PLAYERS) {
      throw new Error("Game session is full");
    }
    this.users.push(user);
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  removeUser(socket) {
    const index = this.users.findIndex((user) => user.socket === socket);
    if (index !== -1) {
      return this.users.splice(index, 1)[0];
    }
    aa;
  }

  getMaxLatency() {
    let maxLatency = 0;
    this.users.forEach((user) => {
      maxLatency = Math.max(maxLatency, user.latency);
    });

    return maxLatency;
  }

  startGame() {
    this.state = "inProgress";
    const startPacket = gameStartNotification(this.id, Date.now());
    console.log(this.getMaxLatency());

    this.users.forEach((user) => {
      user.socket.write(startPacket);
    });
  }

  //위치 동기화 함수
  getAllLocation() {
    const maxLatency = this.getMaxLatency();
    const locationData = this.users.map((user) => {
      const { x, y } = user.calculatePosition();
      //user.id는 클라이언트이 Device id이다.
      return { id: user.id, x, y };
    });
    return createLocationPacket(locationData);
  }
}

export default Game;
