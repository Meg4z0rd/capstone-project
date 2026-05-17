const { success, error } = require("../utils/response");

// System prompt di-hardcode di backend
const SYSTEM_PROMPT = `Kamu adalah LumiSkin AI, konsultan kulit pribadi yang berpengetahuan luas, hangat, dan empatik. Kamu membantu pengguna memahami kondisi kulit mereka, merekomendasikan rutinitas perawatan, menjelaskan bahan aktif skincare, dan memberikan saran yang dipersonalisasi.

Pedoman penting:
- Selalu gunakan Bahasa Indonesia yang ramah dan mudah dipahami
- Berikan jawaban yang praktis dan dapat langsung diterapkan
- Jika ada kondisi kulit yang butuh penanganan medis serius, sarankan konsultasi ke dokter kulit
- Selalu sertakan disclaimer singkat bahwa ini bukan diagnosis medis
- Gunakan markdown ringan (bold, list) untuk keterbacaan
- Jawab dengan detail tapi tetap terstruktur — maksimal 3-4 paragraf atau list pendek
- Jika pengguna mengirim foto, analisis kondisi kulit yang terlihat secara visual
- Tolak dengan sopan jika ditanya hal di luar topik kesehatan kulit dan skincare`;

// Whitelist model
const ALLOWED_MODELS = ["llama-3.1-8b-instant", "llama-3.3-70b-versatile"];
const DEFAULT_MODEL = process.env.GROQ_DEFAULT_MODEL || "llama-3.1-8b-instant";

const chat = async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return error(res, "Messages tidak boleh kosong.", 400);
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    req.log.error("GROQ_API_KEY not configured");
    return error(res, "GROQ_API_KEY belum dikonfigurasi di .env", 500);
  }

  // Validasi & whitelist model
  const model = ALLOWED_MODELS.includes(req.body.model)
    ? req.body.model
    : DEFAULT_MODEL;

  try {
    // Filter role — hanya "user" dan "assistant"
    const safeMessages = messages.filter((m) =>
      ["user", "assistant"].includes(m.role),
    );

    if (safeMessages.length === 0) {
      return error(
        res,
        "Tidak ada pesan valid. Role harus 'user' atau 'assistant'.",
        400,
      );
    }

    // Format pesan (Groq/OpenAI format)
    let formattedMessages = safeMessages.map((m) => {
      if (Array.isArray(m.content)) {
        const formattedContent = m.content.map((part) => {
          if (part.type === "image") {
            const raw = part.source?.data ?? "";
            const base64Data = raw.includes(",")
              ? raw
              : `data:${part.source?.media_type ?? "image/jpeg"};base64,${raw}`;
            return {
              type: "image_url",
              image_url: { url: base64Data },
            };
          }
          return { type: "text", text: part.text ?? "" };
        });
        return { role: m.role, content: formattedContent };
      }
      return { role: m.role, content: String(m.content) };
    });

    // Masukkan System Prompt dari backend
    formattedMessages.unshift({ role: "system", content: SYSTEM_PROMPT });

    const requestBody = {
      model,
      messages: formattedMessages,
      max_tokens: parseInt(process.env.GROQ_MAX_TOKENS || "1024"),
      temperature: 0.7,
    };

    const groqUrl =
      process.env.GROQ_API_URL ||
      "https://api.groq.com/openai/v1/chat/completions";

    const response = await fetch(groqUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      req.log.error({ errData, model }, "Groq API error");
      return error(
        res,
        errData?.error?.message ?? "Gagal menghubungi Groq API.",
        502,
      );
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content ?? "";

    if (!reply) {
      req.log.warn({ model, data }, "Groq returned empty response");
      return error(res, "Respons dari Groq kosong.", 502);
    }

    req.log.info({ model, messageCount: messages.length }, "Chat completed");
    return success(res, { reply }, "Chat berhasil");
  } catch (err) {
    req.log.error({ err, model }, "Chat failed");
    return error(res, "Terjadi kesalahan server.", 500);
  }
};

module.exports = { chat };
