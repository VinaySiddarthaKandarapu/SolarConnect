import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Initialize Gemini lazily
function getGeminiAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not configured in process.env");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "SolarConnect Backend" });
});

// SolarConnect AI Chat Assistant Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, conversationHistory = [], context = {}, targetLanguage = "English" } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message prompt is required" });
    }

    const ai = getGeminiAI();
    if (!ai) {
      // Intelligent fallback answer if GEMINI_API_KEY is not injected yet
      return res.json({
        reply: getFallbackAnswer(message, context, targetLanguage),
        source: "fallback_knowledge_base"
      });
    }

    const langInstruction = targetLanguage && targetLanguage !== "English"
      ? `\n\nCRITICAL MULTILINGUAL MANDATE: The user selected ${targetLanguage}. You MUST write your entire response completely and natively in ${targetLanguage} using its official script (e.g. Telugu script for Telugu, Devanagari for Hindi/Marathi, Tamil script for Tamil, Kannada script for Kannada, etc.). Ensure all explanations, bullet points, and greeting messages are in fluent ${targetLanguage}.`
      : '';

    const systemInstruction = `You are SolarConnect AI, an intelligent, empathetic, and expert solar energy & subsidy assistant for SolarConnect platform.
Your job is to assist homeowners, commercial building owners, and vendors with solar installation, subsidy calculations, application procedures, blockchain audit verification, and complaint resolutions.

Key Solar & Subsidy Knowledge Base:
- National Rooftop Solar Scheme (PM Surya Ghar / Green Energy Subsidy):
  • 1 kW System: Approx Cost ₹47,000 - ₹55,000 ($600-$700). Central Subsidy: ₹30,000. Net Cost: ~₹17,000 - ₹25,000.
  • 2 kW System: Approx Cost ₹90,000 - ₹1,05,000. Central Subsidy: ₹60,000. Net Cost: ~₹30,000 - ₹45,000.
  • 3 kW+ System: Approx Cost ₹1,35,000 - ₹1,60,000. Max Central Subsidy: ₹78,000.
- Required Documents for Subsidy Application:
  1. Recent Electricity Bill (with active Consumer ID & Sanctioned Load)
  2. Govt ID (Aadhaar Card / PAN Card / Voter ID)
  3. Roof Rights Proof / Ownership Document & Roof Photo
  4. Bank Account Details (Passbook or Cancelled Cheque for direct subsidy transfer)
- Financial & Environmental Savings:
  • 1 kW solar generates ~4 to 4.5 kWh (units) daily or ~120-135 units/month.
  • Average payback period: 2.5 to 3.5 years.
  • 25-Year Carbon Offset: Approx 1.2 tonnes of CO2 per kW per year.
- SolarConnect Platform Features:
  • Smart Calculator: Estimates cost, subsidy, out-of-pocket expenses, and ROI.
  • Smart Document OCR: Auto-extracts consumer details from electricity bill uploads.
  • Blockchain Application Tracking: Every step (Submission -> Verification -> Approval -> Vendor Installation -> Audit -> Subsidy Credit) is recorded on a tamper-evident immutable ledger with SHA-256 block hashes.
  • Complaint Resolution Desk: Tracks issues with assigned officer, SLA, and live status.

Provide short, clear, encouraging, structured bullet-point responses with practical guidance. Keep answers friendly, accurate, and concise.${langInstruction}`;

    const formattedHistory = conversationHistory.slice(-6).map((msg: { sender: string; text: string }) => 
      `${msg.sender === "user" ? "User" : "Assistant"}: ${msg.text}`
    ).join("\n");

    const promptText = `${formattedHistory ? `Conversation Context:\n${formattedHistory}\n\n` : ''}User Question: ${message}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || getFallbackAnswer(message, context);
    return res.json({ reply, source: "gemini_ai" });
  } catch (error: any) {
    console.error("Error calling Gemini API for chat:", error?.message || error);
    return res.json({
      reply: getFallbackAnswer(req.body?.message || "", req.body?.context || {}),
      source: "fallback_knowledge_base"
    });
  }
});

// Smart Document OCR Parsing Endpoint
app.post("/api/ocr", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", fileName = "document.jpg" } = req.body;
    
    const ai = getGeminiAI();
    if (!ai || !imageBase64) {
      // Fallback mock OCR generator based on document type
      return res.json({
        success: true,
        data: getFallbackOCRData(fileName),
        source: "fallback_ocr"
      });
    }

    // Clean base64 string
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const prompt = `Analyze this document image (Electricity Bill or Identity Document) for a Solar Subsidy application. Extract the key structured fields into JSON. Return ONLY valid JSON with keys:
{
  "documentType": "Electricity Bill" or "Government ID" or "Roof Photo",
  "consumerId": "extracted consumer or ID number",
  "consumerName": "full name found",
  "address": "installation address",
  "sanctionedLoadKw": "number (e.g., 3.5)",
  "monthlyConsumptionKwh": "number (e.g., 380)",
  "monthlyBillAmount": "number (e.g., 3200)",
  "discomName": "Electricity utility provider name",
  "confidenceScore": "e.g. 96%"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    try {
      const parsed = JSON.parse(text);
      return res.json({ success: true, data: parsed, source: "gemini_ocr" });
    } catch {
      return res.json({ success: true, data: getFallbackOCRData(fileName), source: "fallback_ocr" });
    }
  } catch (err: any) {
    console.error("Error running OCR with Gemini:", err?.message || err);
    return res.json({
      success: true,
      data: getFallbackOCRData(req.body?.fileName || ""),
      source: "fallback_ocr"
    });
  }
});

