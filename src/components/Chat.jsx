import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const recognition = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    // 세션 ID가 없을 경우에만 생성
    const initializeSession = async () => {
      if (!sessionId) {
        try {
          const sessionResponse = await axios.get(
            "http://203.250.148.52:48003/api/chat"
          );
          const newSessionId = sessionResponse.data; // 세션 ID가 응답으로 반환되는 경우
          setSessionId(newSessionId);
          console.log("새로운 세션 ID:", newSessionId);
        } catch (error) {
          console.error("세션 생성 오류:", error);
        }
      }
    };
    initializeSession();
  }, [sessionId]);

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
      // 화면에 인식된 텍스트 표시
      setMessages((prev) => [...prev, { text: transcript, sender: "me" }]);
      // 서버로 메시지 전송
      await sendMessage(transcript);
    };
  }

  const startListening = () => {
    if (!isListening) {
      recognition.current.start();
    }
  };

  const sendMessage = async (content) => {
    if (!sessionId) return; // 세션 ID가 없으면 메시지 전송하지 않음

    try {
      const userMessage = {
        session_id: sessionId,
        idx: messages.length, // 메시지 인덱스
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
      console.log("서버 응답:", response.data);

      // AI 응답을 화면에 표시
      const aiResponse = response.data.content; // AI 응답 메시지
      setMessages((prev) => [...prev, { text: aiResponse, sender: "other" }]);
    } catch (error) {
      console.error("메시지 전송 오류:", error);
    }
  };

  return (
    <div className="bg-gray-100 rounded-lg p-4 mt-4 w-full max-w-md h-30">
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
