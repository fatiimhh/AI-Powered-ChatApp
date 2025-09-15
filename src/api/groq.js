export const callGroq = async (userMessage) => {
  const response = await fetch("http://localhost:5000/api/groq", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userMessage },
      ],
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No reply";
};
