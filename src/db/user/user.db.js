import { v4 as uuidv4 } from "uuid";
import pools from "../database.js";
import { SQL_QUERIES } from "./user.queries.js";
import { toCamelCase } from "../../utils/transformCase.js";

export const findUserByDeviceID = async (deviceId) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_DEVICE_ID, [
    deviceId,
  ]);
  return toCamelCase(rows[0]);
};

export const createUser = async (deviceId) => {
  const id = uuidv4();
  const userId = id;
  await pools.USER_DB.query(SQL_QUERIES.CREATE_USER, [id, deviceId]);
  await pools.USER_DB.query(SQL_QUERIES.CREATE_LAST_POSITION, [
    uuidv4(),
    userId,
  ]);

  return { id, deviceId };
};

export const updateUserLogin = async (id) => {
  await pools.USER_DB.query(SQL_QUERIES.UPDATE_USER_LOGIN, [id]);
};

export const findUserLastpositionByID = async (userId) => {
  // 첫 번째로 사용자의 마지막 위치를 조회
  const [rows] = await pools.USER_DB.query(
    SQL_QUERIES.FIND_USER_LAST_POSITION,
    [userId]
  );

  // 데이터가 없다면 새로 생성
  if (!rows || rows.length === 0) {
    const newPositionId = uuidv4(); // 새로운 UUID 생성
    await pools.USER_DB.query(SQL_QUERIES.CREATE_LAST_POSITION, [
      newPositionId,
      userId,
    ]);

    // 새로 생성한 위치를 다시 조회하여 반환
    const [newRows] = await pools.USER_DB.query(
      SQL_QUERIES.FIND_USER_LAST_POSITION,
      [userId]
    );
    return toCamelCase(newRows[0]);
  }

  return toCamelCase(rows[0]);
};

export const updateUserLastposition = async (userId, x, y) => {
  const [rows] = await pools.USER_DB.query(
    SQL_QUERIES.UPDATE_USER_LAST_POSITION,
    [x, y, userId]
  );
  return toCamelCase(rows[0]);
};
