import axios from "axios";

const BASE_URL = "http://localhost:5000";

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
export const analyzeSkin = async (payload) => {
  const res = await axios.post(`${BASE_URL}/analyze`, payload);
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
