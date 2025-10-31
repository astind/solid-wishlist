// @refresh reload
import { Router, RouteSectionProps } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import NavBar from "./components/navbar";

function RootLayout(props: RouteSectionProps) {
  return (
    <div class="flex justify-center mt-8">
      <div class="flex flex-col w-full max-w-4xl">
        <NavBar location="home"></NavBar>
        <div class="bg-base-200 mt-8 rounded-2xl p-4 flex flex-col min-h-svh">
          <Suspense>{props.children}</Suspense>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router root={RootLayout}>
      <FileRoutes />
    </Router>
  );
}
