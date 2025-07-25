const Register = (req, res) => {
    const { username, name, phone} = req.body;
  
    // 1. Check for missing fields
    if (!username || !name || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
};
  
  module.exports = Register;
  