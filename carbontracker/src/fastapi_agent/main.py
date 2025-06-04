# File: main.py
from fastapi import FastAPI, Request
from pydantic import BaseModel
import json
from .utils import store_data_temporarily, delete_temporary_data, delete_logs, parse_carbontracker_stdout
import subprocess

app = FastAPI()

class InputData(BaseModel):
    data: str

@app.post("/process")
async def process(data: InputData):
    store_data_temporarily(data.data) # is stored as data.json
    completed_process = subprocess.run(
        ["uv", "run", "carbontracker", "--simpipe", "data.json"],
        check=True,
        capture_output=True,
        text=True
    )
    delete_temporary_data()
    parsed_output = parse_carbontracker_stdout(completed_process.stdout)
    parsed_output_str = json.dumps(parsed_output, indent=2, ensure_ascii=False)
    return {"stdout": completed_process.stdout, "stderr": completed_process.stderr, "parsed": parsed_output_str}

@app.get("/delete-logs")
async def delete_carbontracker_logs():
    try:
        delete_logs()
    except Exception as e:
        print(f"Error deleting temporary data: {e}")

