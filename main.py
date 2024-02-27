from typing import Union
from openai import OpenAI
from fastapi.middleware.cors import CORSMiddleware
import io, os

from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel

# First install required packages: pip install -r requirements.txt
# Run the following to start server: uvicorn main:app --reload
# If the port of the frontend does not match one of the below it needs to be added

app = FastAPI()
client = OpenAI()

origins = [
    "http://localhost:5173",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# UPLOAD_FOLDER = "/uploads"

# if not os.path.exists(UPLOAD_FOLDER):
#     os.makedirs(UPLOAD_FOLDER)

class Prompt(BaseModel):
    prompt: str


@app.post("/transcribe")
async def transcribeAudio(file: UploadFile = File(...)):

    audio_file = await file.read()
    buffer = io.BytesIO(audio_file)
    buffer.name = 'audio.mp3'

    if file.content_type != 'audio/mp3':
        print("HELLO")
        raise HTTPException(status_code=415, detail="Unsupported Media Type. Only mp3 files are allowed.")

    transcript = client.audio.transcriptions.create(
        model="whisper-1",
        file=buffer,
    )

    return {"transcript": transcript.text}

@app.post("/generate")
async def generateSummary(data: Prompt):

    fullResponse: str = ""

    thread = client.beta.threads.create()

    message = client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content=data.prompt
    )

    run = client.beta.threads.runs.create(
        assistant_id = "asst_UZ99K32XXJTFSHpcZU8xfr1V",
        thread_id = thread.id
    )



    while run.status != "completed":
        keep_retrieving_run = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id
        )

        print(f"Run status: {keep_retrieving_run.status}")

        if keep_retrieving_run.status == "completed":
            print("\n")
            break

    # Retrieve messages added by the Assistant to the thread
    all_messages = client.beta.threads.messages.list(
        thread_id=thread.id
    )

    fullResponse = all_messages.data[0].content[0].text.value

    # Print the messages from the user and the assistant
    print("###################################################### \n")
    print(f"USER: {message.content[0].text.value}")
    print(f"ASSISTANT: {all_messages.data[0].content[0].text.value}")

    return {"summary": fullResponse}

@app.get("/")
def read_root():
    return {"WHY ARE YOU HERE"}


#This is just a test
@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)


