import { ObjectId } from "mongodb";

export interface AuthResponse {
    expires?: string;
    authData?: {
        userId: ObjectId;
    }
}

export interface PostData {
    description: string;
}

export enum LogType {
    INFO = "INFO",
    ERROR = "ERROR"
}
