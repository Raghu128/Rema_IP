import axios from "axios";

// Example login function

export const loginUser = async ({ email, password }) => {
  
  const response = await fetch("/api/v1/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json(); // Get error details if available
    throw new Error(errorData.message || "Invalid credentials");
  }

  const data = await response.json(); // Response should include token and user info

  // Save the token to local storage or cookies (use HTTP-only cookies for better security)
  localStorage.setItem("authToken", data.token);

  return data.user; // Return user info for further use
};



export async function checkSession() {
  
  try {
    const response = await axios.get("/api/v1/user/check-session", {
      withCredentials: true, // Ensure cookies are sent with the request
    });
        
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data?.message || "Session validation failed");
  }
}

// utils/api.js
export async function signupUser({ name, email, password }) {
  try {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      throw new Error('Signup failed');
    }

    return await response.json(); // Assuming the API returns the user object
  } catch (error) {
    throw error;
  }
}
