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
            {/* Floating AI Orb */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    aria-label="Open BugFlow AI"
                    className="fixed bottom-7 right-7 z-50 group"
                >
                    <div className="absolute inset-0 rounded-full bg-violet-500/30 blur-xl scale-125 group-hover:bg-fuchsia-500/40 transition-all duration-500" />

                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-600 shadow-[0_12px_40px_rgba(124,58,237,0.45)] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                        <div className="absolute inset-[3px] rounded-full border border-white/30" />

                        <div className="relative flex flex-col items-center justify-center">
                            <span className="text-xl">✦</span>
                            <span className="text-[8px] font-bold tracking-[0.18em] mt-0.5">
                                AI
                            </span>
                        </div>

                        <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white shadow-sm" />
                    </div>

                    <div className="absolute right-0 bottom-[76px] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 pointer-events-none">
                        <div className="whitespace-nowrap rounded-xl bg-gray-950 text-white px-3 py-2 text-xs font-medium shadow-xl">
                            Ask BugFlow AI
                        </div>
                    </div>
                </button>
            )}

            {/* Chat Console */}
            {isOpen && (
                <div className="fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-[420px] h-[min(680px,calc(100vh-2.5rem))] flex flex-col overflow-hidden rounded-[28px] bg-white/95 dark:bg-[#11111a]/95 backdrop-blur-2xl border border-white/70 dark:border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.25)]">

                    {/* Ambient glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-fuchsia-500/10 blur-3xl pointer-events-none" />

                    {/* Header */}
                    <div className="relative px-5 py-4 border-b border-gray-200/70 dark:border-white/10 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-indigo-600 text-white">

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative w-11 h-11 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-md flex items-center justify-center shadow-lg">
                                    <span className="text-xl">✦</span>

                                    <span className="absolute -right-1 -bottom-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-violet-600" />
                                </div>

                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-[15px] tracking-tight">
                                            BugFlow AI
                                        </h3>

                                        <span className="px-1.5 py-0.5 rounded-md bg-white/15 border border-white/15 text-[9px] font-semibold tracking-wider">
                                            ASSISTANT
                                        </span>
                                    </div>

                                    <p className="text-[11px] text-white/75 mt-0.5">
                                        Intelligent defect support
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                aria-label="Close chatbot"
                                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all duration-200 hover:rotate-90"
                            >
                                <span className="text-lg leading-none">×</span>
                            </button>
                        </div>

                        {/* Status strip */}
                        <div className="mt-4 flex items-center gap-2 text-[10px] text-white/75">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.9)]" />
                            Online
                            <span className="text-white/30">•</span>
                            Ready to assist
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="relative flex-1 overflow-y-auto px-4 py-5 space-y-5 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">

                        {messages.map((msg, index) => {
                            const isUser = msg.sender === "user";

                            return (
                                <div
                                    key={index}
                                    className={`flex items-end gap-2.5 ${
                                        isUser
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    {!isUser && (
                                        <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center text-sm shadow-md">
                                            ✦
                                        </div>
                                    )}

                                    <div
                                        className={`max-w-[82%] ${
                                            isUser
                                                ? "rounded-2xl rounded-br-md bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/10"
                                                : "rounded-2xl rounded-bl-md bg-gray-100/90 dark:bg-white/[0.07] text-gray-800 dark:text-gray-100 border border-gray-200/70 dark:border-white/[0.06]"
                                        }`}
                                    >
                                        <div className="px-4 py-3 text-[13px] leading-5">
                                            <ReactMarkdown
                                                components={{
                                                    p: ({ children }) => (
                                                        <p className="mb-2 last:mb-0">
                                                            {children}
                                                        </p>
                                                    ),

                                                    strong: ({ children }) => (
                                                        <strong className="font-bold">
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
                                                        <li>{children}</li>
                                                    ),

                                                    code: ({ children }) => (
                                                        <code
                                                            className={`px-1.5 py-0.5 rounded-md text-[11px] font-mono ${
                                                                isUser
                                                                    ? "bg-white/15"
                                                                    : "bg-gray-200 dark:bg-white/10"
                                                            }`}
                                                        >
                                                            {children}
                                                        </code>
                                                    )
                                                }}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Thinking indicator */}
                        {loading && (
                            <div className="flex items-end gap-2.5">
                                <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center text-sm shadow-md">
                                    ✦
                                </div>

                                <div className="rounded-2xl rounded-bl-md bg-gray-100 dark:bg-white/[0.07] border border-gray-200/70 dark:border-white/[0.06] px-4 py-3">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[11px] text-gray-500 dark:text-gray-400 mr-1">
                                            Thinking
                                        </span>

                                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="relative px-4 pb-4 pt-2 bg-white/80 dark:bg-[#11111a]/80 border-t border-gray-200/70 dark:border-white/10">

                        <div className="relative flex items-end gap-2 rounded-2xl bg-gray-100/80 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10 focus-within:border-violet-400/70 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all duration-200 p-1.5">

                            <textarea
                                value={message}
                                onChange={(event) =>
                                    setMessage(event.target.value)
                                }
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about a bug, resolution, testing..."
                                rows="1"
                                className="flex-1 min-w-0 max-h-28 resize-none bg-transparent border-none outline-none px-3 py-2.5 text-[13px] text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                            />

                            <button
                                onClick={sendMessage}
                                disabled={loading || !message.trim()}
                                aria-label="Send message"
                                className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white flex items-center justify-center shadow-md shadow-violet-500/20 hover:shadow-lg hover:scale-105 disabled:opacity-35 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                <span className="text-lg -rotate-12">
                                    ↑
                                </span>
                            </button>
                        </div>

                        <div className="flex items-center justify-center gap-1.5 mt-2 text-[9px] text-gray-400 dark:text-gray-500">
                            <span>Enter to send</span>
                            <span>•</span>
                            <span>Shift + Enter for new line</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Chatbot;