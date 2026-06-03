import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const predictSkin = async (data) => {
  const res = await axios.post(`${BASE_URL}/predict`, data);
  return res.data;
};

export const loginUser = async (email, password) => {
  const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
  return res.data;
};

export const registerUser = async (name, email, password) => {
  const res = await axios.post(`${BASE_URL}/auth/register`, {
    name,
    email,
    password,
  });
  return res.data;
};

export const forgotPassword = async (email) => {
  const res = await axios.post(`${BASE_URL}/auth/forgot-password`, { email });
  return res.data;
};

/**
 * Analisis kulit dari foto + detail
 * POST /analyze
 * Body: { image (base64), skinType, concerns[], additionalNotes }
 * Returns: { result: { summary, conditions[], recommendations[] } }
 */
export const analyzeSkin = async (payload, token) => {
  const res = await axios.post(`${BASE_URL}/analyze`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
export const getAnalysisStatus = async (jobId, token) => {
  const res = await axios.get(`${BASE_URL}/analyze/status/${jobId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};


/**
 * Chat konsultasi kulit dengan AI
 * POST /chat (wajib login)
 * Body: { messages }
 * Returns: { reply: string }
 */
export const chatWithAI = async (messages, token) => {
  const res = await axios.post(
    `${BASE_URL}/chat`,
    { messages },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data.data.reply;
};

/**
 * Cek sisa kuota analisis harian
 * GET /analyze/quota
 */
export const getAnalysisQuota = async (token) => {
  const res = await axios.get(`${BASE_URL}/analyze/quota`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data; // { used, limit, remaining }
};

/**
 * Cek sisa kuota chat harian
 * GET /chat/quota
 */
export const getChatQuota = async (token) => {
  const res = await axios.get(`${BASE_URL}/chat/quota`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data; // { used, limit, remaining }
};
