require("dotenv").config();
const { createSapClient } = require("@oobe-protocol-labs/synapse-sap-sdk");
const { Keypair } = require("@solana/web3.js");
const bs58 = require("bs58");

async function main() {
  console.log("=== REGISTERING AGENT ON SAP MAINNET ===\n");

  const privateKey = process.env.WALLET_PRIVATE_KEY.trim();
  const rpcUrl = "https://us-1-mainnet.oobeprotocol.ai/rpc";

  let keypair;
  try {
    const decoded = bs58.default ? bs58.default.decode(privateKey) : bs58.decode(privateKey);
    keypair = Keypair.fromSecretKey(decoded);
  } catch (e) {
    keypair = Keypair.fromSecretKey(Buffer.from(privateKey, "hex"));
  }

  console.log("Wallet:", keypair.publicKey.toBase58());

  const client = createSapClient(rpcUrl, keypair);

  const result = await client.agent.registerAgent({
    name: "ResearchAgent",
    description: "Autonomous research agent using AceDataCloud SERP, summarization, and sentiment analysis",
    capabilities: [
      { id: "web-search", protocolId: "serp", version: "1.0", description: "Google SERP search" },
      { id: "summarization", protocolId: "openai", version: "1.0", description: "AI summarization" },
      { id: "sentiment", protocolId: "openai", version: "1.0", description: "Sentiment analysis" }
    ],
    pricing: [],
    protocols: ["A2A"],
  });

  console.log("Agent registered successfully!");
  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);
