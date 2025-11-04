"use server";
import { redirect } from "@solidjs/router";
import { getRequestEvent, RequestEvent } from "solid-js/web";
import { createNewUser, getExistingUser } from "./users.service";
import { deleteCookie, setCookie } from "vinxi/http";
import { createSession, generateSessionToken, invalidateSession, sessionCookieName } from "../auth";

function getRequest(): [RequestEvent, any] {
  const requestEvent = getRequestEvent();
  if (requestEvent) {
    if (requestEvent.locals.user) {
      return [requestEvent, {user: requestEvent.locals.user, session: requestEvent.locals.session}];
    } else {
      return [requestEvent, null];
    }
  } else {
    throw "Not a server request";
  }
}

async function setSessionToken(request: RequestEvent, userId: string) {
  const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, userId);
  setCookie(request.nativeEvent, sessionCookieName, sessionToken, {expires: session.expiresAt, path: '/'});
}

async function removeSessionToken(request: RequestEvent, sessionId: string) {
  await invalidateSession(sessionId);
  deleteCookie(request.nativeEvent, sessionCookieName, {path: '/'})
}

export async function login(formData: FormData) {
  const [request] = getRequest();
  const username = formData.get('username');
	const password = formData.get('password');
  const userId = await getExistingUser(username, password);
  await setSessionToken(request, userId);
  return {login: true};
}

export async function register(formData: FormData) {
  const [request] = getRequest();
  const username = formData.get('username');
	const password = formData.get('password');
  const userId = await createNewUser(username, password);
  await setSessionToken(request, userId);
  return {register: true}
}

export async function logout() {
  const [request, locals] = getRequest();
  if (locals) {
    await removeSessionToken(request, locals.session.id);
    return {logout: true};
  } else {
    throw "not logged in";
  }
}

export async function isLoggedIn() {
  const [, locals] = getRequest();
  if (locals) {
    return redirect("/home");
  } else {
    return redirect("/login");
  }
}

export async function getUserLocals(redirectUser: boolean = true) {
  const [, locals] = getRequest();
  if (locals) {
    console.log('return user');
    return locals.user;
  } else {
    if (redirectUser) {
      console.log('redirect to login');
      throw redirect("/login");
    } else {
      return undefined
    }
  }
}