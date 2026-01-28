import { useState } from "react";
import { Printer, FilePlus, X } from "lucide-react";
import "./emptyShoporders.css";
import ReactionGame from "./game/ReactionGame";

export default function EmptyShopOrders() {
  const [showGame, setShowGame] = useState(false);

  return (
    <>
      <div className="empty-orders">
        <div className="empty-illustration">
          <Printer size={48} />
        </div>

        <h2>No orders yet</h2>
        <p>
          Looks like there are no print orders yet.
          <br />
          Once there are orders, they’ll appear right here.
        </p>

        <button className="primary-btn" onClick={() => setShowGame(true)}>
          <FilePlus size={18} />
          Play Time
        </button>
      </div>

      {showGame && <ReactionGame onClose={() => setShowGame(false)} />}
    </>
  );
}
