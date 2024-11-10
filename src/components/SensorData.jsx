// SensorData.jsx
import React from "react";

const SensorData = () => {
  return (
    <div className="flex justify-around w-full text-center mt-4">
      <div>
        <div>온도/습도</div>
        <div>
          {temperature.out}°C{temperature.in}°C
        </div>
        <div>
          {humidity.out}
          {humidity.in}
        </div>
      </div>
      <div>
        <div>움직임</div>
        <div>{movement}</div>
      </div>
      <div>
        <div>가스유출</div>
        <div>{gas}</div>
      </div>
      <div>
        <div>소음</div>
        <div>{sound}</div>
      </div>
    </div>
  );
};

export default SensorData;
