import React, { useState } from 'react';

const Rough = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: "POST",
        body: JSON.stringify({ email }), // Only send email field
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert("Data saved successfully");
        setEmail("");
      } else {
        throw new Error('Failed to save data');
      }
    } catch (error) {
      console.error('Error:', error.message);
      alert("Something went wrong");
    }
  }

  return (  
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Leave us your email"
          />
        </div>
        <button type="submit">Subscribe me</button>
      </form>
    </div>
  );
}
 
export default Rough;
