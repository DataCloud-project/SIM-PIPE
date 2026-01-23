kubectl create secret generic simpipe-moose-api --from-literal=MOOSE_API_KEY='<your-key>'
kubectl create secret generic simpipe-openrouter-api-paid --from-literal=OPENROUTER_API_KEY_PAID='<your-key>'

kubectl create secret generic simpipe-openrouter-api --from-literal=OPENROUTER_API_KEY='<your-openrouter-key>'

curl -X 'POST' \
  'https://moose.zooverse.dev/ner' \
  -H 'accept: application/json' \
  -H 'X-LLM-API-Key: openrouterkey' \
  -H 'X-API-Key: mooseapikey' \
  -H 'Content-Type: application/json' \
  -d '{
  "tasks": [
    {
      "task_id": "someid",
      "text": "#this should be an argument"
    }
  ],
  "include_scores": false,
  "llm": {
    "provider": "openrouter",
    "model": "gpt-oss-120b"
  },
  "schema": "dpv"
}'

https://moose.zooverse.dev/ner


curl -X 'GET' \
  'https://moose.zooverse.dev/jobs/<job_id>' \
  -H 'accept: application/json' \
  -H 'X-API-Key: mooseapikey'

https://moose.zooverse.dev/jobs/<job_id>
