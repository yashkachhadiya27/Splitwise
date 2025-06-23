import pool from "../config/db.config.js";

export const addMessageDb = async ({ chat_id, sender_id, message }) => {
  const result = await pool.query(
    "INSERT INTO friends_messages (c_id, s_id, message) VALUES ($1, $2, $3) RETURNING *",
    [chat_id, sender_id, message]
  );

  return result.rows;
};

export const getAllMessagesDb = async ( c_id ) => {
    const result = await pool.query(
      "select * from friends_messages where c_id = $1 order by timestamp",
      [c_id]
    );
  
    return result.rows;
  };