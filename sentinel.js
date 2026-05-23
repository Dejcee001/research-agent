require("dotenv").config();
const axios = require("axios");

const SYNAPSE_KEY = process.env.SYNAPSE_API_KEY;

async function callSentinel() {
  console.log("=== CALLING SYNAPSE SENTINEL ===\n");
  
  const res = await axios.post(
    `https://synapse.oobeprotocol.ai/api/sentinel/query`,
    {
      agentAddress: "Ccr2yK3hLALU4p8oNRqrh4dGuvPJTth5KCLMio8cE1ph",
      query: "What AI research tools are available on SAP?",
      callerWallet: "EdtuoFqqjvCyhzh2EELqgXbb1RE3EZpbZKWQvjhD3JAa"
    },
    {
      headers: {
        "Authorization": `Bearer ${SYNAPSE_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );
  
  console.log("Sentinel response:");
  console.log(JSON.stringify(res.data, null, 2));
}

callSentinel().catch(console.error);
