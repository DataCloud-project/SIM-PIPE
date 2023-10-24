#!/bin/bash

MEMORY_HOG=()

function hog_memory() {
    MEMORY_HOG+=($(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 10000))
}

function hog_cpu() {
    local count=0
    while [[ $count -lt 1000 ]]; do
        echo "scale=10; 2 + 2" | bc -l >/dev/null
        count=$((count + 1))
    done
}

function retrieve_failed_check() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Retrieving failed check from system..."
    sleep 1
    echo "Failed check: BP out of range (130/90)"
}

function determine_notification_need() {
    local failed_check="$1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Determining if notification is needed for: $failed_check..."
    sleep 1
    echo "Determination: Notification required."
}

function craft_notification() {
    local failed_check="$1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Crafting notification based on: $failed_check..."
    sleep 1
    echo "Notification: Urgent attention needed for patient with $failed_check."
}

function send_notification() {
    local notification="$1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Sending notification to health personnel..."
    sleep 1
    echo "Sent: $notification"
}

# Emulation of main application logic

OUTPUT_FILE="/out/notify-output.txt"

FAILED_CHECK=$(retrieve_failed_check)
echo "$FAILED_CHECK" | tee -a $OUTPUT_FILE
hog_memory
hog_cpu

DETERMINATION=$(determine_notification_need "$FAILED_CHECK")
echo "$DETERMINATION" | tee -a $OUTPUT_FILE
hog_memory
hog_cpu

NOTIFICATION=$(craft_notification "$FAILED_CHECK")
echo "$NOTIFICATION" | tee -a $OUTPUT_FILE
hog_memory

hog_cpu

SEND_RESULT=$(send_notification "$NOTIFICATION")
echo "$SEND_RESULT" | tee -a $OUTPUT_FILE
hog_memory
hog_cpu

# Cleanup memory
unset MEMORY_HOG

echo "$(date '+%Y-%m-%d %H:%M:%S') - Script completed." | tee -a $OUTPUT_FILE
