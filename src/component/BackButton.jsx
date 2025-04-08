// src/components/BackButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./BackButton.css";

const BackButton = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // -1 means go back one step in history
  };

  return (
    <button className="back-button" onClick={goBack}>
      ⬅️ Back
    </button>
  );
};

export default BackButton;
