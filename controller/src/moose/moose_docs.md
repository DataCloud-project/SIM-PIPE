# Moose API Integration Guide

This document provides instructions for setting up API keys and using the Moose NER (Named Entity Recognition) API and job status endpoints.

## 1. API Key Setup


API keys for Moose and OpenRouter are automatically created as Kubernetes secrets by the install script.

You can also manage or update these API keys from the **API Tokens** page in the frontend.

For reference, the following commands are used to create the secrets:

```sh
kubectl create secret generic simpipe-moose-api --from-literal=MOOSE_API_KEY='<your-moose-api-key>'
kubectl create secret generic simpipe-openrouter-api-paid --from-literal=OPENROUTER_API_KEY_PAID='<your-paid-openrouter-key>'
kubectl create secret generic simpipe-openrouter-api --from-literal=OPENROUTER_API_KEY='<your-openrouter-key>'
```

These are run automatically by the install script; you do not need to run them manually unless you have a special use case.

---

## 2. Using the NER API


The following example demonstrates how the NER API call is made (for informational purposes only):

```sh
curl -X POST \
  'https://moose.zooverse.dev/schemas/dpv_pd/ner' \
  -H 'accept: application/json' \
  -H 'X-API-Key: <your-moose-api-key>' \
  -H 'X-LLM-API-Key: <your-openrouter-key>' \
  -H 'Content-Type: application/json' \
  -d '{
    "text": "<Insert text here>",
    "llm": {
      "provider": "openrouter",
      "model": "meta-llama/llama-3.3-70b-instruct"
    }
  }'
```

**Endpoint:**  
https://moose.zooverse.dev/ner

---

## 3. Checking Job Status


The following example demonstrates how the job status API call is made (for informational purposes only):

```sh
curl -X GET \
  'https://moose.zooverse.dev/jobs/<job_id>' \
  -H 'accept: application/json' \
  -H 'X-API-Key: <your-moose-api-key>'
```

**Endpoint:**  
https://moose.zooverse.dev/jobs/<job_id>


---

## Notes
- For more details, refer to the official Moose API documentation https://moose.zooverse.dev/docs.
