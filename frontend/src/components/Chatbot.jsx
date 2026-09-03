import { useState } from "react";
import ReactMarkdown from "react-markdown";

import api from "../services/api";

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            sender: "ai",
            text: "Hi! I'm BugFlow AI. How can I help you?"
        }
    ]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        const trimmedMessage = message.trim();

        if (!trimmedMessage || loading) {
            return;
        }

        setMessages((prev) => [
            ...prev,
            {
                sender: "user",
                text: trimmedMessage
            }
        ]);

        setMessage("");
        setLoading(true);

        try {
            const response = await api.post("/api/chat", {
                message: trimmedMessage
            });

            setMessages((prev) => [
                ...prev,
                {
                    sender: "ai",
                    text: response.data.response
                }
            ]);
        } catch (error) {
            console.error("Chatbot error:", error);

            setMessages((prev) => [
                ...prev,
                {
                    sender: "ai",
                    text: "Sorry, I couldn't process your request. Please try again."
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* AI Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 py-3 shadow-lg flex items-center gap-2 transition"
                >
                    💬 AI Chat
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold">
                                🤖 BugFlow AI
                            </h3>
                            <p className="text-xs opacity-80">
                                AI Assistant
                            </p>
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white text-xl hover:opacity-80"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">

                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${
                                    msg.sender === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                <div
                                    className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                                        msg.sender === "user"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                                    }`}
                                >
                                    <ReactMarkdown
    components={{
        p: ({ children }) => (
            <p className="mb-2 last:mb-0">
                {children}
            </p>
        ),
        strong: ({ children }) => (
            <strong className="font-semibold">
                {children}
            </strong>
        ),
        ul: ({ children }) => (
            <ul className="list-disc ml-4 mb-2 space-y-1">
                {children}
            </ul>
        ),
        ol: ({ children }) => (
            <ol className="list-decimal ml-4 mb-2 space-y-1">
                {children}
            </ol>
        ),
        li: ({ children }) => (
            <li>
                {children}
            </li>
        ),
        code: ({ children }) => (
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-xs">
                {children}
            </code>
        )
    }}
>
    {msg.text}
</ReactMarkdown>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-2 rounded-xl text-sm">
                                    Thinking...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex gap-2">

                        <textarea
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask BugFlow AI..."
                            rows="1"
                            className="flex-1 resize-none border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                        />

                        <button
                            onClick={sendMessage}
                            disabled={loading || !message.trim()}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 rounded-lg transition"
                        >
                            ➤
                        </button>

                    </div>
                </div>
            )}
        </>
    );
}

export default Chatbot;