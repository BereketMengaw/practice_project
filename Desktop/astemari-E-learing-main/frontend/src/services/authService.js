export const loginUser = async (gmail, password) => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: gmail, password }),
    });

    if (!response.ok) {
      throw new Error("Failed to login");
    }

    return response.json(); // Return token or user data
  } catch (error) {
    throw error;
  }
};
