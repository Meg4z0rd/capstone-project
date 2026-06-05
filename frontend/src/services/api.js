import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const predictSkin = async (data) => {
  const res = await api.post("/predict", data);
  return res.data;
};

export const loginUser = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const registerUser = async (name, email, password) => {
  const res = await api.post("/auth/register", {
    name,
    email,
    password,
  });
  return res.data;
};

export const forgotPassword = async (email) => {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data;
};

export const analyzeSkin = async (payload, token) => {
  const res = await api.post("/analyze", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getAnalysisStatus = async (jobId, token) => {
  const res = await api.get(`/analyze/status/${jobId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const chatWithAI = async (messages, token) => {
  const res = await api.post(
    "/chat",
    { messages },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data.data.reply;
};

export const getAnalysisQuota = async (token) => {
  const res = await api.get("/analyze/quota", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

export const getChatQuota = async (token) => {
  const res = await api.get("/chat/quota", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};
