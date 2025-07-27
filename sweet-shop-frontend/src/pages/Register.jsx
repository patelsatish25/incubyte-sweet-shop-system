import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Loginn.css'; // Reuse Login styles

const Register = () => {
    const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user', // default role
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

      console.log(form)
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
    console.log(data)
    //   login(data.token); // auto-login after registration
      navigate('/Login');
    } catch (err) {
     
      setError(err.message);
      setTimeout(() => setError(""), 1000);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Create Account</h2>
        <p className="subtitle">Register to continue</p>
        {error && <div className="error-box">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {/* ✅ Role Dropdown */}
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit">Register</button>
        </form>

        <p className="register-link">
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
