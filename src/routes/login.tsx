import {
  RouteDefinition,
  useNavigate,
  useSubmission,
} from "@solidjs/router";
import { createEffect, Show } from "solid-js";
import { isLoggedInQuery, loginAction, registerAction } from "~/api/users/users.actions";

export const route = {
  preload() {
    isLoggedInQuery()
  }
} satisfies RouteDefinition

export default function LoginPage() {
  const loggingIn = useSubmission(loginAction);
  const registering = useSubmission(registerAction);
  const nav = useNavigate();

  createEffect(() => {
    if (loggingIn.result) {
      console.log("login success");
      nav("/home", {replace: true});
    }
    if (registering.result) {
      nav("/home", {replace: true});
    }
  })

  return (
    <main>
      <div class="hero bg-base-200 mt-4">
        <div class="hero-content flex-col lg:flex-row-reverse">
          <div class="text-center lg:text-left">
            <h1 class="text-5xl font-bold">Login/Register</h1>
            <p class="py-6">
              Login to access your lists. Register to start building your lists.
              All you need is a username and password.
            </p>
          </div>
          <div class="card bg-base-100 border border-base-300 w-full max-w-sm shrink-0 shadow-2xl">
            <div class="card-body">
              <fieldset class="fieldset">
                <form action={loginAction} method="post">
                  <label class="label" for="username">Username</label>
                  <input class="input" id="username" name="username" placeholder="Username" required />
                  <label class="label mt-2" for="password">Password</label>
                  <input id="password" type="password" name="password" class="input" placeholder="Password" required />
                  <div class="mt-2">
                    <a class="link link-hover" href="/help">
                      Forgot password?
                    </a>
                  </div>
                  <div class="flex mt-2 space-x-4">
                    <button class="btn btn-primary">Login</button>
                    <button class="btn btn-secondary" formaction={registerAction}>Register</button>
                  </div>
                </form>
              </fieldset>
              <Show when={loggingIn.error}>
                <p style={{color: "red"}} role="alert" id="error-message">
                  {loggingIn.error}
                </p>
              </Show>
              <Show when={registering.error}>
                <p style={{color: "red"}} role="alert" id="error-message">
                  {registering.error}
                </p>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
