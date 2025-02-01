import { useState, useEffect } from "react";

const ChatBox = ({ setLoadingResponse }) => {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [typing, setTyping] = useState(false);
    const [dots, setDots] = useState("");

    // Typing animation effect for "Typing..."
    useEffect(() => {
        if (typing) {
            const interval = setInterval(() => {
                setDots((prev) => (prev.length < 3 ? prev + "." : ""));
            }, 500);
            return () => clearInterval(interval);
        } else {
            setDots(""); // Reset dots when typing stops
        }
    }, [typing]);

    const handleAsk = async () => {
        if (!question.trim()) return;
    
        setLoading(true);
        setTyping(true); // Start typing animation
        setLoadingResponse(true); // Disable "Back to Uploads" button
        setMessages((prev) => [...prev, { text: question, sender: "user" }]);
        setQuestion(""); // Clear input box
    
        try {
            const response = await fetch("http://127.0.0.1:8000/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question }),
            });
    
            const result = await response.json();
            if (response.ok) {
                simulateTypingEffect(result.answer.trim()); // Trim extra whitespace
            } else {
                alert(`Error: ${result.detail}`);
            }
        } catch (error) {
            alert("Error fetching answer.");
            console.error(error);
        } finally {
            setLoading(false);
            setLoadingResponse(false); // Enable "Back to Uploads" button
        }
    };
    
    // Simulate chatbot typing response character by character
    const simulateTypingEffect = (fullText) => {
        if (!fullText) return;
    
        let index = 0; // Start from the first character
        setMessages((prev) => [...prev, { text: "", sender: "bot" }]); // Initialize bot's message
    
        const interval = setInterval(() => {
            if (index < fullText.length) {
                setMessages((prev) => {
                    const updatedMessages = [...prev];
                    const lastMessageIndex = updatedMessages.length - 1;
    
                    if (updatedMessages[lastMessageIndex] && updatedMessages[lastMessageIndex].sender === "bot") {
                        updatedMessages[lastMessageIndex] = {
                            ...updatedMessages[lastMessageIndex],
                            text: fullText.substring(0, index + 1), // Add characters up to the current index
                        };
                    }
                    return updatedMessages;
                });
                index++;
            } else {
                clearInterval(interval);
                setTyping(false);
            }
        }, 15);
    };
    
    
    
    
    

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !loading) {
            e.preventDefault();
            handleAsk();
        }
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="w-full max-w-2xl p-4 border border-gray-700 rounded-lg bg-gray-800 shadow-lg flex flex-col h-[80vh]">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`space-y-1 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                            {/* Sender Name */}
                            <div className="text-sm font-semibold text-gray-400">
                                {msg.sender === "user" ? "Me" : "Chatbot"}
                            </div>

                            {/* Message Bubble */}
                            <div
                                className={`p-3 rounded-lg max-w-[80%] ${
                                    msg.sender === "user"
                                        ? "bg-blue-600 text-white ml-auto"
                                        : "bg-gray-700 text-white"
                                }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator (Shows only if no bot response has started) */}
                    {typing && messages.length > 0 && messages[messages.length - 1].sender !== "bot" && (
                        <div className="space-y-1 text-left">
                            <div className="text-sm font-semibold text-gray-400">Chatbot</div>
                            <div className="p-3 rounded-lg max-w-[80%] bg-gray-700 text-white">
                                Thinking{dots}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center bg-gray-700 p-2 rounded-lg">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={handleKeyPress} // Send on Enter key press
                        placeholder="Ask a question..."
                        className="flex-1 bg-gray-700 text-white p-2 border-none outline-none"
                    />
                    <button
                        onClick={handleAsk}
                        disabled={loading}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 ml-2 rounded transition-all"
                    >
                        {loading ? "Fetching..." : "Ask"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
