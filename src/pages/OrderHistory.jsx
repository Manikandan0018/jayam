import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// ------------------------------------------------------------------
// ⭐️ REACT ICONS IMPORTS ⭐️
import {
  FaRegCalendarAlt,
  FaMapMarkerAlt,
  FaTag,
  FaCheckCircle,
  FaTruck,
  FaBoxOpen,
} from "react-icons/fa";
// ------------------------------------------------------------------

// Helper function to determine badge color and icon based on status
const getStatusBadge = (status) => {
  let classes, icon, text; // ✅ Fixed JS syntax

  switch (status) {
    case "Shipped":
      classes = "bg-blue-100 text-blue-700 border-blue-500";
      icon = FaTruck;
      text = "Out for Delivery";
      break;
    case "Delivered":
      classes = "bg-green-100 text-green-700 border-green-500";
      icon = FaCheckCircle;
      text = "Delivered";
      break;
    case "On Process":
    default:
      classes = "bg-yellow-100 text-yellow-700 border-yellow-500";
      icon = FaBoxOpen;
      text = "Processing";
      break;
  }
  return { classes, icon, text };
};

// Helper function to format the product list for display
const formatProductList = (products) => {
  if (!products || products.length === 0) return "N/A";
  const titles = products.map((p) => p.title).join(", ");
  return `${titles.substring(0, 70)}${titles.length > 70 ? "..." : ""}`;
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Load orders from localStorage and sort newest first
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(storedOrders.sort((a, b) => b.id - a.id));
  }, []);

  if (orders.length === 0) {
    return (
      <div className="p-6 text-center h-screen bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          📦 Order History
        </h1>
        <div className="py-10 bg-white rounded-lg shadow-md mt-6">
          <FaBoxOpen className="w-12 h-12 mx-auto text-indigo-500 mb-3" />
          <p className="text-lg text-gray-600">
            You haven't placed any orders yet.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Start Shopping Now!
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b-4 border-indigo-600/50 pb-2 inline-block">
        📦 My Order History
      </h1>

      <div className="space-y-6">
        {orders.map((order) => {
          const {
            classes,
            icon: StatusIcon,
            text: statusText,
          } = getStatusBadge(order.status);
          const date = new Date(order.id).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          return (
            <div
              key={order.id}
              className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-500 hover:shadow-2xl transition-all duration-300"
            >
              {/* Header: ID, Date, and Status */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-4">
                <div className="mb-2 sm:mb-0">
                  <p className="text-sm font-semibold text-gray-500 flex items-center gap-2 uppercase">
                    <FaRegCalendarAlt /> Order Placed
                  </p>
                  <p className="text-xl font-extrabold text-gray-800">
                    {date}
                    <span className="text-sm font-normal text-gray-600 ml-3">
                      ID: #{order.id.toString().slice(-6)}
                    </span>
                  </p>
                </div>

                {/* Status Badge */}
                <div
                  className={`px-4 py-1 rounded-full text-sm font-bold border ${classes} flex items-center gap-2 shrink-0`}
                >
                  <StatusIcon className="w-4 h-4" />
                  {statusText}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
                {/* Total Amount */}
                <div>
                  <p className="font-bold text-sm text-indigo-600 uppercase mb-1">
                    Total Paid
                  </p>
                  <p className="text-2xl font-extrabold text-gray-900">
                    ₹{order.totalAmount.toFixed(2)}
                  </p>
                </div>

                {/* Products Summary */}
                <div className="md:col-span-2">
                  <p className="font-bold text-sm text-gray-600 uppercase mb-1 flex items-center gap-1">
                    <FaTag /> Products Included
                  </p>
                  <p className="text-base text-gray-800 leading-snug">
                    {formatProductList(order.products)}
                  </p>
                </div>
              </div>

              {/* Footer: Address */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="font-bold text-sm text-gray-600 uppercase mb-1 flex items-center gap-1">
                  <FaMapMarkerAlt /> Shipping Address
                </p>
                <p className="text-sm text-gray-700">{order.address}</p>
              </div>

              {/* Action Button */}
              <div className="mt-4 flex justify-end">
                <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors">
                  View Details / Track Order
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
