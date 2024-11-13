// App.jsx
import React from "react";
import Face from "./components/Face";
import SensorData from "./components/SensorData";
import Chat from "./components/Chat";

import "./index.css";

const App = () => {
  return (
    <div className="flex flex-col gap-y-20 min-h-screen min-w-full bg-white font-bold">
      <span className="flex items-center font-bold text-4xl justify-center mt-10 font-col text-pink-300 ">
        시니어를 위한 AI 동반자, SPOT CALL
      </span>
      <div>
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
    </div>
  );
};

export default App;