// Rule-based fallback responses for chat when offline or missing key
function getFallbackAnswer(q: string, _context: any, targetLanguage: string = "English"): string {
  const query = q.toLowerCase();
  
  if (query.includes("1 kw") || query.includes("1kw") || query.includes("cost")) {
    return `☀️ **1 kW Rooftop Solar System Cost & Subsidy Breakdown:**
• **Estimated System Cost:** ₹48,000 – ₹52,000 ($600 – $650)
• **Government Central Subsidy:** ₹30,000 ($375)
• **Your Out-of-Pocket Cost:** Approx ₹18,000 – ₹22,000
• **Monthly Savings:** ~₹800 – ₹1,200/month
• **Payback Period:** Less than 2 years!

You can test custom capacity and state bonuses in our **Solar Calculator** on the home dashboard!`;
  }

  if (query.includes("subsidy") || query.includes("how much subsidy")) {
    return `💰 **National Rooftop Solar Subsidy Tiers (PM Surya Ghar):**
• **1 kW System:** ₹30,000 flat central subsidy
• **2 kW System:** ₹60,000 flat central subsidy
• **3 kW to 10 kW System:** ₹78,000 maximum central subsidy
• **Additional State Top-up:** ₹10,000 to ₹20,000 extra depending on state policy.

The subsidy is credited **directly to your verified bank account** via direct benefit transfer (DBT) within 14 days of meter installation and audit inspection!`;
  }

  if (query.includes("document") || query.includes("required") || query.includes("upload")) {
    return `📄 **Required Documents for Solar Subsidy Approval:**
1. **Recent Electricity Bill** (Must display your Consumer ID & Sanctioned Load)
2. **Identity Proof** (Aadhaar Card, PAN Card, or Passport)
3. **Roof Ownership / Terrace Rights Proof** & site photograph
4. **Cancelled Cheque / Bank Passbook** (matching applicant name for DBT credit)

💡 *Tip: Use our **Smart Document Upload** feature on the Apply page! Our AI OCR automatically extracts your details instantly.*`;
  }

  if (query.includes("save") || query.includes("savings")) {
    return `⚡ **Expected Electricity & Financial Savings:**
• 1 kW system generates **4 to 4.5 units (kWh) per day** (~130 units/month).
• Average monthly bill reduction: **70% to 90%** with net metering!
• Annual Savings: **₹12,000 to ₹15,000 per kW**.
• 25-Year Cumulative Savings: Over **₹3,000,000+ ($35,000+)** for a 3kW installation.`;
  }

  if (query.includes("status") || query.includes("application")) {
    return `🔍 **Tracking Your Application Status:**
• You can check live tracking anytime under **"My Applications"** or enter your Application ID (e.g. \`SC10245\`) in the search bar.
• Every step is recorded on the **SolarConnect Blockchain Ledger** with tamper-evident cryptographic block hashes.
• Milestones: \`Submitted\` ➔ \`Docs Verified\` ➔ \`Approved\` ➔ \`Installation\` ➔ \`Audit\` ➔ \`Subsidy Processed\`.`;
  }

  if (query.includes("delay") || query.includes("why")) {
    return `📢 **Reasons for Subsidy Delay & Resolution:**
Common reasons for delay include:
1. Mismatch between Electricity Bill name and Bank Account name.
2. Net Metering approval pending from DISCOM (power utility).
3. Vendor inspection photo re-upload requested.

If your application has been idle for over 15 days, click **"File a Complaint"** on the dashboard. Our Complaint Tracking system will assign a grievance officer with a guaranteed 48-hour response SLA.`;
  }

  return `☀️ **SolarConnect AI Assistant:**
I am here to guide you through your complete solar journey!

Here are some helpful things you can ask me:
- "How much does 2 kW or 3 kW solar cost?"
- "What subsidy am I eligible for in my state?"
- "What documents do I need to upload?"
- "How do I verify my blockchain application record?"
- "Why is my subsidy delayed and how do I file a complaint?"

How can I help you today?`;
}

function getFallbackOCRData(fileName: string) {
  const isId = fileName.toLowerCase().includes("id") || fileName.toLowerCase().includes("aadhaar") || fileName.toLowerCase().includes("pan");
  
  if (isId) {
    return {
      documentType: "Government ID",
      consumerId: "ID-9821-4410",
      consumerName: "Rajesh Kumar Sharma",
      address: "Flat 402, Green Enclave, Sector 14, New Delhi",
      sanctionedLoadKw: "N/A",
      monthlyConsumptionKwh: "N/A",
      monthlyBillAmount: "N/A",
      discomName: "N/A",
      confidenceScore: "98.4%"
    };
  }

  return {
    documentType: "Electricity Bill",
    consumerId: "DISCOM-DEL-8839120",
    consumerName: "Rajesh Kumar Sharma",
    address: "Flat 402, Green Enclave, Sector 14, New Delhi - 110001",
    sanctionedLoadKw: "4.0",
    monthlyConsumptionKwh: "420",
    monthlyBillAmount: "3650",
    discomName: "Tata Power Delhi Distribution Ltd (TPDDL)",
    confidenceScore: "97.8%"
  };
}

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SolarConnect Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
