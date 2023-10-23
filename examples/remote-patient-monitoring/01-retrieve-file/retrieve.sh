#!/bin/bash

if [ -z "$1" ]; then
    echo "[$(date +%Y-%m-%dT%H:%M:%S%z)] Please provide the duration as an argument." >&2
    exit 1
fi

# Check if "input.txt" exists
if [[ ! -f "/in/input.txt" ]]; then
    echo "[$(date +%Y-%m-%dT%H:%M:%S%z)] Input file not found!" >&2
    exit 1
fi

if [[ ! -s "/in/input.txt" ]]; then
    echo "[$(date +%Y-%m-%dT%H:%M:%S%z)] Error! No input provided!" >&2
    exit 1
fi

# Get the size of the file in bytes
file_size_bytes=$(wc -c < "/in/input.txt")

# Get the size of the file in kilobytes
file_size_kb=$(echo "($file_size_bytes + 1023) / 1024" | bc)

# Set the size to the multiplier variable
multiplier=$file_size_kb


DURATION=$1
INPUT_FREQUENCY=${INPUT_FREQUENCY:-1}

OUTPUT_FILE="/out/fhir_outputs.txt"

echo "Multiplier: $multiplier"
echo "INPUT_FREQUENCY: $INPUT_FREQUENCY"

# Check if the output file exists, create if not
if [ ! -f "$OUTPUT_FILE" ]; then
    touch "$OUTPUT_FILE"
fi


function generate_sensor_data() {
    for ((i=0; i<$INPUT_FREQUENCY; i++)); do
        echo "sensor_data:weight:$((70 + RANDOM % 10))kg,heart_rate:$((70 + RANDOM % 30))bpm,blood_pressure:$((100 + RANDOM % 40))/$((60 + RANDOM % 30)),step_count:$((4000 + RANDOM % 4000))"
        sleep 0.2
    done
}

function to_fhir_format() {
    weight="$1"
    heart_rate="$2"
    blood_pressure_systolic=$(echo "$3" | awk -F '/' '{print $1}')
    blood_pressure_diastolic=$(echo "$3" | awk -F '/' '{print $2}')
    step_count="$4"

    # Construct a JSON-like structure
    fhir_data="{
        \"Patient\": \"John Doe\",
        \"Observations\": {
            \"weight\": \"$weight\",
            \"heart_rate\": \"$heart_rate\",
            \"blood_pressure\": {
                \"systolic\": \"$blood_pressure_systolic\",
                \"diastolic\": \"$blood_pressure_diastolic\"
            },
            \"step_count\": \"$step_count\"
        }
    }"

    echo "$fhir_data"
}

function push_to_mqtt() {
    echo "[$(date +%Y-%m-%dT%H:%M:%S%z)] Pushing data to MQTT..."
    sleep 0.5
}

# Simulate CPU usage: We will run simple calculations in a loop.
function increase_cpu_usage() {
    for ((i=0; i<$(($INPUT_FREQUENCY)); i++)); do
        local count=0
        while [[ $count -lt 500 ]]; do
            echo "scale=10; 2 + 2" | bc -l >/dev/null
            count=$((count + 1))
        done
    done
}

MEMORY_HOG=()

function hog_memory() {
    for ((i=0; i<$(($multiplier)); i++)); do
        MEMORY_HOG+=($(head -n 4000000 /dev/urandom | tr -dc A-Za-z0-9 | head -c 10000))
    done
}


# Simulate memory usage: We'll allocate arrays of increasing size.
# function increase_memory_usage() {
#     local chunk_size=10485
#     local total_bytes=$((multiplier * chunk_size))

#     echo "Chunk: $chunk_size"
#     echo "Bytes: $total_bytes"
#     echo "Multiplier: $multiplier"
    
#     for ((i=0; i<$(($multiplier)); i++)); do
#         local data=$(head -c "$total_bytes" < /dev/zero | tr '\0' '\141') 
#         sleep 1
#     done
# }

# increase_memory_usage &



END_TIME=$((SECONDS+$DURATION))

while [ $SECONDS -lt $END_TIME ]; do
    # Generate, format, and push sensor data
    echo "[$(date +%Y-%m-%dT%H:%M:%S%z)] Obtaining sensor data..."
    sensor_data=$(generate_sensor_data)
    IFS=$'\n' # set field separator to newline for the for-loop
    for line in $sensor_data; do
        weight=$(echo "$line" | awk -F ',' '{print $1}' | awk -F ':' '{print $3}' | sed 's/kg//')
        heart_rate=$(echo "$line" | awk -F ',' '{print $2}' | awk -F ':' '{print $2}' | sed 's/bpm//')
        blood_pressure=$(echo "$line" | awk -F ',' '{print $3}' | awk -F ':' '{print $2}')
        step_count=$(echo "$line" | awk -F ',' '{print $4}' | awk -F ':' '{print $2}')
        fhir_data=$(to_fhir_format "$weight" "$heart_rate" "$blood_pressure" "$step_count")

        echo "Sensor Data: $line"
        echo "FHIR Data: $fhir_data"

        hog_memory

        echo "Sensor Data: $line" >> /out/fhir_outputs.txt
        echo "FHIR Data: $fhir_data" >> /out/fhir_outputs.txt
    done

    increase_cpu_usage
    push_to_mqtt

    sleep 2  # Adjust as needed to ensure the script doesn't run too frequently
done

unset MEMORY_HOG