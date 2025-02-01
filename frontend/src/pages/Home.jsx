import { useState } from "react";
import FileUpload from "../components/FileUpload";
import ChatBox from "../components/ChatBox";

const Home = () => {
    const [uploaded, setUploaded] = useState(false);
    const [loadingResponse, setLoadingResponse] = useState(false); // Track if response is being fetched

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-900 p-4 relative">
            {/* Title Above Components */}
            <h1 className="text-white text-3xl font-bold mb-6">RAG Chatbot</h1>

            {!uploaded ? (
                <FileUpload onUploadSuccess={() => setUploaded(true)} />
            ) : (
                <div className="w-full max-w-xl flex flex-col items-center h-[90vh]">
                    {/* Adjusted ChatBox height to prevent pushing button down */}
                    <ChatBox setLoadingResponse={setLoadingResponse} className="flex-grow max-h-[65vh]" />
                    
                    {/* Reduced margin to ensure button stays visible */}
                    <button
                        onClick={() => setUploaded(false)}
                        disabled={loadingResponse} 
                        className={`mt-4 px-4 py-2 rounded transition-all ${
                            loadingResponse ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                    >
                        {loadingResponse ? "Waiting for response..." : "Back to Uploads"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Home;
