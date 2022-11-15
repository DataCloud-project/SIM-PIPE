#!/bin/ash

# Exit at the first error
set -e

# List the input files
echo "List of files"
ls -l /app/in

# compute the size in bytes of the input files
size=$(du -b -s /app/in | cut -f1)
echo "Size of input files: $size bytes"

# Load memory factor from environment variable named MEMORY_BOOST, with 50 as default
memory_boost=$(echo $MEMORY_BOOST | sed 's/[^0-9]*//g')
if [ -z "$memory_boost" ]; then
    memory_boost=50
fi

echo "Memory boost factor: $memory_boost"

# Compute the memory to allocate (memory_boost * size)
memory=$((memory_boost * size))
echo "Memory to allocate: $memory bytes"

# Get the amount of free memory
free_memory=$(free -b | grep Mem | awk '{print $4}')
echo "Free memory: $free_memory bytes"

# If it's bellow 64KB, set it to 64KB
if [ $memory -lt 65536 ]; then
    memory=65536
    echo "Memory to allocate is bellow 64KB, set it to 64KB"
fi

# Check if there is enough memory to allocate
if [ $memory -gt $free_memory ]; then
    echo "Not enough memory to allocate"
    exit 1
fi


# Simulate memory and cpu usage
memory_steps=$((memory / 100))
memory_amount_a=$((memory_steps * 20))B
memory_amount_b=$((memory_steps * 90))B
memory_amount_c=$((memory_steps * 50))B
stress-ng --vm 2 --vm-bytes $memory_amount_a --vm-keep --vm-hang 1s -t 3s --cpu 1 --cpu-load 10 --quiet

# For each file in the work directory
for file in /app/in/* ; do
    echo "Encrypting with very very secure algorithm file $file"
    filename=$(basename $file)
    # Convert to base64 and encrypt using rot13 (this is a joke)
    # The useless use of cat is there to please cat owners
    cat $file | base64 | tr 'A-Za-z' 'N-ZA-Mn-za-m' > /app/out/$filename.base64.rot13
    stress-ng --vm 2 --vm-bytes $memory_amount_b --vm-keep --vm-hang 1s -t 2s --cpu 3 --cpu-load 85 --quiet
done

stress-ng --vm 2 --vm-bytes $memory_amount_c --vm-keep --vm-hang 1s -t 5s --cpu 2 --cpu-load 56 --quiet
echo "Done"
ls -l /app/out