import pool from "../config/db.config.js";
import fs from "fs";
export const createGroupDb = async ({
  group_name,
  group_description,
  creator_id,
  image,
  participants,
}) => {
  const result = await pool.query(
    "INSERT INTO groups ( group_name, group_icon ,group_description , creator_id ) VALUES ($1, $2 ,$3,$4) RETURNING *",
    [group_name, image, group_description, creator_id]
  );

  const group_id = result.rows[0].group_id;

  const participantInsertQuery = `
    INSERT INTO group_participants (group_id,user_id,role)
    VALUES ($1, $2,$3);
  `;

  for (const participant of participants) {
    const { rows: user } = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [participant]
    );

    if (user.length > 0) {
      const userId = user[0].id;

      await pool.query(participantInsertQuery, [group_id, userId, 3]);
    }
  }

  await pool.query(participantInsertQuery, [group_id, creator_id, 1]);

  return result.rows;
};
export const deleteGroupDb = async (group_id) => {
  const { rows: group } = await pool.query(
    "SELECT * FROM groups WHERE group_id = $1",
    [group_id]
  );

  const img_url = group[0].group_icon.split("GroupImage/")[1];

  try {
    await fs.promises.unlink(`./upload/GroupImage/${img_url}`);
  } catch (error) {
    console.error("Error deleting icon:", error);
  }

  await pool.query(
    "DELETE FROM expense_participants WHERE expense_id IN ( SELECT expense_id FROM expense_creation WHERE group_id = $1)",
    [group_id]
  );

  await pool.query("DELETE FROM expense_creation WHERE group_id = $1", [
    group_id,
  ]);

  await pool.query("DELETE FROM group_conversations WHERE group_id = $1", [
    group_id,
  ]);

  const result = await pool.query(
    "DELETE FROM group_participants WHERE group_id = $1",
    [group_id]
  );

  await pool.query("DELETE FROM groups WHERE group_id = $1", [group_id]);

  return result.rows;
};
export const updateGroupDb = async ({
  group_id,
  group_name,
  group_description,
  image,
}) => {
  const result = await pool.query(
    "UPDATE groups SET group_name = $2 , group_description = $3 , group_icon = $4  WHERE group_id = $1",
    [group_id, group_name, group_description, image]
  );

  return result.rows;
};
export const addMemberGroupDb = async ({ participants, group_id }) => {
  const participantInsertQuery = `
    INSERT INTO group_participants (group_id, user_id,role)
    VALUES ($1, $2,$3);
  `;

  for (const participant of participants) {
    const { rows: user } = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [participant]
    );

    if (user.length > 0) {
      const userId = user[0].id;
      await pool.query(participantInsertQuery, [group_id, userId, 3]);
    }
  }
};

export const removeMemberGroupDb = async ({ user_id, group_id }) => {
  try {
    const result = await pool.query(
      "DELETE FROM group_participants WHERE group_id = $1 AND user_id = $2",
      [group_id, user_id]
    );
  } catch (error) {
    console.log(error);
  }
};

export const addMessageGroupDb = async ({ group_id, sender_id, message }) => {
  const result = await pool.query(
    "INSERT INTO group_conversations (group_id,sender_id,message) VALUES ($1,$2,$3)",
    [group_id, sender_id, message]
  );

  return result.rows;
};
export const groupDetailsDb = async (group_id) => {
  const result = await pool.query("SELECT * FROM groups WHERE group_id = $1", [
    group_id,
  ]);

  return result.rows;
};
export const groupMembersDetailDb = async (group_id) => {
  const result = await pool.query(
    "SELECT u.*,gp.group_id FROM group_participants gp JOIN users u ON u.id = gp.user_id WHERE gp.group_id = $1",
    [group_id]
  );

  return result.rows;
};
export const usersGroupsDb = async (user_id) => {
  const result = await pool.query(
    `SELECT
    g.*,
    COALESCE(SUM(CASE WHEN ep.debtor_id = $1 THEN ep.amount ELSE 0 END), 0) AS amount_owed,
    COALESCE(SUM(CASE WHEN ep.payer_id = $1 AND ep.debtor_id <> $1 THEN ep.amount ELSE 0 END), 0) AS amount_owed_to
  FROM groups g
  INNER JOIN group_participants gp ON g.group_id = gp.group_id
  LEFT JOIN expense_participants ep ON ep.expense_id IN (
    SELECT expense_id
    FROM expense_creation
    WHERE group_id = g.group_id
  )
  WHERE gp.user_id = $1
  GROUP BY g.group_id;
  `,
    [user_id]
  );

  return result.rows;
};
export const balanceExpenseDb = async ({ group_id }) => {
  const result = await pool.query(
    `SELECT
    u.name,
    u.id,
    u.image,
    COALESCE(SUM(CASE WHEN ep.debtor_id = u.id THEN ep.amount ELSE 0 END), 0) AS amount_owed,
    COALESCE(SUM(CASE WHEN ep.payer_id = u.id AND ep.debtor_id <> u.id THEN ep.amount ELSE 0 END), 0) AS amount_owed_to
  FROM users u
  JOIN group_participants gp ON gp.user_id = u.id
  JOIN expense_creation e ON e.group_id = gp.group_id
  JOIN expense_participants ep ON ep.expense_id = e.expense_id
  WHERE gp.group_id = $1
  GROUP BY u.id; 
  `,
    [group_id]
  );

  return result.rows;
};

export const groupMemberAndDetailDb = async (group_id) => {
  const result = await pool.query(
    "SELECT u.*,gp.*,g.* FROM group_participants gp JOIN users u ON u.id = gp.user_id JOIN groups g ON gp.group_id = g.group_id WHERE gp.group_id = $1",
    [group_id]
  );

  return result.rows;
};

export const dismissAdminGroupDb = async ({ user_id, group_id }) => {
  const result = await pool.query(
    "UPDATE group_participants SET role = 3 WHERE group_id = $1 AND user_id = $2 RETURNING *",
    [group_id, user_id]
  );

  return result.rows;
};

export const promoteAdminGroupDb = async ({ user_id, group_id }) => {
  const result = await pool.query(
    "UPDATE group_participants SET role = 2 WHERE group_id = $1 AND user_id = $2 RETURNING *",
    [group_id, user_id]
  );

  return result.rows;
};
