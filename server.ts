import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // API Route: AI Salon Manager analysis using @google/genai
  app.post("/api/gemini/analyze", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: "GEMINI_API_KEY is not configured. Please add it to your secrets in Settings > Secrets."
        });
      }

      const { dataForAnalysis, customPrompt } = req.body;

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Assemble system instruction and prompt
      const systemInstruction = `You are NailOS AI Manager - a world-class salon business consultant and analyzer. 
You speak to the salon owner directly. Keep your response in Vietnamese, but incorporate professional English terms when relevant (e.g., ticket size, commission, retention, booking rate). 
Keep your response extremely practical, data-driven, and divided into clear sections with bullet points. 
Limit your response so it fits nicely on a modern CRM dashboard. Focus on:
1. Business Insights (Revenue trends, average ticket, etc.)
2. Staff & Commission optimization suggestions.
3. Marketing action item (e.g. customized SMS draft for immediate launch to a specific target segment like 'Miss You' or 'Upcoming Birthday').
Do not use markdown headers larger than ###. Avoid too much fluff. Keep the tone friendly, helpful, and highly business-oriented.`;

      const promptText = `
Here is the current state of our Nail Salon:
Services offered:
${JSON.stringify(dataForAnalysis.services?.map((s: any) => `${s.name} ($${s.price})`))}

Technicians roster:
${JSON.stringify(dataForAnalysis.staff?.map((st: any) => `${st.name} (Commission: ${st.commissionRate * 100}%, rating: ${st.rating})`))}

Roster of CRM active customers:
${JSON.stringify(dataForAnalysis.customers?.map((c: any) => `${c.name} (${c.tier} Tier, points: ${c.points}, totalSpent: $${c.totalSpent}, visits: ${c.visitCount}, lastVisit: ${c.lastVisitDate})`))}

Recent bookings and statuses:
${JSON.stringify(dataForAnalysis.bookings?.map((b: any) => `${b.customerName} - ${b.serviceName} with ${b.staffName} ($${b.price}, status: ${b.status})`))}

Low stock inventory items:
${JSON.stringify(dataForAnalysis.lowStockItems?.map((i: any) => `${i.name} (Stock: ${i.stockLevel} ${i.unit}, minNeeded: ${i.minStockLevel})`))}

User Custom request:
${customPrompt || "Hãy phân tích tình hình kinh doanh hiện tại của tiệm nail, gợi ý chiến lược tăng doanh thu tuần này và viết 1 mẫu tin nhắn SMS chăm sóc khách hàng độc đáo."}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const analysisResult = response.text || "Xin lỗi, không tải được kết quả phân tích.";
      res.json({ analysis: analysisResult });

    } catch (error: any) {
      console.error("Gemini analysis error:", error);
      res.status(500).json({ error: error.message || "Đã xảy ra lỗi khi gọi Gemini API" });
    }
  });

  // API Route: Simulated SMS sender
  app.post("/api/sms/send-simulation", (req, res) => {
    const { name, phone, message, type } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ error: "Missing required fields: name, phone, message" });
    }
    
    // Simulate API delivery delay of 500ms
    setTimeout(() => {
      res.json({
        success: true,
        id: "sim-" + Math.floor(Math.random() * 1000000),
        message: `Successfully simulated sending SMS to ${name}`,
        sentAt: new Date().toISOString(),
      });
    }, 500);
  });

  // Serve static UI / assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[NailOS] Server runs on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("[NailOS] Server setup failed:", err);
});
