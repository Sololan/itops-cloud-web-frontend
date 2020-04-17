/**
 * 模型通用属性
 */
export interface BaseModel {
  createTime?: string;
  createUser?: number;
  createUsername?: string;
  updateTime?: string;
  updateUser?: number;
  updateUsername?: string;
  deleteFlag?: number;
  deleteTime?: string;
  deleteUser?: number;
  deleteUsername?: string;
}

export interface LoginInfo {
  username: string;
  password: string;
}
