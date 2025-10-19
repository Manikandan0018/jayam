import { useEffect, useState } from "react";
// Using React Icons for a modern look
import {
  FaMapMarkerAlt,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  const addresses = [
    {
      id: 1,
      label: "🏠 Home Address",
      details: "123 Main Street, Ariyalur, Tamil Nadu",
    },
    {
      id: 2,
      label: "🏢 Office Address",
      details: "Tech Park, Trichy Road, Tamil Nadu",
    },
  ];

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    // Auto-select all items on load, which is a common pattern for carts
    if (storedCart.length > 0) {
      setSelectedItems(storedCart.map((item) => item.id));
    }
  }, []);

  // Select/unselect one product
  const toggleSelect = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Select/unselect all
  const toggleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map((item) => item.id));
    }
  };

  // Calculate total of selected products
  const totalAmount = cart
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.price, 0);

  // Find the currently selected address details
  const currentAddressDetails = addresses.find(
    (addr) => addr.details === selectedAddress
  );

  const handleConfirmOrder = () => {
    if (!selectedAddress) return alert("Please select an address first.");
    if (selectedItems.length === 0)
      return alert("Please select at least one product.");

    const selectedProducts = cart.filter((item) =>
      selectedItems.includes(item.id)
    );

    const remainingProducts = cart.filter(
      (item) => !selectedItems.includes(item.id)
    );

    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];

    const newOrder = {
      id: Date.now(),
      products: selectedProducts,
      totalAmount: selectedProducts.reduce((sum, item) => sum + item.price, 0),
      address: selectedAddress,
      status: "On Process",
    };

    // Save orders
    localStorage.setItem(
      "orders",
      JSON.stringify([...existingOrders, newOrder])
    );

    // Update cart with remaining items
    setCart(remainingProducts);
    localStorage.setItem("cart", JSON.stringify(remainingProducts));
    setSelectedItems([]);
    setSelectedAddress("");

    alert("✅ Order confirmed!");
  };

  if (cart.length === 0) {
    return (
      <div className="p-6 text-center h-screen bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Your Cart is Empty! 😔
        </h1>
        <p className="text-gray-600">
          Time to fill it up with some amazing products.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-colors"
        >
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-2">
        🛒 Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* === LEFT COLUMN: CART ITEMS LIST === */}
        <div className="lg:col-span-2 space-y-4">
          {/* Select All */}
          <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-indigo-200">
            <input
              type="checkbox"
              checked={selectedItems.length === cart.length && cart.length > 0}
              onChange={toggleSelectAll}
              className="mr-3 w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label className="text-lg font-bold text-indigo-600">
              Select All ({selectedItems.length}/{cart.length} items)
            </label>
          </div>

          {/* Cart Item Cards */}
          {cart.map((item) => (
            <div
              key={item.id}
              className={`flex items-center p-4 bg-white rounded-xl shadow-md transition-all duration-300 ${
                selectedItems.includes(item.id)
                  ? "border-2 border-indigo-400"
                  : "border border-gray-200"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => toggleSelect(item.id)}
                className="mr-4 w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 shrink-0"
              />

              {/* Product Image Placeholder (Using item.image if available) */}
              <div className="w-20 h-20 mr-4 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                {/* <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-lg" /> */}
                <span className="text-xs text-gray-500">Image</span>
              </div>

              {/* Product Details */}
              <div className="flex-grow">
                <p className="font-semibold text-gray-800 line-clamp-1">
                  {item.title}
                </p>
                {/* Assuming quantity is 1 for simplicity, add controls here for a full UI */}
                <p className="text-sm text-gray-500">Qty: 1</p>
              </div>

              {/* Price */}
              <span className="font-bold text-lg text-indigo-600 ml-4 shrink-0">
                ₹{item.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* === RIGHT COLUMN: ORDER SUMMARY & ADDRESS === */}
        <div className="lg:col-span-1 space-y-6">
          {/* 1. Address Selection Panel */}
          <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
              <FaMapMarkerAlt className="text-indigo-600" />
              Select Delivery Address
            </h2>

            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`block p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedAddress === addr.details
                      ? "border-2 border-indigo-600 bg-indigo-50 shadow-md"
                      : "border border-gray-300 hover:border-indigo-400 bg-white"
                  }`}
                  onClick={() => setSelectedAddress(addr.details)}
                >
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="address"
                        value={addr.details}
                        checked={selectedAddress === addr.details}
                        onChange={() => setSelectedAddress(addr.details)}
                        className="mr-3 w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500"
                      />
                      <div className="block">
                        <span className="font-semibold text-gray-800">
                          {addr.label}
                        </span>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {addr.details}
                        </p>
                      </div>
                    </div>
                    {selectedAddress === addr.details && (
                      <FaCheckCircle className="text-indigo-600 w-5 h-5 shrink-0" />
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Order Summary Panel */}
          <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100 sticky top-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
              Order Summary
            </h2>

            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Items Selected:</span>
                <span className="font-medium">{selectedItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total (Pre-Tax):</span>
                <span>₹{(totalAmount * 0.9).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee:</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              <div className="flex justify-between font-extrabold text-2xl pt-3 border-t-2 border-gray-200 mt-2">
                <span>Grand Total:</span>
                <span className="text-indigo-600">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleConfirmOrder}
              disabled={!selectedAddress || selectedItems.length === 0}
              className={`w-full mt-6 py-3 rounded-full text-white font-bold transition-all duration-300 flex items-center justify-center gap-2
                ${
                  selectedAddress && selectedItems.length > 0
                    ? "bg-indigo-600 hover:bg-indigo-700 shadow-lg"
                    : "bg-gray-400 cursor-not-allowed opacity-75"
                }`}
            >
              {selectedAddress && selectedItems.length > 0 ? (
                <>
                  <FaCheckCircle /> Confirm Order
                </>
              ) : (
                <>
                  <FaExclamationCircle /> Complete Selection
                </>
              )}
            </button>

            {/* Display selected address for confirmation */}
            {currentAddressDetails && (
              <p className="text-xs text-center text-gray-500 mt-3">
                Shipping to: **{currentAddressDetails.label.split(" ")[1]}** (
                {currentAddressDetails.details.split(",")[0].trim()})
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
