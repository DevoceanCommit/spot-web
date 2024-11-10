// SensorData.tsx
import React from "react";

const SensorData: React.FC = () => {
  return (
    <div className="flex justify-around w-full text-center mt-4">
      <div>
        <div>온도/습도</div>
        <div>27°C</div>
        <div>습함</div>
      </div>
      <div>
        <div>움직임</div>
        <div>적음</div>
      </div>
      <div>
        <div>공기질</div>
        <div>27°C</div>
      </div>
      <div>
        <div>소음</div>
        <div>27°C</div>
      </div>
    </div>
  );
};

export default SensorData;
