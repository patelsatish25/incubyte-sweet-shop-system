import React, { useState, useContext, useEffect } from "react";
import "./AdminPanel.css";
import { AuthContext } from '../context/AuthContext';

const AdminPanel = () => {
  const { token, user, logout } = useContext(AuthContext);
  const [editingSweetId, setEditingSweetId] = useState(null);
  const [editedSweet, setEditedSweet] = useState({});
  const [sweets, setSweets] = useState([]);
  const [form, setForm] = useState({ name: "", category: "", price: "", quantity: "" });
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function fetchSweets() {
    const t = sessionStorage.getItem('token');
    fetch("http://localhost:5000/api/sweets", {
      headers: {
        Authorization: t,
      },
    })
      .then((res) => res.json())
      .then((data) => { console.log(data); setSweets(data) })
      .catch((err) => console.error("Error fetching sweets:", err));
  }

  useEffect(() => {
    fetchSweets();
  }, []);

  const addSweet = async () => {
    if (!form.name || !form.category || !form.price || !form.quantity) {
      alert("All fields are required!");
      return;
    }

    const newSweet = {
      name: form.name,
      category: form.category,
      price: parseFloat(form.price),
      quantityInStock: parseInt(form.quantity, 10),
    };

    try {
      const t = sessionStorage.getItem('token');
      const response = await fetch("http://localhost:5000/api/sweets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: t,
          role: "admin",
        },
        body: JSON.stringify(newSweet),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to add sweet");
      fetchSweets();
      setForm({ name: "", category: "", price: "", quantity: "" });
    } catch (error) {
      alert(error.message);
    }
  };

  const editSweet = (id) => {
    const newName = prompt("Enter new name:");
    if (!newName) return;
    setSweets(sweets.map(s => s.id === id ? { ...s, name: newName } : s));
  };

  const deleteSweet = (id) => {
    if (window.confirm("Delete this sweet?")) {
      setSweets(sweets.filter(s => s.id !== id));
    }
  };

  const restockSweet = (id) => {
    const amount = parseInt(prompt("How many to add?"), 10);
    if (!amount || amount <= 0) return;
    setSweets(
      sweets.map((s) =>
        s.id === id ? { ...s, quantity: s.quantity + amount } : s
      )
    );
  };

  const filteredSweets = sweets.length > 0
    ? sweets.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const startEdit = (sweet) => {
    setEditingSweetId(sweet._id);
    setEditedSweet({ ...sweet });
  };

  const cancelEdit = () => {
    setEditingSweetId(null);
    setEditedSweet({});
  };

  const saveSweet = async () => {
    const t = sessionStorage.getItem('token');
    await fetch(`http://localhost:5000/api/sweets/${editingSweetId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: t,
        role: "admin",
      },
      body: JSON.stringify(editedSweet),
    });

    fetchSweets();
    cancelEdit();
  };

  const handleEditChange = (e) => {
    setEditedSweet({ ...editedSweet, [e.target.name]: e.target.value });
  };

  return (
    <div className="dashboard admin-panel">
      <div className="admin-topbar">
        <div className="admin-info">
          <strong>Admin:</strong> Satish (admin@example.com)
        </div>
        <button className="back-btn" onClick={() => window.location.href = "/"}>
          ⬅️ Back to Dashboard
        </button>
      </div>

      <h1>Admin Panel - Manage Sweets</h1>

      <form className="admin-form" onSubmit={(e) => { e.preventDefault(); addSweet(); }}>
        <input
          type="text"
          name="name"
          placeholder="Sweet Name *"
          value={form.name}
          onChange={handleChange}
          required
          className={!form.name ? "invalid" : ""}
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className={!form.category ? "invalid" : ""}
        >
          <option value="">Select Category *</option>
          <option value="Chocolate">Chocolate</option>
          <option value="Candy">Candy</option>
          <option value="Ladoo">Ladoo</option>
          <option value="Barfi">Barfi</option>
        </select>
        <input
          type="number"
          name="price"
          placeholder="Price *"
          value={form.price}
          onChange={handleChange}
          required
          className={!form.price ? "invalid" : ""}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity *"
          value={form.quantity}
          onChange={handleChange}
          required
          className={!form.quantity ? "invalid" : ""}
        />
        <button className="add-btn" type="submit">Add Sweet</button>
      </form>

      <div className="admin-search">
        <input
          type="text"
          placeholder="Search sweets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="sweet-grid">
        {filteredSweets.length > 0 &&
          filteredSweets.map((sweet, index) => {
            const isEditing = sweet._id === editingSweetId;
            return (
              <div key={sweet._id} className={`sweet-card ${isEditing ? "edit-mode" : ""}`}>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="name"
                      value={editedSweet.name}
                      onChange={handleEditChange}
                      placeholder="Sweet Name"
                    />
                    <input
                      type="text"
                      name="category"
                      value={editedSweet.category}
                      onChange={handleEditChange}
                      placeholder="Category"
                    />
                    <input
                      type="number"
                      name="price"
                      value={editedSweet.price}
                      onChange={handleEditChange}
                      placeholder="Price"
                    />
                    <input
                      type="number"
                      name="quantityInStock"
                      value={editedSweet.quantityInStock}
                      onChange={handleEditChange}
                      placeholder="Quantity"
                    />
                    <div className="edit-actions">
                      <button className="save-btn" onClick={saveSweet}>💾 Save</button>
                      <button className="cancel-btn" onClick={cancelEdit}>❌ Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`tag ${sweet.category.toLowerCase()}`}>{sweet.category}</div>
                    <h3>{sweet.name}</h3>
                    <p><strong>Price:</strong> ₹{sweet.price.toFixed(2)}</p>
                    <p className={`stock ${sweet.quantityInStock > 0 ? "in" : "out"}`}>
                      {sweet.quantityInStock > 0 ? `${sweet.quantityInStock} in stock` : "Out of stock"}
                    </p>
                    <div className="admin-actions">
                      <button className="edit-btn" onClick={() => startEdit(sweet)}>✏️ Edit</button>
                      <button className="delete-btn" onClick={() => deleteSweet(sweet._id)}>🗑️ Delete</button>
                      <button className="restock-btn" onClick={() => restockSweet(sweet._id)}>➕ Restock</button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default AdminPanel;
