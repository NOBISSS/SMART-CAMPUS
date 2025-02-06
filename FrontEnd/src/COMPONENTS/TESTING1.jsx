import React, { useState, useEffect } from "react";

export const TESTING1 = () => {
  const [message, setMessage] = useState("");

  // Fetch data when the component loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/v1/admin/getuser",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // Ensures cookies are sent/received
          }
        );

        const data = await response.json(); // Convert response to JSON
        console.log("API Response:", data);

        if (response.ok) {
          setMessage("Login successful! ✅");
          localStorage.setItem("token", data.token); // Store token if needed
        } else {
          setMessage(data.message || "Login failed! ❌");
        }
      } catch (error) {
        setMessage("Error: " + error.message);
      }
    };

    fetchData(); // Call the function
  }, []); // Runs only once when the component mounts

  return (
    <div>
      <p>{message}</p>
      <p>HELLO WORLD!!!</p>
    </div>
  );
};
