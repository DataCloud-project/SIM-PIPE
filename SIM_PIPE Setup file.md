
# DataCloud SIM-PIPE component setup

## Description

There are two hosts: host 1 and host 2. The controller will run in host 1. Host 2 acts as a sandbox. As the request with a pipeline description comes in from the UI, the controller will run each step in host 2. The controller uses dockerode remote docker library and serves the following purposes:
 - Transfer the input file from to host 2 using SFTP
 - Start a container on host 2 attaching volume on host 2's local storage with binds to 3 directories: in, out, and work
 - Resume/pause/stop a container if a request comes from UI
 - Get the output and work files from the local storage to the persistent database in host 1
 - For each container started, get the resource usage statistics (time series of CPU, memory and network usage) and logs of the run.

## Environment settings

The current setup for the implementation is given below. 

Host 1 settings: 

 - System Windows 10 with docker desktop installed.
 - Dockerode library (link - https://github.com/apocas/dockerode) is used in the repository
 - After cloning the repository in host 1, run 'npm install' to install node_modules, run 'npm install dockerode' to install dockerode and 'npm install dockerode-compose' to install dockerode-compose. 
 - Port forwarding setup between ports 2375 on the host 1 and host 2.
 - Start sftp server on host 2 using atmoz sftp docker image
	- Docker compose file provided in src
 - Setup ssh with nodejs - node-sftp-client (https://openbase.com/js/node-sftp-client/documentation#list)
	- npm install ssh2-sftp-client


Host 2 settings:

 - Ubuntu 20.04 running on Virtualbox
 - Docker 20.10.7 installed
 - Settings for the docker daemon edited to make it listen to requests coming on port 2375. By default docker daemon on Ubuntu listens to /var/run/docker.sock. This requires the following changes:
        - Stop docker service if running 
        $ sudo systemctl stop docker.service; sudo systemctl stop docker.socket
        - Edit /etc/docker/daemon.json file to include this line
        "hosts": ["tcp://0.0.0.0:2375", "unix:///var/run/docker.sock"]
        - Edit /lib/systemd/system/docker.service file to include this line
        ExecStart=/usr/bin/dockerd -H fd:// -H tcp://0.0.0.0:2375 –containerd=/run/containerd/containerd.sock
        - Restart docker
        $ sudo systemctl daemon-reload; sudo systemctl restart docker.service
        - Check if daemon is listening on port 2375
        $ sudo netstat -lntp

## Current working status
The controller now can start a container on host 2 based on the specified image. It can create log files and a file containing resource usage statistics (at a single timestamp) of the container run. It can also bind 3 volumes (in, out, work)  from host 2 to the container. The SFTP server on host 2 can be started from host 1, and (sample input) files can be sent to host 2.
