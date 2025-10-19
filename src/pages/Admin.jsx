import { useEffect, useState } from "react";
// Using FaRegCalendarAlt for date icon, FaTruck for status icon
import {
  FaRegCalendarAlt,
  FaTruck,
  FaMapMarkerAlt,
  FaTag,
  FaCheckCircle,
  FaHourglassHalf,
  FaPlane,
} from "react-icons/fa";

// Helper function to determine badge color based on status
const getStatusClasses = (status) => {
  switch (status) {
    case "Shipped":
      return "bg-blue-100 text-blue-800 border-blue-500";
    case "Delivered":
      return "bg-green-100 text-green-800 border-green-500";
    case "On Process":
    default:
      return "bg-yellow-100 text-yellow-800 border-yellow-500";
  }
};

// Helper function to format the product list for display
const formatProductList = (products) => {
  if (!products || products.length === 0) return "N/A";
  // Assuming the products array contains objects with a 'title' property
  const titles = products.map((p) => p.title).join(", ");
  return `${titles.substring(0, 50)}${titles.length > 50 ? "..." : ""}`;
};

export default function Admin() {
  const [orders, setOrders] = useState([]);

  // Load orders from localStorage on mount
  useEffect(() => {
    // Assuming the order ID is a timestamp number (from Date.now())
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(storedOrders.sort((a, b) => b.id - a.id)); // Sort newest first
  }, []);

  // Update status function
  const updateStatus = (id, status) => {
    const updatedOrders = orders.map((o) =>
      o.id === id ? { ...o, status } : o
    );
    setOrders(updatedOrders.sort((a, b) => b.id - a.id));
    localStorage.setItem("orders", JSON.stringify(updatedOrders)); // persist
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b-4 border-indigo-600/50 pb-2 inline-block">
        Order Management Dashboard 📊
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-md mt-6">
          <FaCheckCircle className="w-12 h-12 mx-auto text-green-500 mb-3" />
          <p className="text-lg text-gray-600">
            No new orders to manage. Time for a coffee break! ☕
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusClasses = getStatusClasses(order.status);
            // Convert timestamp ID to readable date
            const date = new Date(order.id).toLocaleString();

            return (
              <div
                key={order.id}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b pb-4">
                  {/* Order ID and Date */}
                  <div className="mb-3 md:mb-0">
                    <p className="text-sm font-semibold text-gray-500 uppercase flex items-center gap-2">
                      <FaRegCalendarAlt /> ORDER DATE
                    </p>
                    <p className="text-xl font-extrabold text-gray-800">
                      #{order.id.toString().slice(-6)}
                      <span className="text-sm font-normal text-gray-600 ml-2">
                        ({date})
                      </span>
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div
                    className={`px-4 py-1 rounded-full text-sm font-bold border-2 ${statusClasses}`}
                  >
                    <FaTruck className="inline mr-2" />
                    {order.status}
                  </div>
                </div>

                {/* Order Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-700">
                  {/* Products */}
                  <div className="truncate">
                    <p className="font-semibold flex items-center gap-2 mb-1">
                      <FaTag className="text-indigo-500" /> Products
                    </p>
                    <p className="text-sm ml-5">
                      {formatProductList(order.products)}
                    </p>
                  </div>

                  {/* Address */}
                  <div className="truncate">
                    <p className="font-semibold flex items-center gap-2 mb-1">
                      <FaMapMarkerAlt className="text-indigo-500" /> Address
                    </p>
                    <p className="text-sm ml-5 truncate">{order.address}</p>
                  </div>

                  {/* Total */}
                  <div>
                    <p className="font-semibold flex items-center gap-2 mb-1">
                      <span className="text-2xl font-extrabold text-green-600">
                        ₹{order.totalAmount.toFixed(2)}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">Total Amount</p>
                  </div>
                </div>

                {/* Status Update Action */}
                <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
                  <label
                    htmlFor={`status-${order.id}`}
                    className="mr-3 font-medium text-gray-700 self-center hidden sm:block"
                  >
                    Update Status:
                  </label>
                  <select
                    id={`status-${order.id}`}
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="border-2 border-gray-300 p-2 rounded-lg font-semibold text-gray-800 bg-white focus:border-indigo-500 transition-colors"
                  >
                    <option value="On Process">⏳ On Process</option>
                    <option value="Shipped">✈️ Shipped</option>
                    <option value="Delivered">✅ Delivered</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
