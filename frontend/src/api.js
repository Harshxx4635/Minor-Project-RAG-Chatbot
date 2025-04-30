import axios from "axios";

const API_BASE_URL = "https://minor-project-rag-chatbot.onrender.com"; // Change if different

export const uploadFiles = async (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  try {
    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || "Error uploading files.";
  }
};

export const askQuestion = async (question) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ask`, { question });
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || "Error fetching answer.";
  }
};
