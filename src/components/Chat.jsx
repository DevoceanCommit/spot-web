import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const recognition = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  // 세션을 생성하는 함수 (최초 음성 인식이 시작된 후 호출됨)
  const initializeSession = async () => {
    try {
      const sessionResponse = await axios.get(
        "http://203.250.148.52:48003/api/chat"
      );
      const newSessionId = sessionResponse.data.session_id; // 세션 ID가 응답으로 반환
      setSessionId(newSessionId);
      console.log("새로운 세션 ID:", newSessionId);
      return newSessionId;
    } catch (error) {
      console.error("세션 생성 오류:", error);
    }
  };

  // 음성 인식이 완료되면 메시지를 처리하는 함수
  const handleResult = async (transcript) => {
    // 세션 ID가 없으면 세션을 생성
    if (!sessionId) {
      const newSessionId = await initializeSession();
      if (newSessionId) {
        await sendMessage(transcript, newSessionId);
      }
    } else {
      await sendMessage(transcript, sessionId);
    }
  };

  // 음성 인식 객체 초기화
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
      await handleResult(transcript); // 음성 인식 결과를 처리
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
      const aiMessage = response.data; // AI 응답 데이터 전체
      console.log("서버 응답:", aiMessage);

      // AI 응답을 화면에 표시
      setMessages((prev) => [
        ...prev,
        { text: aiMessage.content, sender: "other" },
      ]);

      // 세션 종료 여부 확인
      if (aiMessage.end === true) {
        console.log("세션 종료됨");
        setSessionId(null); // 세션 ID를 초기화하여 세션 종료
      }
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
