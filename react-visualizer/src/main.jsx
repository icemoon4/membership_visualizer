import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { IdleTimerProvider } from "react-idle-timer";

const FIVE_MINUTES = 1000 * 5;

const handleOnIdle = () => {
  console.log("User is idle");
  window.dispatchEvent(new Event("user-idle"));
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <IdleTimerProvider timeout={FIVE_MINUTES} onIdle={handleOnIdle}>
      <App />
    </IdleTimerProvider>
  </React.StrictMode>
);
