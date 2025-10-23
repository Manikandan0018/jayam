import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import { useState, useEffect } from "react";
import { FaBoxOpen, FaClipboardList } from "react-icons/fa";

export default function Admin() {
  const [productStock, setProductStock] = useState({});
  const [productCategories, setProductCategories] = useState({});
  const [orders, setOrders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewOrders, setViewOrders] = useState(false);

  // Fetch products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/products");
      const savedStock = JSON.parse(localStorage.getItem("productStock")) || {};
      const savedCategories =
        JSON.parse(localStorage.getItem("productCategories")) || {};
      return res.data.map((p) => ({
        ...p,
        stock: savedStock[p.id] ?? 5,
        category: savedCategories[p.id] ?? p.category,
      }));
    },
  });

  useEffect(() => {
    setProductStock(JSON.parse(localStorage.getItem("productStock")) || {});
    setProductCategories(
      JSON.parse(localStorage.getItem("productCategories")) || {}
    );
    setOrders(JSON.parse(localStorage.getItem("orders")) || []);
  }, []);

  const handleStockChange = (productId, value) => {
    const updatedStock = { ...productStock, [productId]: Number(value) };
    setProductStock(updatedStock);
    localStorage.setItem("productStock", JSON.stringify(updatedStock));
  };

  const handleCategoryChange = (productId, value) => {
    const updatedCategories = { ...productCategories, [productId]: value };
    setProductCategories(updatedCategories);
    localStorage.setItem(
      "productCategories",
      JSON.stringify(updatedCategories)
    );
  };

  const handleOrderStatusChange = (orderId, status) => {
    const updatedOrders = orders.map((o) =>
      o.id === orderId ? { ...o, status } : o
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  if (isLoading) return <p className="p-6 text-center">Loading products...</p>;

  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const filteredProducts = products.filter((p) => {
    const currentCategory = productCategories[p.id] ?? p.category;
    return selectedCategory === "All" || currentCategory === selectedCategory;
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* LEFT SIDEBAR */}
      <div className="w-full md:w-64 bg-white shadow-lg p-6 flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-4 text-indigo-600">Admin Panel</h2>

        <button
          className={`flex items-center gap-2 p-3 rounded-lg w-full font-semibold transition ${
            !viewOrders
              ? "bg-indigo-600 text-white"
              : "text-gray-700 hover:bg-indigo-100"
          }`}
          onClick={() => setViewOrders(false)}
        >
          <FaBoxOpen /> Manage Products
        </button>

        <button
          className={`flex items-center gap-2 p-3 rounded-lg w-full font-semibold transition ${
            viewOrders
              ? "bg-indigo-600 text-white"
              : "text-gray-700 hover:bg-indigo-100"
          }`}
          onClick={() => setViewOrders(true)}
        >
          <FaClipboardList /> Manage Orders
        </button>

        {!viewOrders && (
          <div className="mt-6">
            <label className="font-semibold">Filter by Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border p-2 rounded w-full mt-2"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* MAIN PANEL */}
      <div className="flex-1 p-6 md:p-8 overflow-auto">
        {!viewOrders ? (
          <>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">
              Products Management
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded-xl shadow-md flex flex-col"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-40 object-contain mb-4"
                  />
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                    {product.title}
                  </h3>

                  <div className="mb-2">
                    <label className="font-semibold mr-2">Category:</label>
                    <select
                      value={productCategories[product.id] ?? product.category}
                      onChange={(e) =>
                        handleCategoryChange(product.id, e.target.value)
                      }
                      className="border p-1 rounded w-full"
                    >
                      {categories
                        .filter((c) => c !== "All")
                        .map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 mt-auto">
                    <label className="font-semibold">Stock:</label>
                    <input
                      type="number"
                      min="0"
                      value={productStock[product.id] ?? product.stock}
                      onChange={(e) =>
                        handleStockChange(product.id, e.target.value)
                      }
                      className="border p-1 rounded w-16"
                    />
                  </div>

                  {productStock[product.id] === 0 && (
                    <span className="mt-2 text-red-500 font-semibold">
                      Out of Stock
                    </span>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-6 border-b pb-2">
              Orders Management
            </h2>

            {orders.length === 0 ? (
              <p>No orders yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white p-5 rounded-xl shadow-md flex flex-col justify-between border border-gray-200 hover:shadow-lg transition"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-lg text-indigo-600">
                          Order #{order.id}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {order.user || "Guest"}
                        </span>
                      </div>

                      <div className="border-t pt-2 mt-2">
                        <h4 className="font-semibold mb-2 text-gray-700">
                          Products:
                        </h4>
                        <div className="space-y-2">
                          {order.products.map((p) => (
                            <div
                              key={p.id}
                              className="flex items-center gap-3 bg-gray-50 rounded-lg p-2"
                            >
                              <img
                                src={p.image}
                                alt={p.title}
                                className="w-14 h-14 object-contain border rounded-md"
                              />
                              <div className="flex flex-col items-start">
                                <span className="font-semibold text-gray-800 line-clamp-1">
                                  {p.title}
                                </span>
                                <span className="text-sm text-gray-500">
                                  Qty: {p.quantity || 1}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3">
                        <label className="font-semibold text-gray-700 mr-2">
                          Status:
                        </label>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleOrderStatusChange(order.id, e.target.value)
                          }
                          className="border p-1 rounded text-sm"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Out for Delivery">
                            Out for Delivery
                          </option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>

                      <div className="mt-3">
                        <h4 className="font-semibold text-gray-700">
                          Address:
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {order.address || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
