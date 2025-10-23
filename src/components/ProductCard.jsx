import { motion } from "framer-motion";

export default function ProductCard({ product, addToCart, addToWishlist }) {
  const isOutOfStock = product.stock === 0;

  // Function to render stars based on rating.rate
  const renderStars = (rate) => {
    const stars = [];
    const fullStars = Math.floor(rate);
    const halfStar = rate % 1 >= 0.5;
    for (let i = 0; i < fullStars; i++) stars.push("★");
    if (halfStar) stars.push("☆");
    while (stars.length < 5) stars.push("☆");
    return stars.join(" ");
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="rounded-xl p-4 flex flex-col justify-between shadow-lg hover:shadow-2xl 
                 bg-white transition-all duration-300 relative overflow-hidden group"
    >
      {/* Stock Badge */}
      <div
        className={`absolute top-0 right-0 py-1 px-3 rounded-tr-xl rounded-bl-xl 
                      text-xs font-bold text-white uppercase tracking-wider
                      ${isOutOfStock ? "bg-red-500" : "bg-green-500"}`}
      >
        {isOutOfStock ? "Sold Out" : "In Stock"}
      </div>

      <img
        src={product.image}
        alt={product.title}
        className="h-40 object-contain mx-auto my-3 group-hover:scale-105 transition-transform duration-300"
      />

      <div className="flex flex-col flex-grow">
        <h2 className="font-semibold text-base text-gray-800 mb-1 leading-snug line-clamp-2">
          {product.title}
        </h2>

        {/* Rating */}
        <p className="text-yellow-500 font-semibold mb-1">
          {renderStars(product.rating.rate)}{" "}
          <span className="text-gray-500 font-normal text-sm">
            ({product.rating.count})
          </span>
        </p>

        {/* Price */}
        <p className="text-xl font-extrabold text-indigo-600 mb-1 mt-1">
          ₹{product.price}
        </p>

        {/* Stock count */}
        <p className="text-sm text-gray-500 mb-2">
          {isOutOfStock
            ? "Out of Stock"
            : `${product.stock} item${product.stock > 1 ? "s" : ""} available`}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 mt-auto">
        <button
          disabled={isOutOfStock}
          onClick={() => addToWishlist(product)}
          className={`p-3 rounded-full border-2 border-gray-200 hover:border-red-500 
                      text-gray-500 hover:text-red-500 transition-colors shrink-0
                      ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          ❤️
        </button>

        <button
          disabled={isOutOfStock}
          onClick={() => addToCart(product)}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full 
                      font-bold text-white transition-all duration-300 ease-in-out
                      ${
                        isOutOfStock
                          ? "bg-gray-400 cursor-not-allowed opacity-70"
                          : "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg"
                      }`}
        >
          {isOutOfStock ? "Unavailable" : "🛒Add to Cart"}
        </button>
      </div>
    </motion.div>
  );
}
