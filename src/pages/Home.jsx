import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import ProductCard from "../components/ProductCard";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/products");
      // Add stock and random color for demo
      const colors = ["Red", "Blue", "Green", "Black", "White"];
      const ratings = [1, 2, 3, 4, 5];
      return res.data.map((p) => ({
        ...p,
        stock: Math.floor(Math.random() * 5),
        color: colors[Math.floor(Math.random() * colors.length)],
        rating: { rate: ratings[Math.floor(Math.random() * ratings.length)] },
      }));
    },
  });

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0); // 0 = all ratings
  const [selectedColor, setSelectedColor] = useState("All");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Load cart & wishlist from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setCart(storedCart);
    setWishlist(storedWishlist);
  }, []);

  // Carousel auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      if (products && products.length > 0) {
        setCurrentSlide((prev) => (prev + 1) % Math.min(products.length, 5));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [products]);

  const addToCart = (product) => {
    if (product.stock === 0) return alert("Out of Stock!");
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert("✅ Product added to Cart!");
  };

  const addToWishlist = (product) => {
    if (product.stock === 0) return alert("Out of Stock!");
    const updatedWishlist = [...wishlist, product];
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    alert("💙 Product added to Wishlist!");
  };

  if (isLoading) return <p className="p-6 text-center">Loading products...</p>;
  if (!products) return <p className="p-6 text-center">No products found.</p>;

  const carouselImages = products.slice(0, 5);
  const colorsList = ["All", ...new Set(products.map((p) => p.color))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStock = showInStockOnly ? product.stock > 0 : true;
    const matchesRating =
      selectedRating > 0
        ? Math.floor(product.rating.rate) === selectedRating
        : true;
    const matchesColor =
      selectedColor === "All" ? true : product.color === selectedColor;
    return matchesSearch && matchesStock && matchesRating && matchesColor;
  });

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Hero Carousel */}
      <div className="relative mb-12 h-72 md:h-128 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
        <AnimatePresence initial={false}>
          {carouselImages.map(
            (product, index) =>
              index === currentSlide && (
                <motion.div
                  key={product.id}
                  className="absolute top-0 left-0 w-full h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <img
                    src={product.image || "/placeholder.jpg"}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-8 text-white">
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-2 drop-shadow-lg">
                      {product.title}
                    </h1>
                    <p className="text-xl font-light mb-4">
                      Starting at ₹{product.price.toFixed(2)}
                    </p>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-full w-fit transition duration-300 shadow-lg">
                      Shop Now
                    </button>
                  </div>
                </motion.div>
              )
          )}
        </AnimatePresence>

        {/* Carousel Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white scale-125"
                  : "bg-gray-400 opacity-75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-6 p-4 bg-white rounded-xl shadow-md">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-2 border-gray-200 p-3 rounded-full w-full sm:w-1/2 focus:border-indigo-500 transition-colors"
        />

        <div className="flex gap-4 flex-wrap items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showInStockOnly}
              onChange={(e) => setShowInStockOnly(e.target.checked)}
            />
            In Stock Only
          </label>

          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(Number(e.target.value))}
            className="border p-2 rounded"
          >
            <option value={0}>All Ratings</option>
            <option value={1}>1 Star</option>
            <option value={2}>2 Stars</option>
            <option value={3}>3 Stars</option>
            <option value={4}>4 Stars</option>
            <option value={5}>5 Stars</option>
          </select>

          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="border p-2 rounded"
          >
            {colorsList.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <h2 className="text-3xl font-extrabold mb-8 text-gray-800 border-b-4 border-indigo-500/50 pb-2 inline-block">
        ✨ Our Featured Products
      </h2>

      {filteredProducts.length === 0 ? (
        <p className="text-xl text-gray-500 pt-4">
          😔 Sorry, no products matched your filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
              addToWishlist={addToWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}
