import "dotenv/config";
import {db, rtdb, auth} from "./firebase.config";
import { BAD_REQUEST, CONFLICT, CREATED, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, TOO_MANY_REQUESTS, UNAUTHORIZED, UNPROCESSABLE_CONTENT } from "./http";

export const configs = {
    db, 
    rtdb, 
    auth,
    frontend_url: process.env.FRONTEND_URL || ""
}


export type HttpStatusCode =
  | typeof OK
  | typeof CREATED
  | typeof BAD_REQUEST
  | typeof UNAUTHORIZED
  | typeof FORBIDDEN
  | typeof NOT_FOUND
  | typeof CONFLICT
  | typeof UNPROCESSABLE_CONTENT
  | typeof TOO_MANY_REQUESTS
  | typeof INTERNAL_SERVER_ERROR;