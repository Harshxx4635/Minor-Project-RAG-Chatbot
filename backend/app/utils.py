import os
from typing import List
from fastapi import HTTPException

def validate_pdf_files(files: List[str]) -> None:
    """
    Validate that the uploaded files are PDFs and exist in the filesystem.
    """
    for file_path in files:
        if not os.path.exists(file_path):
            raise HTTPException(status_code=400, detail=f"File not found: {file_path}")
        if not file_path.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail=f"Invalid file type: {file_path}. Only PDFs are allowed.")

def cleanup_files(file_paths: List[str]) -> None:
    """
    Clean up uploaded files after processing.
    """
    for file_path in file_paths:
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"Error cleaning up file {file_path}: {e}")

def create_directory_if_not_exists(directory: str) -> None:
    """
    Create a directory if it doesn't already exist.
    """
    if not os.path.exists(directory):
        os.makedirs(directory)

def log_message(message: str) -> None:
    """
    Log messages to the console (can be extended to log to a file or external service).
    """
    print(f"[LOG] {message}")