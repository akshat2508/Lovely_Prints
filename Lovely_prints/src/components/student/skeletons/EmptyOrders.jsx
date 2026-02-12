import { Printer, FilePlus } from "lucide-react";
import "./emptyOrders.css";

export default function EmptyOrders() {
  return (
    <div className="empty-orders">
      <div className="empty-illustration">
        <Printer size={48} />
      </div>

      <h2>No orders yet</h2>
      <p>
        Looks like you haven’t placed any print orders yet.
        <br />
        Once you do, they’ll appear right here.
      </p>

      <button className="primary-btn-k">
        <FilePlus size={18} />
        Place your first order
      </button>
    </div>
  );
}
