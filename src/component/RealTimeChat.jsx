import React, { useState, useEffect, useRef } from 'react';
import './RealTimeChat.css';

const RealTimeChat = ({ socket, productId, sellerInfo, onClose }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (newMessage) => {
      setMessages(prev => {
        const isDuplicate = prev.some(
          msg => msg.content === newMessage.content &&
                 new Date(msg.timestamp).getTime() === new Date(newMessage.timestamp).getTime()
        );
        return isDuplicate ? prev : [...prev, newMessage];
      });
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [socket, productId]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !socket || !productId) return;

    const newMessage = {
      productId,
      content: message,
      sender: 'me',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    socket.emit('sendMessage', newMessage);
    setMessage('');
  };

  return (
    <div className="real-time-chat-container">
      <div className="chat-header">
        <div className="seller-info">
          <h3>Chat with Seller</h3>
          <div className="contact-details">
            <span>📱 {sellerInfo?.phone || 'Not provided'}</span>
            <span>✉️ {sellerInfo?.email || 'Not provided'}</span>
          </div>

        </div>
        <button className="close-chat" onClick={onClose}>×</button>
      </div>

      <div className="chat-messages" ref={chatMessagesRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-container ${msg.sender === 'me' ? 'right' : 'left'}`}
          >
            <div className={`message ${msg.sender === 'me' ? 'sent' : 'received'}`}>
              <span className="content">{msg.content}</span>
              <span className="timestamp">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          disabled={!message.trim()}
          aria-label="Send message"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default RealTimeChat;
