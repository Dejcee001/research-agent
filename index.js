require("dotenv").config();
const axios = require("axios");

const ACE_KEY = process.env.ACE_API_KEY;
const BASE = "https://api.acedata.cloud";
const MCP_URL = "https://serp.mcp.acedata.cloud/mcp";
const HEADERS = {
  "Authorization": `Bearer ${ACE_KEY}`,
  "Content-Type": "application/json",
  "Accept": "application/json"
};

const topics = [
  "artificial intelligence 2026",
  "blockchain technology trends",
  "climate change solutions",
  "quantum computing breakthroughs",
  "space exploration news"
];

async function serpSearch(query) {
  console.log(`[1] Searching: ${query}`);
  const res = await axios.post(MCP_URL, {
    jsonrpc: "2.0",
    id: Date.now(),
    method: "tools/call",
    params: {
      name: "serp_google_search",
      arguments: { query, number: 5, gl: "us", hl: "en" }
    }
  }, { headers: HEADERS });
  const content = res.data?.result?.content?.[0]?.text || "";
  console.log(`    Got ${content.length} chars`);
  return content;
}

async function chat(prompt) {
  const res = await axios.post(`${BASE}/openai/chat/completions`, {
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  }, { headers: { "Authorization": `Bearer ${ACE_KEY}`, "Content-Type": "application/json" } });
  return res.data.choices[0].message.content.trim();
}

async function summarize(text) {
  console.log(`[2] Summarizing...`);
  const summary = await chat(`Summarize this in 2 sentences: ${text}`);
  console.log(`    ${summary.slice(0, 100)}...`);
  return summary;
}

async function sentiment(text) {
  console.log(`[3] Sentiment...`);
  const result = await chat(`Reply with one word only - positive, negative, or neutral: ${text}`);
  console.log(`    ${result}`);
  return result;
}

async function runAgent() {
  console.log("=== AUTONOMOUS RESEARCH AGENT STARTED ===\n");

  for (const topic of topics) {
    try {
      console.log(`--- ${topic.toUpperCase()} ---`);
      const content = await serpSearch(topic);
      const summary = await summarize(content);
      await sentiment(summary);
      await new Promise(r => setTimeout(r, 1500));
    } catch (err) {
      const msg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      console.log(`    ERROR: ${msg}`);
    }
  }

  console.log("\n=== AGENT COMPLETED ===");
}

runAgent();
