import React, { useEffect, useState, useContext } from "react";
import "./Dashboard.css";
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {

  const [successMsg, setSuccessMsg] = useState("");

  const [purchaseId, setPurchaseId] = useState(null); // currently selected sweet
const [purchaseQty, setPurchaseQty] = useState(""); // quantity entered

  const { token, user, logout } = useContext(AuthContext);
  const [sweets, setSweets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  const [users, setUser] = useState({ name: "", email: "" });
  const navigate = useNavigate();

  useEffect(() => {
  
    const queryParams = new URLSearchParams({
      name: searchTerm,
      category: categoryFilter,
      minPrice,
      maxPrice,
    });
    console.log(queryParams.toString());
    const t = sessionStorage.getItem("token");
    fetch(`http://localhost:5000/api/sweets/search?${queryParams.toString()}`, {
      headers: {
        Authorization: t,
      },
    })
      .then((res) => res.json())
      .then((data) => setSweets(data))
      .catch((err) => console.error("Error fetching sweets:", err));
  }, [searchTerm, categoryFilter, minPrice, maxPrice]); // re-run on filter change
  





  useEffect(() => {
   
    fetchSweets();
    // // Simulate fetching user data
    console.log(token)
    const t = sessionStorage.getItem("token");
    fetch("http://localhost:5000/api/auth/user", {
      headers: {
        Authorization: t,
      },
    })
      .then((res) => res.json())
      .then((data) => { console.log(data); setUser(data) })
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  const fetchSweets=()=>
  {
     // // Replace with your backend API endpoint
     const t = sessionStorage.getItem("token");
     fetch("http://localhost:5000/api/sweets", {
       headers: {
         Authorization: t,
       },
     })
       .then((res) => res.json())
       .then((data) => { console.log(data); setSweets(data) })
       .catch((err) => console.error("Error fetching sweets:", err));
  }

  
  
  const handlePurchase = async (id, purchaseQty) => {
    console.log(id,purchaseQty)
     try {
      const t = sessionStorage.getItem("token");
      console.log(t)
  
      const response = await fetch(`http://localhost:5000/api/sweets/${id}/purchase`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: t,
        },
        body: JSON.stringify({ quantity: purchaseQty }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to purchase sweet.");
      }
  
     
      setSuccessMsg("🎉 weet purchased successfully ! Your sweet will be delivered in soon.");
setTimeout(() => setSuccessMsg(""), 4000); // Hide after 5 sec

      fetchSweets();        // Refresh the sweets list
      setPurchaseId(null);  // Close purchase mode
      setPurchaseQty(1);    // Reset qty
   } catch (error) {
      console.error("Purchase error:", error.message);
      alert(error.message);
     }
  };
  
  

  return (
    <div className="dashboard">
      <header>
        <h1>Delicious Sweets Collection</h1>
        <div className="header-controls">
          <input
            type="text"
            placeholder="Search sweets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="user-profile">
            <div className="user-greeting">Hello, {users.name}</div>
            <div className="dropdown">
              <button className="profile-button">⚙️</button>
              <div className="dropdown-content">
                <div><strong>Name:</strong> {users.name}</div>
                <div><strong>Email:</strong> {users.email}</div>
               
                <button className="logout-btn" onClick={()=>navigate("/")} >Logout</button>
                {sessionStorage.getItem("role") == "admin" && <button onClick={() => navigate("/admindashboard")}>
                  🛠️ Go to Admin Panel
                </button>}



              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="filters">
        <div className="categories">
          {["All", "Chocolate", "Candy", "Barfi","Ladoo"].map((cat) => (
            <button
              key={cat}
              className={categoryFilter === cat ? "active" : ""}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="price-range">
          <label>Price Range:</label>
          <input
            type="range"
            min="100"
            max="500"
            step="100"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
          />
          <span>Min: ${minPrice}</span>
          <input
            type="range"
            min="500"
            max="1000"
            step="100"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
          <span>Max: ${maxPrice}</span>
        </div>
      </div>

      {successMsg && (
  <div className="success-toast">
    {successMsg}
  </div>
)}

      <div className="sweet-grid">

      {sweets.length > 0 ? (
  sweets.map((sweet) => (
    <div key={sweet._id} className="sweet-card-modern">
      <div className="sweet-header">
        <span className={`sweet-icon ${sweet.category.toLowerCase()}`}>
          {sweet.category === "Chocolate" && "🍫"}
          {sweet.category === "Candy" && "🍬"}
          {sweet.category === "Ladoo" && "🍡"}
          {sweet.category === "Barfi" && "🍥"}
        </span>
        <span className={`category-tag ${sweet.category.toLowerCase()}`}>
          {sweet.category}
        </span>
      </div>

      <h3>{sweet.name}</h3>
      <p className="description">
        {sweet.description || "No description available."}
      </p>

      <div className="info-section">
        <span className="price">₹{sweet.price.toFixed(2)}</span>
        <span
          className={`stock-badge ${sweet.quantityInStock > 0 ? "in" : "out"}`}
        >
          {sweet.quantityInStock > 0
            ? `${sweet.quantityInStock} in stock`
            : "Out of stock"}
        </span>
      </div>


      {purchaseId === sweet._id ? (
            <div className="purchase-cart">
              <div className="qty-selector">
                <label htmlFor={`qty-${sweet._id}`}>Qty:</label>
                <button
                  type="button"
                  onClick={() => setPurchaseQty((prev) => Math.max(1, prev - 1))}
                  disabled={purchaseQty <= 1}
                >
                  ➖
                </button>
                <span className="qty-display">{purchaseQty}</span>
                <button
                  type="button"
                  onClick={() => setPurchaseQty((prev) => Math.min(sweet.quantityInStock, prev + 1))}
                  disabled={purchaseQty >= sweet.quantityInStock}
                >
                  ➕
                </button>
              </div>
              <div className="purchase-actions">
                <button onClick={() => handlePurchase(sweet._id, purchaseQty)} className="confirm-btn">✅ Confirm</button>
                <button onClick={() => setPurchaseId(null)} className="cancel-btn">❌ Cancel</button>
              </div>
            </div>
          ) : (
            <button
              disabled={sweet.quantityInStock === 0}
              onClick={() => {
                setPurchaseId(sweet._id);
                setPurchaseQty(1);
              }}
            >
              Purchase
            </button>
          )}




    </div>
  ))
) : (
  <div className="empty-state">
    <h3>😔 No sweets found</h3>
    <p>Try adjusting your search or filters.</p>
  </div>
)}


      </div>
    </div>
  );
};

export default Dashboard;
