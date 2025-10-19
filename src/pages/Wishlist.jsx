import { useEffect, useState } from "react";
// ------------------------------------------------------------------
import { Link } from "react-router-dom";

import {
  FaHeart,
  FaShoppingCart,
  FaTimes,
  FaRegSadCry,
  FaCheckCircle,
} from "react-icons/fa";
// ------------------------------------------------------------------

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  // --- Helper Function to manage localStorage ---
  const updateLocalStorage = (newWishlist) => {
    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
  };

  // --- Load wishlist from localStorage ---
  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
  }, []);

  // --- Action: Remove item from wishlist ---
  const removeFromWishlist = (id) => {
    const newWishlist = wishlist.filter((item) => item.id !== id);
    updateLocalStorage(newWishlist);
  };

  // --- Action: Move item to cart ---
  const moveToCart = (item) => {
    // 1. Get current cart from localStorage
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];

    // 2. Check if item is already in cart (optional: for simple cart logic)
    const isAlreadyInCart = currentCart.some(
      (cartItem) => cartItem.id === item.id
    );

    if (!isAlreadyInCart) {
      // 3. Add item to cart
      localStorage.setItem("cart", JSON.stringify([...currentCart, item]));
    }

    // 4. Remove item from wishlist
    removeFromWishlist(item.id);

    alert(`${item.title} moved to cart!`);
  };

  // --- Empty State UI ---
  if (wishlist.length === 0) {
    return (
      <div className="p-6 text-center max-w-xl mx-auto min-h-screen bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          <FaHeart className="inline text-red-500 mr-2" /> My Wishlist
        </h1>
        <div className="py-12 bg-white rounded-xl shadow-lg border border-gray-200">
          <FaRegSadCry className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-xl font-semibold text-gray-700">
            Your wishlist is empty.
          </p>
          <p className="text-gray-500 mt-2">
            Add items you love so you don't forget them!
          </p>
          <Link
            to="/"
            className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-full font-bold hover:bg-indigo-700 transition-colors shadow-md"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // --- Main Wishlist UI ---
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b-4 border-red-500/50 pb-2 inline-block">
        <FaHeart className="inline text-red-500 mr-2" /> My Wishlist (
        {wishlist.length} Items)
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => {
          const isOutOfStock = item.stock === 0;

          return (
            <div
              key={item.id}
              className={`bg-white p-4 rounded-xl shadow-lg border-l-4 ${
                isOutOfStock ? "border-gray-400" : "border-red-500"
              } flex flex-col transition-all duration-300 hover:shadow-xl`}
            >
              {/* Product Info */}
              <div className="flex items-center mb-3">
                {/* Image Placeholder */}
                <div className="w-16 h-16 bg-gray-100 rounded-lg mr-4 shrink-0 flex items-center justify-center">
                  <span className="text-xs text-gray-500">Image</span>
                </div>

                <div className="flex-grow">
                  <h2 className="font-semibold text-gray-800 line-clamp-2">
                    {item.title}
                  </h2>
                  <p className="text-lg font-extrabold text-indigo-600 mt-1">
                    ₹{item.price.toFixed(2)}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors p-2 ml-2 self-start"
                  aria-label="Remove from Wishlist"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              {/* Stock Status */}
              <div className="mb-4 pt-2 border-t border-gray-100">
                {isOutOfStock ? (
                  <span className="text-sm font-medium text-red-500 flex items-center gap-1">
                    <FaTimes /> Out of Stock
                  </span>
                ) : (
                  <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                    <FaCheckCircle /> In Stock
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => moveToCart(item)}
                disabled={isOutOfStock}
                className={`w-full py-2 rounded-full text-white font-bold transition-all duration-300 flex items-center justify-center gap-2 text-sm
                  ${
                    isOutOfStock
                      ? "bg-gray-400 cursor-not-allowed opacity-75"
                      : "bg-indigo-600 hover:bg-indigo-700 shadow-md"
                  }`}
              >
                <FaShoppingCart />{" "}
                {isOutOfStock ? "Cannot Add" : "Move to Cart"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
