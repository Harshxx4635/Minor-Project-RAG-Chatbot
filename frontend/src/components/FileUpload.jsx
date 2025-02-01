import { useState, useRef } from "react";
import { Inbox, X } from "lucide-react";

const FileUpload = ({ onUploadSuccess }) => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [dragging, setDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (uploading) return; // Prevent file selection while uploading
        setFiles([...files, ...e.target.files]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (uploading) return; // Prevent dropping files while uploading
        setDragging(false);
        setFiles([...files, ...e.dataTransfer.files]);
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            alert("Please select files to upload.");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));

        try {
            const response = await fetch("http://127.0.0.1:8000/upload", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                alert("Files uploaded successfully!");
                setFiles([]);
                onUploadSuccess();
            } else {
                alert(`Upload failed: ${result.detail}`);
            }
        } catch (error) {
            alert("Error uploading files.");
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="w-full max-w-lg p-6 border border-gray-700 rounded-lg bg-gray-800 shadow-lg">
                <div
                    className={`border-2 border-dashed p-6 text-center rounded-lg transition-all ${
                        uploading
                            ? "border-gray-500 bg-gray-700 cursor-not-allowed"
                            : dragging
                            ? "border-blue-500 bg-blue-900"
                            : "border-gray-600 cursor-pointer"
                    }`}
                    onDragOver={(e) => {
                        e.preventDefault();
                        if (!uploading) setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => !uploading && fileInputRef.current.click()}
                >
                    <Inbox className="mx-auto mb-2 text-gray-400" size={40} />
                    <p className="text-gray-400">
                        {uploading ? "Uploading in progress..." : "Drag & Drop PDFs here or click to upload"}
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={uploading}
                    />
                </div>

                {files.length > 0 && (
                    <ul className="mt-4 p-2 border border-gray-700 rounded bg-gray-700">
                        {files.map((file, index) => (
                            <li key={index} className="flex justify-between items-center p-1 text-gray-300">
                                <span>{file.name}</span>
                                <button
                                    onClick={() => setFiles(files.filter((_, i) => i !== index))}
                                    className={`text-red-400 hover:text-red-600 ${
                                        uploading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                                    }`}
                                    disabled={uploading}
                                >
                                    <X size={16} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className={`bg-blue-500 text-white px-4 py-2 mt-4 w-full rounded transition-all ${
                        uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600 cursor-pointer"
                    }`}
                >
                    {uploading ? "Uploading..." : "Upload Files"}
                </button>
            </div>
        </div>
    );
};

export default FileUpload;
