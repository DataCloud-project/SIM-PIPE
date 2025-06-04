# carbontracker fastapi agent

Simple fastapi server hosting `process` endpoint that takes cpu json data as input

Build image
```bash
docker build -t carbontracker-agent .
```

Run image as server
```bash
docker run -p 8000:8000 carbontracker-agent
```

Call the fastapi endpoint
```bash
jq -Rs '{data: .}' sample_simpipe_metrics.json | curl -X POST http://localhost:8000/process -H 'Content-Type: application/json' -d @-
```

Output
```json
{"stdout":"CarbonTracker: INFO - Detected CPU: -\nCarbonTracker: INFO - Matched CPU - to 6th Gen A10-8700P APU with TDP 15.0W\nCarbonTracker: INFO - Using TDP of 7.50W for -\nCarbonTracker: WARNING - ElectricityMaps API key not set. Will default to average carbon intensity.\nCarbonTracker: WARNING - ElectricityMaps API key not set. Will default to average carbon intensity.\nCarbonTracker: WARNING - Failed to retrieve carbon intensity: Defaulting to average carbon intensity 30.080084 gCO2/kWh.\nCarbonTracker: WARNING - Failed to retrieve carbon intensity: Defaulting to average carbon intensity 30.080084 gCO2/kWh.\n\n=== CarbonTracker Simulation Results ===\nSource: data.json\n========================================\n\nSimulation Details:\n+ Duration: 0:00:11.00\n+ CPU Model: -\n+ CPU Power Data: Available\n+ Average Power Usage: 7.50 W\n+ Energy Usage: 18.37 J\n+ Location: Trondheim, Trøndelag, NO\n+ Carbon Intensity: 30.08 gCO2/kWh\n\nConsumption Summary:\n+ Energy: 0.000005 kWh\n+ CO2eq: 0.000 g\n\nEnvironmental Impact Equivalents:\n+ 0.000001 km travelled by car\n\nSimulation log written to ./logs\n","stderr":"   Building fastapi-agent @ file:///app\n      Built fastapi-agent @ file:///app\nUninstalled 1 package in 0.24ms\nInstalled 1 package in 1ms\n","parsed":"{\n  \"Duration\": \"0:00:11.00\",\n  \"CPU Model\": \"-\",\n  \"CPU Power Data\": \"Available\",\n  \"Average Power Usage\": \"7.50 W\",\n  \"Energy Usage\": \"18.37 J\",\n  \"Location\": \"Trondheim, Trøndelag, NO\",\n  \"Carbon Intensity\": \"30.08 gCO2/kWh\",\n  \"Energy\": \"0.000005 kWh\",\n  \"CO2eq\": \"0.000 g\"\n}"}
```

Parse json output:
```python
p = json.loads(data["parsed"])
print(p)
```

will print:
```json
{'Duration': '0:00:11.00',
 'CPU Model': '-',
 'CPU Power Data': 'Available',
 'Average Power Usage': '7.50 W',
 'Energy Usage': '18.37 J',
 'Location': 'Trondheim, Trøndelag, NO',
 'Carbon Intensity': '30.08 gCO2/kWh',
 'Energy': '0.000005 kWh',
 'CO2eq': '0.000 g'}
 ```
