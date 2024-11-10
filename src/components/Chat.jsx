// Chat.jsx
import React from "react";

const Chat = () => {
  return (
    <div className="bg-gray-100 rounded-lg p-4 mt-4 w-full max-w-md">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-start">
          <div className="bg-white rounded-xl p-2">Your message goes here</div>
        </div>
        <div className="flex justify-end">
          <div className="bg-pink-300 rounded-xl p-2 text-white">
            Your message goes here
          </div>
        </div>
        <div className="flex justify-start">
          <div className="bg-white rounded-xl p-2">Your message goes here</div>
        </div>
        <div className="flex justify-end">
          <div className="bg-pink-300 rounded-xl p-2 text-white">
            Your message goes here
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <input
          type="text"
          placeholder="Your message goes here"
          className="w-full p-2 rounded-lg border"
        />
        <button className="bg-pink-300 text-white p-2 rounded-lg ml-2">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
