"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_AGENT_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem: input }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "agent", content: data.resposta || "..." },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "agent", content: "⚠️ Erro ao conectar com o agente." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-6">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl border border-slate-200 p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-4 text-center">
          🤖 Agente WISPer
        </h1>

        <div className="h-[460px] overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
          {messages.length === 0 && (
            <p className="text-gray-400 text-center mt-20">
              Envie uma mensagem para iniciar a conversa 👇
            </p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`my-2 p-3 rounded-lg text-sm ${
                m.role === "user"
                  ? "bg-blue-100 text-right text-blue-900"
                  : "bg-gray-200 text-left text-gray-900"
              }`}
            >
              {m.content}
            </div>
          ))}
          {loading && (
            <p className="text-sm text-gray-500 italic mt-2">Digitando...</p>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <input
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2"
          >
            Enviar
          </button>
        </div>
      </div>
    </main>
  );
}
