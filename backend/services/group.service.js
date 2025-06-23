import {
  addMemberGroupDb,
  createGroupDb,
  deleteGroupDb,
  removeMemberGroupDb,
  addMessageGroupDb,
  groupDetailsDb,
  groupMembersDetailDb,
  usersGroupsDb,
  balanceExpenseDb,
  updateGroupDb,
  groupMemberAndDetailDb,
  promoteAdminGroupDb,
  dismissAdminGroupDb,
} from "../db/group.db.js";

class GroupService {
  static createGroup = async (data) => {
    try {
      return await createGroupDb(data);
    } catch (error) {
      console.log(error);
      throw new ErrorHandler("Error While Database Operation", 401);
    }
  };
  static deleteGroup = async (data) => {
    try {
      return await deleteGroupDb(data);
    } catch (error) {
      console.log(error);
      throw new ErrorHandler("Error While Database Operation", 401);
    }
  };
  static updateGroup = async (data) => {
    try {
      return await updateGroupDb(data);
    } catch (error) {
      console.log(error);
      throw new ErrorHandler("Error While Database Operation", 401);
    }
  };
  static addMemberGroup = async (data) => {
    try {
      return await addMemberGroupDb(data);
    } catch (error) {
      console.log(error);
      throw new ErrorHandler("Error While Database Operation", 401);
    }
  };
  static removeMemberGroup = async (data) => {
    try {
      return await removeMemberGroupDb(data);
    } catch (error) {
      console.log(error);
      throw new ErrorHandler("Error While Database Operation", 401);
    }
  };
  static addMessageGroup = async (data) => {
    try {
      return await addMessageGroupDb(data);
    } catch (error) {
      console.log(error);
      throw new ErrorHandler("Error While Database Operation", 401);
    }
  };
  static groupDetails = async (data) => {
    try {
      return await groupDetailsDb(data);
    } catch (error) {
      console.log(error);
      throw new ErrorHandler("Error While Database Operation", 401);
    }
  };
  static groupMembersDetail = async (data) => {
    try {
      return await groupMembersDetailDb(data);
    } catch (error) {
      console.log(error);
      throw new ErrorHandler("Error While Database Operation", 401);
    }
  };
  static usersGroups = async (data) => {
    try {
      return await usersGroupsDb(data);
    } catch (error) {
      console.log(error);
      throw new ErrorHandler("Error While Database Operation", 401);
    }
  };
  static balanceExpense = async (data) => {
    try {
      return await balanceExpenseDb(data);
    } catch (error) {
      console.log(error);
      throw new ErrorHandler("Error While Database Operation", 401);
    }
  };

  static groupMemberAndDetail = async (data) => {
    try {
      return await groupMemberAndDetailDb(data);
    } catch (error) {
      console.log(error);
      throw new ErrorHandler("Error While Database Operation", 401);
    }
  };
  static promoteAdminGroup = async (data) => {
    try {
      return await promoteAdminGroupDb(data);
    } catch (error) {
      console.log(error);
      throw new ErrorHandler("Error While Database Operation", 401);
    }
  };
  static dismissAdminGroup = async (data) => {
    try {
      return await dismissAdminGroupDb(data);
    } catch (error) {
      console.log(error);
      throw new ErrorHandler("Error While Database Operation", 401);
    }
  };
}

export default GroupService;
