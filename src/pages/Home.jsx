import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import ProductCard from "../components/ProductCard";
import LoaderSkeleton from "../components/LoaderSkeleton"; // loader component
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/products");
      return res.data;
    },
  });

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Load cart & wishlist from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setCart(storedCart);
    setWishlist(storedWishlist);
  }, []);

  // Update products with stock & category
  useEffect(() => {
    if (!productsData) return;
    const savedStock = JSON.parse(localStorage.getItem("productStock")) || {};
    const savedCategories =
      JSON.parse(localStorage.getItem("productCategories")) || {};

    const updatedProducts = productsData.map((p) => ({
      ...p,
      stock: savedStock[p.id] ?? Math.floor(Math.random() * 10),
      category: savedCategories[p.id] ?? p.category,
      rating: p.rating || {
        rate: Math.floor(Math.random() * 5) + 1,
        count: 10,
      },
    }));

    setProducts(updatedProducts);
  }, [productsData]);

  // Carousel auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      if (products && products.length > 0) {
        setCurrentSlide((prev) => (prev + 1) % Math.min(products.length, 5));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [products]);

  // Add to Cart
  const addToCart = (product) => {
    if (product.stock === 0) return alert("Out of Stock!");
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert("✅ Product added to Cart!");
  };

  // Add to Wishlist
  const addToWishlist = (product) => {
    if (product.stock === 0) return alert("Out of Stock!");
    const updatedWishlist = [...wishlist, product];
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    alert("💙 Product added to Wishlist!");
  };

  // Categories for filter
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  // Filtered products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ? true : product.category === selectedCategory;
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesStock = showInStockOnly ? product.stock > 0 : true;

    return matchesSearch && matchesCategory && matchesPrice && matchesStock;
  });

  // Carousel images (first 5 products)
  const carouselImages = products.slice(0, 5);

  if (isLoading) return <LoaderSkeleton count={8} />; // show loader

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
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 p-4 bg-white rounded-xl shadow-md flex-wrap">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-2 border-gray-200 p-3 rounded-full w-full sm:w-1/2 focus:border-indigo-500 transition-colors"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <span>
            Price: ₹{priceRange[0]} - ₹{priceRange[1]}
          </span>
          <input
            type="range"
            min={0}
            max={1000}
            step={50}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, Number(e.target.value)])}
            className="w-36"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showInStockOnly}
            onChange={(e) => setShowInStockOnly(e.target.checked)}
          />
          In Stock Only
        </label>
      </div>

      {/* Products Grid */}
      <h2 className="text-3xl font-extrabold mb-8 text-gray-800 border-b-4 border-indigo-500/50 pb-2 inline-block">
        ✨ Our Products
      </h2>

      {filteredProducts.length === 0 ? (
        <p className="text-xl text-gray-500 pt-4">
          😔 No products matched your filters.
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
