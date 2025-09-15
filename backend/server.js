import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/groq", async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Groq model
        messages: messages,
      }),
    });

    const data = await response.json();

    // Debug log 
    console.log("Groq API response:", JSON.stringify(data, null, 2));

    res.json(data);
  } catch (error) {
    console.error("Error calling Groq API:", error);
    res.status(500).json({ error: "Groq API call failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
