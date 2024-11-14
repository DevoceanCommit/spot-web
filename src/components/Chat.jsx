import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const recognition = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [idx, setIdx] = useState(0); // 메시지 순서를 관리하는 인덱스
  const [currentTranscript, setCurrentTranscript] = useState(""); // 현재 음성 인식 텍스트

  // 페이지가 로드될 때 세션을 초기화하고 첫 번째 AI 메시지를 받아옴
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const sessionResponse = await axios.get(
          "http://203.250.148.52:48003/api/chat"
        );
        const newSessionId = sessionResponse.data.session_id;
        setSessionId(newSessionId);

        // 첫 번째 AI 응답 메시지를 화면에 표시
        setMessages([{ text: sessionResponse.data.content, sender: "other" }]);
        console.log("새로운 세션 ID:", newSessionId);
      } catch (error) {
        console.error("세션 생성 오류:", error);
      }
    };
    initializeSession();
  }, []);

  // 음성 인식을 설정하는 useEffect로 한번만 초기화
  useEffect(() => {
    if (!recognition.current) {
      recognition.current = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition)();
      recognition.current.lang = "ko-KR";

      recognition.current.onstart = () => {
        document.getElementById("micButton").classList.add("pulse");
        setIsListening(true);
      };

      recognition.current.onend = async () => {
        document.getElementById("micButton").classList.remove("pulse");
        setIsListening(false);
        if (currentTranscript) {
          // 인식된 텍스트가 있을 때만 sendMessage 호출
          await sendMessage(currentTranscript);
          setCurrentTranscript(""); // 전송 후 텍스트 초기화
        }
      };

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("음성 인식 결과:", transcript);
        setCurrentTranscript(transcript); // 현재 텍스트 저장
        setMessages((prev) => [...prev, { text: transcript, sender: "me" }]);
      };
    }
  }, [currentTranscript]);

  const startListening = () => {
    if (!isListening) {
      recognition.current.start();
    }
  };

  // POST 요청으로 메시지 전송
  const sendMessage = async (content) => {
    try {
      if (!sessionId) {
        console.warn(
          "세션 ID가 설정되지 않았습니다. 메시지를 전송하지 않습니다."
        );
        return;
      }

      // 수정된 userMessage 객체
      const userMessage = {
        session_id: sessionId,
        idx: idx,
        type: "user",
        content: content,
      };

      console.log("전송할 메시지 데이터:", userMessage);

      const response = await axios.post(
        "http://203.250.148.52:48003/api/chat",
        userMessage
      );
      const aiMessage = response.data;
      console.log("서버 응답:", aiMessage);

      // 사용자 메시지와 AI 응답을 화면에 추가
      setMessages((prev) => [
        ...prev,
        { text: content, sender: "me" }, // 사용자가 입력한 텍스트
        { text: aiMessage.content, sender: "other" }, // AI 응답 텍스트
      ]);

      // idx 증가
      setIdx((prevIdx) => prevIdx + 1);

      // 세션 종료 조건
      if (aiMessage.end === true) {
        console.log("세션 종료됨");
        setSessionId(null); // 세션 ID 초기화
        setIdx(0); // 인덱스 초기화
      }
    } catch (error) {
      console.error(
        "메시지 전송 오류:",
        error.response ? error.response.data : error.message
      );
      console.log("전송 오류가 발생한 메시지 데이터:", content);
      console.log("세션 ID:", sessionId);
    }
  };

  return (
    <div
      className="bg-gray-100 rounded-lg p-4 mt-4 w-full max-w-md relative"
      style={{ height: "300px", overflowY: "auto" }}
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
      <div className="w-full flex justify-center p-4">
        <button
          id="micButton"
          className="bg-pink-300 text-white p-2 rounded-full flex items-center justify-center"
          onClick={startListening}
        >
          <img src="/assets/mic.png" alt="mic" style={{ width: "25px" }} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
