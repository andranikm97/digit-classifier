import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import EventEmitter from "./hooks/EventEmitter";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <EventEmitter>
      <App />
    </EventEmitter>
  </React.StrictMode>
);
