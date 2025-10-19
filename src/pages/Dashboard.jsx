import { useState } from "react";
import Cart from "./Cart";
import Wishlist from "./Wishlist";
import OrderHistory from "./OrderHistory";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("cart");

  const renderTab = () => {
    if (activeTab === "cart") return <Cart />;
    if (activeTab === "wishlist") return <Wishlist />;
    return <OrderHistory />;
  };

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setActiveTab("cart")}
          className={`px-4 py-2 rounded ${
            activeTab === "cart" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Cart
        </button>
        <button
          onClick={() => setActiveTab("wishlist")}
          className={`px-4 py-2 rounded ${
            activeTab === "wishlist" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Wishlist
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded ${
            activeTab === "orders" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Orders
        </button>
      </div>
      {renderTab()}
    </div>
  );
}
