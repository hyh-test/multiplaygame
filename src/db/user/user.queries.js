export const SQL_QUERIES = {
  FIND_USER_BY_DEVICE_ID: 'SELECT * FROM user WHERE device_id = ?',
  FIND_USER_LAST_POSITION: 'SELECT * FROM last_position WHERE user_id = ?',
  CREATE_USER: 'INSERT INTO user (id, device_id) VALUES (?, ?)',
  CREATE_LAST_POSITION: 'INSERT INTO last_position (id, user_id) VALUES (?, ?)',
  UPDATE_USER_LOGIN: 'UPDATE user SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
  UPDATE_USER_LAST_POSITION: 'UPDATE last_position SET x=?, y=? WHERE user_id = ?',
};