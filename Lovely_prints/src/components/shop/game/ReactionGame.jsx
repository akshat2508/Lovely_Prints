import { useState } from 'react';
import React from 'react'
import "../emptyShoporders.css"
import { Printer, FilePlus, X } from "lucide-react";

const  ReactionGame = ({ onClose })=> {
  const [state, setState] = useState("waiting"); // waiting | ready | clicked
  const [startTime, setStartTime] = useState(null);
  const [reaction, setReaction] = useState(null);

  const startGame = () => {
    setState("waiting");
    setReaction(null);

    const delay = Math.random() * 3000 + 2000; // 2–5 sec
    setTimeout(() => {
      setStartTime(Date.now());
      setState("ready");
    }, delay);
  };

  const handleClick = () => {
    if (state === "ready") {
      setReaction(Date.now() - startTime);
      setState("clicked");
    }
  };

  // start on open
  useState(() => {
    startGame();
  }, []);

  return (
    <div className="game-overlay">
      <div className="game-modal">
        <button className="game-close" onClick={onClose}>
          <X size={18} />
        </button>

        <h3>Reaction Time Game</h3>

        <div
          className={`game-box ${state}`}
          onClick={handleClick}
        >
          {state === "waiting" && "Wait for green…"}
          {state === "ready" && "CLICK!"}
          {state === "clicked" && `${reaction} ms`}
        </div>

        {state === "clicked" && (
          <button className="primary-btn" onClick={startGame}>
            Play Again
          </button>
        )}
      </div>
    </div>
  );
}


export default ReactionGame