// App.jsx
import React from "react";
import Face from "./components/Face";
import SensorData from "./components/SensorData";
import Chat from "./components/Chat";

import "./index.css";

const App = () => {
  return (
    <div className="flex items-center justify-center min-h-screen min-w-full bg-white font-bold">
      <div className="flex flex-row justify-between p-4 h-[90%] w-[90%] max-w-5xl">
        <div className="flex flex-col items-center justify-center w-1/2">
          <Face />
          <SensorData />
        </div>
        <div className="w-1/2">
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default App;
