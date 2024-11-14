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
    <div className="flex justify-around w-full h-[60%] text-center ">
      {error ? (
        <div>{error}</div> // 오류 메시지 출력
      ) : (
        <>
          <div className="flex flex-row flex-wrap items-center bg-pink-300 p-3 rounded-2xl shadow-lg space-x-4 ">
            <div className="bg-white p-6 rounded-full shadow-lg hover:shadow-2xl transition-shadow duration-200 transform hover:-translate-y-1 flex-grow min-h-[120px]">
              <h2 className="text-lg font-medium text-gray-900">온도</h2>
              <p className="text-gray-600 text-sm">
                실외: {sensorData.temperature.out}°C <br /> 실내:{" "}
                {sensorData.temperature.in}°C
              </p>
            </div>

            <div className="bg-white p-6 rounded-full shadow-lg hover:shadow-2xl transition-shadow duration-200 transform hover:-translate-y-1 flex-grow min-h-[120px]">
              <h2 className="text-lg font-medium text-gray-900">습도</h2>
              <p className="text-gray-600 text-sm">
                실외: {sensorData.humidity.out}% <br /> 실내:{" "}
                {sensorData.humidity.in}%
              </p>
            </div>

            <div className="bg-white p-6 rounded-full shadow-lg hover:shadow-2xl transition-shadow duration-200 transform hover:-translate-y-1 flex-grow min-h-[120px]">
              <h2 className="text-lg font-medium text-gray-900 mb-1">움직임</h2>
              <p className="text-gray-600 text-sm">{sensorData.movement}</p>
            </div>

            <div className="bg-white p-6 rounded-full shadow-lg hover:shadow-2xl transition-shadow duration-200 transform hover:-translate-y-1 flex-grow min-h-[120px]">
              <h2 className="text-lg font-medium text-gray-900 mb-1">
                가스유출
              </h2>
              <p className="text-gray-600 text-sm">{sensorData.gas}</p>
            </div>

            <div className="bg-white p-6 rounded-full shadow-lg hover:shadow-2xl transition-shadow duration-200 transform hover:-translate-y-1 flex-grow min-h-[120px]">
              <h2 className="text-lg font-medium text-gray-900 mb-1">
                실내 소음
              </h2>
              <p className="text-gray-600 text-sm">
                {sensorData.sound}
                <br />({sensorData.sound_in} 데시벨)
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SensorData;
