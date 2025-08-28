# File: agent.py
import os
import re


def process_input(data: str) -> str:
    # Minimal business logic placeholder
    return f"Agent processed: {data}"


def store_data_temporarily(data: str) -> str:
    # Placeholder for storing data temporarily
    with open("data.json", "w") as f:
        f.write(data)
    return "Data stored temporarily in data.json"


def delete_temporary_data() -> str:
    # Placeholder for deleting temporary data
    if os.path.exists("data.json"):
        os.remove("data.json")
        return "Temporary data deleted"
    return "No temporary data to delete"


def delete_logs() -> str:
    # Placeholder for deleting logs
    if os.path.exists("logs"):
        os.remove("logs/*.log")
        return "Deleted logs"
    return "No logs to delete"


def parse_carbontracker_stdout(stdout: str) -> dict:
    result = {}

    # Patterns for each field
    patterns = {
        "Duration": r"\+ Duration:\s*([^\n]+)",
        "CPU Model": r"\+ CPU Model:\s*([^\n]+)",
        "CPU Power Data": r"\+ CPU Power Data:\s*([^\n]+)",
        "Average Power Usage": r"\+ Average Power Usage:\s*([^\n]+)",
        "Energy Usage": r"\+ Energy Usage:\s*([^\n]+)",
        "Location": r"\+ Location:\s*([^\n]+)",
        "Carbon Intensity": r"\+ Carbon Intensity:\s*([^\n]+)",
        "Energy": r"\+ Energy:\s*([^\n]+)",
        "CO2eq": r"\+ CO2eq:\s*([^\n]+)",
    }

    for key, pattern in patterns.items():
        match = re.search(pattern, stdout)
        if match:
            result[key] = match.group(1).strip()
        else:
            result[key] = None

    return result