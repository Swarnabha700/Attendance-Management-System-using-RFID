// db.js
import oracledb from 'oracledb';

oracledb.autoCommit = true;

const dbConfig = {
  user: 'C##attendance',
  password: '123',
  connectString: 'localhost:1521/XE'
};

export const getConnection = async () => {
  try {
    return await oracledb.getConnection(dbConfig);
  } catch (err) {
    console.error('DB Connection Error:', err);
    throw err;
  }
};
