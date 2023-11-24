# Simulate pipeline
Setup a KWOK cluster and submit an argo workflow to the cluster to simulate the pipeline deployment.

# Docker
Create and run docker image

```bash
docker build -f Dockerfile -t kwoksim .
docker run -v /var/run/docker.sock:/var/run/docker.sock kwoksim
```