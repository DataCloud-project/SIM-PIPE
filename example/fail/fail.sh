#!/bin/ash

# Exit at the first error
set -e

# List the input files
echo "List of files"
ls -l /app/in

stress-ng --vm 2 --vm-bytes 512M --vm-keep --vm-hang 1s -t 5s --cpu 1 --cpu-load 80 --quiet

# Print error on stderr
echo "I crashed" >&2
exit 1