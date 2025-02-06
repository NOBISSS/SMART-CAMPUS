import { useState } from 'react';

function TEST() {
  // Step 2: Create state variables to store user input
  const [input, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Step 3: Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    // Step 4: Send API request
    try {
      const response = await fetch('http://localhost:8000/api/v1/student/login', {
        method: 'POST',
        headers: {  
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input, password }), // Send email & password as JSON
      });
      console.log(response)
      const data = await response.json(); // Convert response to JSON

      if (response.ok) {
        setMessage('Login successful! ✅');
        localStorage.setItem('token', data.token); // Step 5: Store token if needed
      } else {
        setMessage(data.message || 'Login failed! ❌');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="text"
            name='input'
            value={input}
            onChange={(e) => setEmail(e.target.value)} // Update state
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            name='password'
            onChange={(e) => setPassword(e.target.value)} // Update 
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>

      {message && <p>{message}</p>} {/* Show success or error message */}
    </div>
  );
}

export default TEST;
