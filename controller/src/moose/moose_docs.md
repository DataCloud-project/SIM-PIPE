kubectl create secret generic simpipe-moose-api --from-literal=MOOSE_API_KEY='<your-key>'
kubectl create secret generic simpipe-openrouter-api-paid --from-literal=OPENROUTER_API_KEY_PAID='<your-key>'

kubectl create secret generic simpipe-openrouter-api --from-literal=OPENROUTER_API_KEY='<your-openrouter-key>'

curl -X 'POST' \   'https://moose.zooverse.dev/schemas/dpv_pd/ner' \   -H 'accept: application/json' \   -H 'X-API-Key: mooseapikey' \   -H 'X-LLM-API-Key: openrouterkey' \   -H 'Content-Type: application/json' \   -d '{   "text": "We collect email addresses and IP addresses for fraud prevention.",   "llm": {       "provider": "openrouter",       "model": "meta-llama/llama-3.3-70b-instruct"    } }'

https://moose.zooverse.dev/ner


curl -X 'GET' \
  'https://moose.zooverse.dev/jobs/<job_id>' \
  -H 'accept: application/json' \
  -H 'X-API-Key: mooseapikey'

https://moose.zooverse.dev/jobs/<job_id>
