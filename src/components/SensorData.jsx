import React, { useEffect, useState } from "react";
import axios from "axios";

const SensorData = () => {
  const [sensorData, setSensorData] = useState({
    temperature: { out: "", in: "" },
    humidity: { out: "", in: "" },
    movement: "",
    gas: "",
    sound: "",
  });
  const [error, setError] = useState(null);

  const fetchSensorData = async () => {
    try {
      const response = await axios.get("/api/sensor");
      const data = response.data;
      setSensorData({
        temperature: data.temperature,
        humidity: data.humidity,
        movement: data.movement,
        gas: data.gas,
        sound: data.sound,
      });
    } catch (error) {
      console.error("센서 데이터 가져오기 오류:", error);
      setError("센서 데이터를 불러올 수 없습니다."); // 화면에 표시될 에러 메시지
    }
  };

  useEffect(() => {
    fetchSensorData();
  }, []);

  return (
    <div className="flex justify-around w-full text-center mt-4">
      {error ? (
        <div>{error}</div> // 오류 메시지 출력
      ) : (
        <>
          <div>
            <div>온도/습도</div>
            <div>
              {sensorData.temperature.out}°C / {sensorData.temperature.in}°C
            </div>
            <div>
              습도: {sensorData.humidity.out}% / {sensorData.humidity.in}%
            </div>
          </div>
          <div>
            <div>움직임</div>
            <div>{sensorData.movement}</div>
          </div>
          <div>
            <div>가스유출</div>
            <div>{sensorData.gas}</div>
          </div>
          <div>
            <div>소음</div>
            <div>{sensorData.sound}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default SensorData;
