from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import os
from pydantic import BaseModel
from app.processing import process_pdfs, query_answer
from app.utils import validate_pdf_files, cleanup_files, create_directory_if_not_exists, log_message
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "API is running!"}

@app.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    try:
        print("📥 /upload endpoint was called.")
        
        # Use /tmp directory for Render compatibility
        pdf_dir = "/tmp/data/pdfs"
        index_dir = "/tmp/data/faiss_index"

        # Create directories
        print("Creating dirs")
        create_directory_if_not_exists(pdf_dir)
        create_directory_if_not_exists(index_dir)
        print("Dirs created")
        file_paths = []
        for file in files:
            file_path = os.path.join(pdf_dir, file.filename)
            with open(file_path, "wb") as f:
                f.write(await file.read())
            file_paths.append(file_path)

        # Validate, process, clean
        validate_pdf_files(file_paths)
        process_pdfs(file_paths)
        log_message("PDFs processed and indexed successfully.")
        cleanup_files(file_paths)

        return {"message": "Files processed successfully"}
    except HTTPException as e:
        print(f"{e}")
        raise e
    except Exception as e:
        log_message(f"Error processing files: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

class QuestionRequest(BaseModel):
    question: str

@app.post("/ask")
async def ask_question(request: QuestionRequest):
    try:
        log_message(f"Received question: {request.question}")
        answer = query_answer(request.question)
        log_message(f"Generated answer: {answer}")
        return {"answer": answer}
    except Exception as e:
        log_message(f"Error answering question: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    import os

    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)

