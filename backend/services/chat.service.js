import {
    addMessageDb,
    getAllMessagesDb
  } from "../db/chat.db.js";
  
  class ChatService {
    static addMessage = async (data) => {
      try {
        return await addMessageDb(data);
      } catch (error) {
        console.log(error);
        throw new ErrorHandler("Error While Database Operation", 401);
      }
    };
    static getAllMessages = async (data) => {
        try {
          return await getAllMessagesDb(data);
        } catch (error) {
          console.log(error);
          throw new ErrorHandler("Error While Database Operation", 401);
        }
      };
  }

  export default ChatService;