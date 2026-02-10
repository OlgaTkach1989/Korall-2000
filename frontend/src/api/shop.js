import client from "./client";

export const fetchProducts = async () => {
  const { data } = await client.get("products/");
  return data;
};

export const fetchProduct = async (slug) => {
  const { data } = await client.get(`products/${slug}/`);
  return data;
};

export const createOrder = async (payload) => {
  const { data } = await client.post("orders/", payload);
  return data;
};

export const fetchOrders = async () => {
  const { data } = await client.get("orders/");
  return data;
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await client.post(`orders/${id}/update_status/`, {
    status,
  });
  return data;
};

export const deleteOrder = async (id) => {
  const { data } = await client.delete(`orders/${id}/`);
  return data;
};

export const login = async (payload) => {
  const { data } = await client.post("auth/login/", payload);
  return data;
};

export const register = async (payload) => {
  const { data } = await client.post("auth/register/", payload);
  return data;
};

export const fetchDashboardSummary = async () => {
  const { data } = await client.get("dashboard/summary/");
  return data;
};

export const fetchHomepageFeatures = async () => {
  const { data } = await client.get("homepage/features/");
  return data;
};

export const sendChatbotMessage = async (payload) => {
  const { data } = await client.post("chatbot/", payload);
  return data;
};
