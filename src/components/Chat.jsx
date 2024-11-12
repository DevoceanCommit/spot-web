// Chat.jsx
import React, { useState, useRef } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const recognition = useRef(null);
  const [isListening, setIsListening] = useState(false);

  // 컴포넌트가 마운트될 때 SpeechRecognition 설정
  if (!recognition.current) {
    recognition.current = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.current.lang = "ko-KR";

    recognition.current.onstart = () => {
      console.log("음성 인식 시작");
      document.getElementById("micButton").classList.add("pulse");
      setIsListening(true);
    };

    recognition.current.onend = () => {
      console.log("음성 인식 종료");
      document.getElementById("micButton").classList.remove("pulse");
      setIsListening(false);
    };

    recognition.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("음성 인식 결과:", transcript); // 인식된 텍스트 로그 출력
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: transcript, sender: "me" },
        { text: "음성 인식이 잘 되었습니다", sender: "other" },
      ]);
    };
  }

  // 음성 인식 시작 함수
  const startListening = () => {
    if (!isListening) {
      recognition.current.start();
    }
  };

  return (
    <div className="bg-gray-100 rounded-lg p-4 mt-4 w-full max-w-md">
      <div className="flex flex-col space-y-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`${
                message.sender === "me" ? "bg-pink-300 text-white" : "bg-white"
              } rounded-xl p-2`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <button
          id="micButton"
          className="bg-pink-300 text-white p-4 rounded-full flex items-center justify-center"
          onClick={startListening}
        >
          🎤
        </button>
      </div>
    </div>
  );
};

export default Chat;
