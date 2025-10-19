# Jayam - React E-commerce & Admin Simulation

A **React.js** e-commerce project with **product management, cart, wishlist, user authentication (Google Login), and order management**. This project simulates an admin panel and complete user dashboard functionality.

---

## **🚀 Live Demo**

[https://manikandan0018.github.io/jayam/](https://manikandan0018.github.io/jayam/)

---

## **📦 Features**

### **Product Management**
- Fetch and display products dynamically from a fake REST API.
- Search and sort products by name, category, or price.
- Products with `stock = 0` are:
  - Disabled for adding to cart or wishlist.
  - Clearly marked as **Out of Stock**.

### **User Authentication & Dashboard**
- Google Login via **Firebase Authentication**.
- Navbar dynamically shows:
  - **Login** / **Logout**
  - **My Dashboard**
- Dashboard includes:
  - **Wishlist** (saved products)
  - **Cart** (added products)
  - **Order History** (confirmed orders with status updates)

### **Cart & Checkout**
- Select one of multiple saved shipping addresses.
- Confirm order (payment gateway not implemented, simulation only).
- Admin simulation allows updating **Order Status**:
  - Default: `On Process`
  - Editable: `Shipped`, `Delivered`
- Users can track updated status in **Order History**.

### **UI/UX**
- Responsive design for desktop and mobile.
- Clear visual feedback for out-of-stock products.
- Smooth navigation and dashboard animations.

---

## **⚡ Tech Stack**
- **Frontend:** React.js, Tailwind CSS
- **State & Data Fetching:** React Query / Context API
- **Routing:** React Router DOM
- **Authentication:** Firebase Google OAuth
- **API:** Fake REST API (`json-server` or `fakestoreapi.com`)

---

## **💻 Setup & Installation**

1. **Clone the repository**
```bash
git clone https://github.com/manikandan0018/jayam.git
cd jayam
