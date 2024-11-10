// index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Tailwind CSS가 포함된 index.css 파일을 import
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
