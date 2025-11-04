import { action, query } from "@solidjs/router";
import { getUserLocals, isLoggedIn, login, logout, register } from "./users.controller";

export const isLoggedInQuery = query(isLoggedIn, "isLoggedIn");
export const loginAction = action(login, "login");
export const registerAction = action(register, "register");
export const logoutAction = action(logout, "logout");
export const getUserLocalsQuery = query(getUserLocals, "getUserLocals");