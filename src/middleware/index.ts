import { createMiddleware } from "@solidjs/start/middleware";
import { deleteCookie, getCookie, setCookie } from "vinxi/http";
import { sessionCookieName, validateSessionToken } from "~/api/auth";

export default createMiddleware( {
  onRequest: async (event) => {
    const sessionCookie = getCookie(event.nativeEvent, sessionCookieName);
    if (!sessionCookie) {
      event.locals.user = null;
      event.locals.session = null;
    } else {
      const {session, user} = await validateSessionToken(sessionCookie);
      if (session) {
        setCookie(event.nativeEvent, sessionCookieName, sessionCookie, {expires: session.expiresAt})
      } else {
        deleteCookie(event.nativeEvent, sessionCookieName)
      }
      event.locals.user = user;
      event.locals.session = session
    }
  }
})