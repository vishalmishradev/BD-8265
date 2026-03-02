"use client";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";

interface Message {
  username: string;
  text: string;
  timestamp: string;
}

export default function ChatPage() {
  const socketRef = useRef<Socket | null>(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No token found, please login first.");
      router.push("/login");
      return;
    }

    socketRef.current = io("http://localhost:3000", {
      auth: { token },
    });

    socketRef.current.on("new_message", (payload: Message) => {
      setChat((prev) => [...prev, payload]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim() && socketRef.current) {
      const myMessage = {
        username: "Me",
        text: message,
        timestamp: new Date().toISOString(),
      };

      setChat((prev) => [...prev, myMessage]);

      socketRef.current.emit("send_message", { message });
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4 text-black">
      <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-md p-4 mb-4 space-y-3">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`border-b border-gray-100 pb-2 ${msg.username === "Me" ? "text-right" : "text-left"}`}
          >
            <span
              className={`font-bold ${msg.username === "Me" ? "text-indigo-600" : "text-blue-600"}`}
            >
              {msg.username}:
            </span>
            <span className="ml-2 text-gray-800">{msg.text}</span>
            <p className="text-[10px] text-gray-400">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
