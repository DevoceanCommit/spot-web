import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const recognition = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const initializeSession = async () => {
    try {
      const sessionResponse = await axios.get(
        "http://203.250.148.52:48003/api/chat"
      );
      const newSessionId = sessionResponse.data.session_id;
      setSessionId(newSessionId);
      console.log("새로운 세션 ID:", newSessionId);
    } catch (error) {
      console.error("세션 생성 오류:", error);
    }
  };

  const handleResult = async (transcript) => {
    if (!sessionId) {
      await initializeSession();
    }

    if (sessionId) {
      await sendMessage(transcript, sessionId);
    }
  };

  if (!recognition.current) {
    recognition.current = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.current.lang = "ko-KR";

    recognition.current.onstart = () => {
      document.getElementById("micButton").classList.add("pulse");
      setIsListening(true);
    };

    recognition.current.onend = () => {
      document.getElementById("micButton").classList.remove("pulse");
      setIsListening(false);
    };

    recognition.current.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("음성 인식 결과:", transcript);
      setMessages((prev) => [...prev, { text: transcript, sender: "me" }]);
      await handleResult(transcript);
    };
  }

  const startListening = () => {
    if (!isListening) {
      recognition.current.start();
    }
  };

  const sendMessage = async (content, currentSessionId) => {
    try {
      const userMessage = {
        session_id: currentSessionId,
        idx: messages.length,
        type: "user",
        end: false,
        content: content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("전송할 메시지 데이터:", userMessage);

      const response = await axios.post(
        "http://203.250.148.52:48003/api/chat",
        userMessage
      );
      const aiMessage = response.data;
      console.log("서버 응답:", aiMessage);

      setMessages((prev) => [
        ...prev,
        { text: aiMessage.content, sender: "other" },
      ]);

      if (aiMessage.end === true) {
        console.log("세션 종료됨");
        setSessionId(null);
      }
    } catch (error) {
      console.error("메시지 전송 오류:", error);
    }
  };

  return (
    <div
      className="bg-gray-100 rounded-lg p-4 mt-4 h-30"
      style={{ height: "220px" }}
    >
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
          className="bg-pink-300 text-white p-4 rounded-full flex items-center justify-center w-3 h-3"
          onClick={startListening}
        >
          🎤
        </button>
      </div>
    </div>
  );
};

export default Chat;
