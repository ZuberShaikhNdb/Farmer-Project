import React, { useState } from 'react';
import './ContactSeller.css';

const ContactSeller = ({ contact, onClose }) => {
  const [messages, setMessages] = useState([
    { sender: 'seller', text: 'Hi! How can I help you?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: 'you', text: input }]);
    setInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: 'seller', text: 'Thanks for your message! I will get back to you soon.' }
      ]);
    }, 1000);
  };

  return (
    <div className="chat-modal" onClick={onClose}>
      <div className="chat-box" onClick={(e) => e.stopPropagation()}>
        <div className="chat-header">
          <h3>Chat with Seller</h3>
          <button className="close-chat" onClick={onClose}>×</button>
        </div>

        {/* Display Contact Info */}
        {contact && (
          <div className="contact-info">
            <p><strong>Phone:</strong> {contact.phone}</p>
            <p><strong>Email:</strong> {contact.email}</p>
          </div>
        )}

        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ContactSeller;
