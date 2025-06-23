import pool from "../config/db.config.js";

export const createFriendDb = async ({ user_id, friend_id }) => {
  const result = await pool.query(
    "INSERT INTO friends (member1_id, member2_id, status, date) VALUES ($1, $2, false, CURRENT_DATE) RETURNING *",
    [user_id, friend_id]
  );

  return result.rows;
};
export const startConversationDb = async ({ member1_id, member2_id }) => {
  console.log(member1_id, member2_id)
  const result = await pool.query(
    "INSERT INTO public.friends_conversations (member1_id, member2_id, start_datetime) VALUES ($1, $2, $3) RETURNING c_id",
    [member1_id, member2_id, new Date()]
  );
  return result;
};

export const checkExistDb = async ({ user_id, friend_id }) => {
  const result = await pool.query(
    "SELECT * FROM friends WHERE (member1_id = $1 and member2_id = $2) or (member1_id = $2 and member2_id = $1)",
    [friend_id, user_id]
  );

  return result.rows;
};

export const checkExistConversationDb = async ({ member1Id, member2Id }) => {
  const result = await pool.query(
    "SELECT c_id FROM public.friends_conversations WHERE (member1_id = $1 AND member2_id = $2) OR (member1_id = $2 AND member2_id = $1)",
    [member1Id, member2Id]
  );

  return result.rows;
};

export const addFriendChatDb = async ({
  conversationId,
  senderId,
  messageText,
}) => {
  const result = await pool.query(
    "INSERT INTO friends_messages (c_id, s_id, message) VALUES ($1, $2, $3) RETURNING *",
    [conversationId, senderId, messageText]
  );

  return result.rows;
};
export const getFriendChatDb = async ({ conversationId }) => {
  const result = await pool.query(
    "SELECT m.message,m.m_id ,u.image,u.id AS uid,u.name AS sender FROM friends_messages m INNER JOIN public.users u ON m.s_id = u.id WHERE m.c_id =   $1",
    [conversationId]
  );

  return result.rows;
};

export const addUnseenCountDb = async ({ conversationId }) => {
  await pool.query(
    "UPDATE public.friends_conversations SET unread_message_count = unread_message_count + 1 WHERE c_id = $1",
    [conversationId]
  );

  return true;
};

export const refreshUnseenCountDb = async ({ conversationId }) => {
  await pool.query(
    "UPDATE public.friends_conversations SET unread_message_count = 0 WHERE c_id = $1",
    [conversationId]
  );

  return true;
};

export const getAllConversationsDb = async ({ user_id }) => {
  const { rows: result } = await pool.query(
    `SELECT 
    c.c_id, 
    u.id,
    u.name AS friend_name,
    u.image AS friend_photo,
    c.unread_message_count,
    (
      SELECT message
      FROM friends_messages
      WHERE c_id = c.c_id
      ORDER BY friends_messages.m_id DESC
      LIMIT 1
    ) AS last_message,
    f.status,
    f.member1_id
  FROM 
    public.friends_conversations c
  INNER JOIN 
    public.users u 
  ON 
    (CASE WHEN c.member1_id = $1 THEN c.member2_id ELSE c.member1_id END) = u.id
  INNER JOIN 
    public.friends f  
  ON 
    (c.member1_id = f.member1_id AND c.member2_id = f.member2_id) OR (c.member2_id = f.member1_id AND c.member1_id = f.member2_id)  
  WHERE 
    (c.member1_id = $1 OR c.member2_id = $1) AND f.is_declined = false`,
    [user_id]
  );
  return result;
};
export const FriendRequestExistsDb = async (friend_id) => {
  const { rows: result } = await pool.query(
    "SELECT * FROM friends WHERE member2_id = $1",
    [friend_id]
  );

  return result;
};
export const ApproveFriendRequestDb = async ({user_id, friend_id}) => {
  console.log(user_id, friend_id)
  const { rows: result } = await pool.query(
    "UPDATE friends SET status = $1, date = NOW() WHERE member2_id = $2 and member1_id = $3",
    [1, user_id, friend_id]
  );

  return result;
};

export const getDeclinedRequestsDb = async (user_id) => {
  const { rows: result } = await pool.query(
    "select u.username from friends f join users u on f.member2_id = u.id where f.member1_id = $1 AND is_declined=true",
    [user_id]
  );

  return result;
};

export const DeclineFriendRequestDb = async ({user_id, friend_id}) => {
  console.log(user_id, friend_id)
  const { rows: result } = await pool.query(
    "UPDATE friends SET is_declined = true WHERE member2_id = $1 and member1_id = $2 order by date desc",
    [user_id, friend_id]
  );

  return result;
};
export const DeleteFriendRequestDb = async ({user_id, friend_id}) => {
  const { rows: result } = await pool.query(
    "Delete from friends where member1_id = $1 AND member2_id = $2",
    [user_id, friend_id]
  );

  return result;
};

export const DeleteConversationsDb = async ({user_id, friend_id}) => {
  const { rows: result } = await pool.query(
    "Delete from friends_conversations where member1_id = $1 AND member2_id = $2",
    [user_id, friend_id]
  );

  return result;
};

export const PendingFriendRequestDb = async (user_id) => {
  const { rows: result } = await pool.query(
    "SELECT * FROM friends WHERE member1_id = $1 OR member1_id = $1 AND status = $2",
    [user_id, "false"]
  );

  return result;
};
