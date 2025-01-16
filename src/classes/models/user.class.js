class User {
  constructor(socket, deviceId, playerId, latency) {
    this.id = deviceId;
    this.socket = socket;
    this.playerId = playerId;
    this.latency = latency;
    this.x = 0;
    this.y = 0;
    this.prevX = 0; // 이전 x 위치
    this.prevY = 0; // 이전 y 위치
    this.lastUpdateTime = Date.now();
  }

  // 위치를 업데이트하고, 이전 위치를 현재 위치로 갱신
  updatePosition(x, y) {
    // 현재 위치를 이전 위치로 갱신
    this.prevX = this.x;
    this.prevY = this.y;
  
    // 새로운 위치를 현재 위치로 갱신
    this.x = x;
    this.y = y;
  
    // 마지막 업데이트 시간 갱신
    this.lastUpdateTime = Date.now();
  }

  ping() {
    const now = Date.now();
    this.socket.write(createPingPacket(now));
  }

  handlePong(data) {
    const now = Date.now();
    this.latency = (now - data.timestamp) / 2;
    console.log(
      `Received pong from user ${this.id} at ${now} with latency ${this.latency}ms`
    );
  }

  // 추측항법을 사용하여 위치를 추정하는 메서드  대락 0.3에서 0.5의 오차가 나온다
  calculatePosition(latency) {
    const timeDiff = latency / 1000; // 레이턴시를 초 단위로 변환
    const speed = 3; // 속도를 3로 고정 (이동 속도)

    // 이전 위치와 현재 위치로부터 이동 방향 및 속도 계산
    const dx = this.x - this.prevX; // x 축의 이동 거리
    const dy = this.y - this.prevY; // y 축의 이동 거리

    // 이동하지 않은 경우 예측하지 않음
    if (dx === 0 && dy === 0) {
      console.log("No movement detected, skipping position prediction.");
      return { x: this.x, y: this.y }; // 이동하지 않으면 예측 없이 현재 위치 반환
    }

    const direction = Math.atan2(dy, dx); // 이동 방향 (라디안 단위)

    // 예측할 시간 동안 이동할 거리 (속도 * 시간 차이)
    const predictedDistance = speed * timeDiff;

    // 예측된 이동 거리 제한 (너무 큰 예측 방지)
    const maxPredictionDistance = 0.5; // 예측 이동 거리 최대값 설정 (이 값은 조정 가능)
    const finalDistance = Math.min(predictedDistance, maxPredictionDistance);

    // dx만 0일 경우 (수평 이동이 없을 때)
    if (dx === 0 && dy !== 0) {
      const predictedY = this.y + Math.sign(dy) * finalDistance;
      console.log("Predicted position: ", this.x, predictedY);
      console.log("----------------");
      return {
        x: this.x, // x 좌표는 그대로 두고
        y: predictedY, // y 좌표는 dy 방향으로 예측
      };
    }

    // dy만 0일 경우 (수직 이동이 없을 때)
    if (dy === 0 && dx !== 0) {
      const predictedX = this.prevX + Math.sign(dx) * finalDistance;
      console.log("Predicted position: ", predictedX, this.y);
      console.log("----------------");
      return {
        x: predictedX, // x 좌표는 dx 방향으로 예측
        y: this.y, // y 좌표는 그대로 두고
      };
    }

    // 이동한 방향으로 예측된 위치 계산
    const predictedX = this.prevX + Math.cos(direction) * finalDistance;
    const predictedY = this.prevY + Math.sin(direction) * finalDistance;

  
    console.log(this.prevX,this.prevY)
    console.log(
      "플러스된 값 ",
      Math.cos(direction) * finalDistance,
      Math.sin(direction) * finalDistance
    );

    console.log("Predicted position: ", predictedX, predictedY);
    console.log("--------------------");

    // 예측된 위치를 반환
    return {
      x: predictedX,
      y: predictedY,
    };
  }
}

export default User;
