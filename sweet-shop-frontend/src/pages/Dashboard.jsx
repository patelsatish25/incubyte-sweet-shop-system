import React, { useEffect, useState, useContext } from "react";
import "./Dashboard.css";
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const { token, user, logout } = useContext(AuthContext);
  const [sweets, setSweets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10);
  const [users, setUser] = useState({ name: "", email: "" });
  const navigate = useNavigate();
  useEffect(() => {
    // // Replace with your backend API endpoint
    fetch("http://localhost:5000/api/sweets", {
      headers: {
        Authorization: token.token,
      },
    })
      .then((res) => res.json())
      .then((data) => { console.log(data); setSweets(data) })
      .catch((err) => console.error("Error fetching sweets:", err));

    // // Simulate fetching user data
    console.log(token)
    fetch("http://localhost:5000/api/auth/user", {
      headers: {
        Authorization: token.token,
      },
    })
      .then((res) => res.json())
      .then((data) => { console.log(data); setUser(data) })
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  const filteredSweets = sweets.filter((sweet) => {
    const matchesSearch = sweet.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || sweet.category === categoryFilter;
    const matchesPrice = sweet.price >= minPrice && sweet.price <= maxPrice;
    return matchesSearch && matchesCategory && matchesPrice;
  });

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
                <button className="settings-btn">Edit Profile</button>
                <button className="logout-btn" onClick={() => alert("Logged out!")}>Logout</button>
                {token.role == "admin" && <button onClick={() => navigate("/admindashboard")}>
                  🛠️ Go to Admin Panel
                </button>}



              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="filters">
        <div className="categories">
          {["All", "Chocolate", "Candy", "Pastry"].map((cat) => (
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
            min="0"
            max="10"
            step="0.5"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
          />
          <span>Min: ${minPrice}</span>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
          <span>Max: ${maxPrice}</span>
        </div>
      </div>

      <div className="sweet-grid">

        {filteredSweets.length > 0 ? (
          filteredSweets.map((sweet) => (
            <div key={sweet._id} className="sweet-card">
              <div className={`tag ${sweet.category.toLowerCase()}`}>{sweet.category}</div>
              <h3>{sweet.name}</h3>
              <p>{sweet.description}</p>
              <p className="price">₹{sweet.price.toFixed(2)}</p>
              <p className={`stock ${sweet.quantityInStock > 0 ? "in" : "out"}`}>
                {sweet.quantityInStock > 0
                  ? `${sweet.quantityInStock} in stock`
                  : "Out of stock"}
              </p>
              <button disabled={sweet.quantityInStock === 0}>Purchase</button>
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
