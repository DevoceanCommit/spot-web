import React, { useEffect, useState } from "react";
import axios from "axios";

const SensorData = () => {
  const [sensorData, setSensorData] = useState({
    temperature: { out: "", in: "" },
    humidity: { out: "", in: "" },
    movement: "",
    gas: "",
    sound: "",
    sound_in: "",
  });
  const [error, setError] = useState(null);

  const fetchSensorData = async () => {
    try {
      const response = await axios.get(
        "http://203.250.148.52:48003/api/sensor"
      );
      const latestData = response.data[0].data; // 가장 최신 데이터 (배열의 첫 번째 항목)

      setSensorData({
        temperature: latestData.temperature || { out: "-", in: "-" },
        humidity: latestData.humidty || { out: "-", in: "-" }, // 오타 'humidty'에 주의
        movement: latestData.movement || "-",
        gas: latestData.gas || "-",
        sound: latestData.sound || "-",
        sound_in: latestData.sound_in || "-",
      });

      console.log("성공", latestData);
    } catch (error) {
      console.error("센서 데이터 가져오기 오류:", error);
      setError("센서 데이터를 불러올 수 없습니다.");
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
            <div>소음 상태</div>
            <div>{sensorData.sound}</div>
          </div>
          <div>
            <div>소음 레벨 (실내)</div>
            <div>{sensorData.sound_in}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default SensorData;
