// src/pages/ChatPage.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const ChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { from: "them", text: "Hi, how can I help you?" },
    { from: "me", text: "I have a question about my trip." },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      setMessages([...messages, { from: "me", text: input }]);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-text-primary">
      <div className="p-4 border-b border-header-background flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="text-button-primary hover:underline">
          <FaArrowLeft />
        </button>
        <h1 className="text-xl font-semibold">Chat with User {id}</h1>
        <button
          onClick={() => navigate('/users')}
          className="ml-auto text-sm text-button-primary underline hover:text-button-primary-hover transition"
        >
          Back to Users
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[20%] px-4 py-2 rounded-lg text-sm shadow ${
              msg.from === "me"
                ? "ml-auto bg-button-primary text-button-text"
                : "mr-auto bg-input"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSend}
        className="p-4 border-t border-header-background flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 rounded border bg-input text-text-primary"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-button-primary text-button-text hover:bg-button-primary-hover transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
