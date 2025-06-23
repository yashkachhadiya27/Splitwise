import pool from "../config/db.config.js";
import ChatService from "../services/chat.service.js";

export const addMessage = async(req, res, next) => {
    try {
        const { chat_id, sender_id, message } = req.body;
    
        const result = await ChatService.addMessage(req.body);
    
        res.status(201).json({
          success: true,
          message: `Message Added successfully!`,
          result: result,
        });
      } catch (error) {
        next(error);
      }
};

export const getAllMessages = async(req, res, next) => {
    try { 
        const c_id = req.params.c_id;

        const result = await ChatService.getAllMessages(c_id);
    
        res.status(200).json({
          success: true,
          message: `Messages fetched successfully!`,
          result: result,
        });
      } catch (error) {
        next(error);
      }
};





