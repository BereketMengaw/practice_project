export const removeToken = () => {
  localStorage.removeItem("token");
};
export const getToken = () => {
  return localStorage.getItem("token"); // Or use cookies for better security
};
