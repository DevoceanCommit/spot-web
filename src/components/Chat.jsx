/* import React, { useState, useRef, useEffect } from "react";
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
*/

import React, { useState, useEffect } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const predefinedResponses = [
    { text: "안녕하세요 오늘 외출 계획이 있으신가요?", sender: "other" },
    { text: "응, 친구들이랑 밖에 나가려고", sender: "me" },
    {
      text: "오늘 바깥 기온이 13도에요, 외출할때 따뜻하게 챙겨입고 나가세요.",
      sender: "other",
    },
    { text: "그래 고맙다", sender: "me" },
    { text: "어제 잠은 푹 주무셨나요?", sender: "other" },
    { text: "응 안 깨고 푹 잤다", sender: "me" },
    {
      text: "잘 주무셨다니 다행이네요. 요즘 기분은 어떠세요? 우울하거나 기분이 안 좋지는 않으세요?",
      sender: "other",
    },
    { text: "요즘 집에 혼자 있는 시간이 많아서 우울하네", sender: "me" },
    {
      text: "가벼운 산책과 외출은 기분 전환에 큰 도움이 된답니다. 주변 산책로를 검색해드릴까요?",
      sender: "other",
    },
    { text: "아니야 괜찮아 집 앞 공원 산책 하고 오마", sender: "me" },
    {
      text: "알겠습니다. 언제든 도움이 필요하시면 저를 찾아주세요.\n \n대화가 종료되었습니다.",
      sender: "other",
    },
  ];

  useEffect(() => {
    if (currentIndex < predefinedResponses.length) {
      const timer = setTimeout(() => {
        setMessages((prev) => [...prev, predefinedResponses[currentIndex]]);
        setCurrentIndex((prev) => prev + 1);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

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
                message.sender === "me" ? "bubble-right" : "bubble-left"
              } rounded-xl p-2 max-w-[80%] break-words`}
              style={{ whiteSpace: "pre-wrap" }} // 줄 바꿈 적용
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
          onClick={() =>
            console.log("음성 인식 기능이 현재 비활성화 상태입니다.")
          }
        >
          <img src="/assets/mic.png" alt="mic" style={{ width: "25px" }} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
