import React, { useState } from "react";
import axios from "axios";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;

    // Add user message
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    // Call backend
    try {
      const res = await axios.post("http://localhost:5000/api/chat", { message: input });
      setMessages([...newMessages, { sender: "bot", text: res.data.reply }]);
    } catch (err) {
      console.error(err);
    }

    setInput("");
  };

  return (
    <div className="chatbot p-4 border rounded-lg w-80 bg-white shadow">
      <div className="messages h-64 overflow-y-auto mb-2">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === "user" ? "text-right" : "text-left"}>
            <span className={msg.sender === "user" ? "bg-green-200 p-2 rounded" : "bg-gray-200 p-2 rounded"}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          className="border p-2 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me something..."
        />
        <button onClick={sendMessage} className="bg-green-500 text-white px-4">Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
