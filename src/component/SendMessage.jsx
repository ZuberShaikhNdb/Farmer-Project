// SendMessage.jsx
import React, { useState } from 'react';
import './SendMessage.css';

const SendMessage = ({ sellerPhone }) => {
  const [text, setText] = useState('');

  const handleSend = async () => {
    const res = await fetch('http://localhost:5000/api/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: sellerPhone,
        body: text,
      }),
    });

    const data = await res.json();
    if (data.success) {
      alert('Message sent!');
      setText('');
    } else {
      alert('Error sending message');
    }
  };

  return (
    <div className="send-message-box">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message to the seller..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default SendMessage;
