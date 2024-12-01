// api.js - For managing requests
export const signUp = async (phoneNumber, password) => {
  const res = await fetch("http://localhost:5000/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phoneNumber, password }),
  });

  return res.json();
};

export const signIn = async (phoneNumber, password) => {
  const res = await fetch("http://localhost:5000/api/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phoneNumber, password }),
  });

  return res.json();
};
