const { createClient } = require("redis");

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const client = createClient({ url: redisUrl });

client.on("error", (err) => {
  // Silent error log
});

client.connect().catch((err) => {
  console.error("Redis Client Connection Error:", err.message);
});

const set = async (key, value, ttlInSeconds = 300) => {
  try {
    if (!client.isOpen) return;
    const stringValue = JSON.stringify(value);
    await client.set(key, stringValue, {
      EX: ttlInSeconds,
    });
  } catch (err) {
    // Error handler
  }
};

const get = async (key) => {
  try {
    if (!client.isOpen) return null;
    const data = await client.get(key);
    if (!data) return null;
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
};

const del = async (key) => {
  try {
    if (!client.isOpen) return;
    await client.del(key);
  } catch (err) {
    // Error handler
  }
};

const delByPrefix = async (prefix) => {
  try {
    if (!client.isOpen) return;
    const keys = await client.keys(`${prefix}*`);
    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch (err) {
    // Error handler
  }
};

const clear = async () => {
  try {
    if (!client.isOpen) return;
    await client.flushDb();
  } catch (err) {
    // Error handler
  }
};

module.exports = {
  set,
  get,
  del,
  delByPrefix,
  clear,
};
