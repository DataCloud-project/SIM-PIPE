#!/bin/ash

dockerd-entrypoint.sh &
dockerd_pid=$!

cadvisor cadvisor -logtostderr &
cadvisor_pid=$!

# Wait for both
wait $dockerd_pid
wait $cadvisor_pid