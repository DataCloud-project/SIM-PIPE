# The SIM-PIPE simple sandbox

For local development it may be a bit cumbersome to use a whole virtual machine or a second machine to execute the pipelines test runs.

This sandbox is a simple way to run the pipelines in a local environment on top of docker. It is perhaps not the most accurate way to run the pipelines, as you may have other software installed on your machine that may interfere with the pipelines, but it is a good way to get started.

## Implementation notes

The sandbox uses Docker in Docker, also known as dind.

In addition to that, cadvisor is added to the sandbox directly inside the container. I tried to have cadvisor as a seperate container communicating with docker in docker over the network, but after debugging cadvisor I realised that cadvisor doesn't really use the docker client but will rather fetch the information directly using the linux /proc filesystem and the docker overlays locations. Some can be fixed with some shared volumes, but cadvisor was unable to access to the docker in docker /proc correctly. It made it unable to fetch the network data, which is important for the pipelines.

I could patch cadvisor to use the docker client more in my case, but I went with the simplest solution: placing cadvisor inside the container.

Since the container now runs two processes, dockerd and cadvisor, I had to use a process manager to keep the container running. I chose tini for this. I hope the *gods* will not be angry with me because I put two main processes inside a single container.

## Why not docker inside a VM inside docker ?

I briefly considered using a virtual machine inside docker, this has been done before.

However, many docker installations do not support nested virtualization. Like lima/colima on my laptop.