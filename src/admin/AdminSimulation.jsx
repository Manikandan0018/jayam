import { useState } from "react";

export default function AdminSimulation() {
  const [orders, setOrders] = useState([
    { id: 1, products: ["Product 1", "Product 2"], status: "On Process" },
    { id: 2, products: ["Product 3"], status: "Shipped" },
  ]);

  const updateStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="font-bold text-xl mb-2">
        Admin Simulation: Update Order Status
      </h2>
      {orders.map((order) => (
        <div
          key={order.id}
          className="border p-3 rounded flex justify-between items-center"
        >
          <div>
            <p>
              <strong>Order ID:</strong> {order.id}
            </p>
            <p>
              <strong>Products:</strong> {order.products.join(", ")}
            </p>
          </div>
          <select
            value={order.status}
            onChange={(e) => updateStatus(order.id, e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="On Process">On Process</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      ))}
    </div>
  );
}
