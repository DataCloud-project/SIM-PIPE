#!/bin/bash

log_directory=${BDPF_LOG_DIR} || "/logs"
info_log_file_name="bdpf_info.log"
debug_log_file_name="bdpf_debug.log"
# TODO: error log?
# error_log_file_name="bdpf_error.log" 


function reset_logs() {
    # TODO: name of log should be unique and related to the host name?
    printf '' > "$log_directory/$info_log_file_name" > "$log_directory/$debug_log_file_name" 
}

function log() {
    log_level=$1
    log_message=$2
    
    dateTime=$(date --rfc-3339=seconds)
    log_directory=${BDPF_LOG_DIR}

    # check if inputs are correct
    if [[ -z "${1}" || -z "${2}" ]]
    then
        echo "(PID: $$) ${dateTime} - [ERROR]: Invalid log configuration. Missing logging level (INFO/DEBUG/ERROR/WARNING) or log message text!"
        echo "(PID: $$) ${dateTime} - [ERROR]: Provided inputs: ${1}, ${2}."
        exit 1
    fi

    # TODO: Use standardised log formatting!
    case $log_level in
        INFO)
            # Log to both info and debug
            echo "(PID: $$) ${dateTime} - [INFO]: $log_message"
            echo "(PID: $$) ${dateTime} - [INFO]: $log_message" >> $log_directory/$info_log_file_name
            echo "(PID: $$) ${dateTime} - [INFO]: $log_message" >> $log_directory/$debug_log_file_name
            ;;  
        DEBUG)
            # Log to debug only
            echo "(PID: $$) ${dateTime} - [DEBUG]: $log_message" >> $log_directory/$debug_log_file_name
            ;;
        ERROR)
            # Log error to both info and debug
            echo "(PID: $$) ${dateTime} - [ERROR]: $log_message" > /dev/stderr
            echo "(PID: $$) ${dateTime} - [ERROR]: $log_message" >> $log_directory/$info_log_file_name
            echo "(PID: $$) ${dateTime} - [ERROR]: $log_message" >> $log_directory/$debug_log_file_name
            ;;
        WARNING)
            # Log warnings to info and debug
            echo "(PID: $$) ${dateTime} - [WARNING]: $log_message" 
            echo "(PID: $$) ${dateTime} - [WARNING]: $log_message" >> -a $log_directory/$info_log_file_name
            echo "(PID: $$) ${dateTime} - [WARNING]: $log_message" >> tee -a $log_directory/$debug_log_file_name
            ;;  
        *)
            echo "(PID: $$) ${dateTime} Unknown log level [$log_level] for message: $log_message" >> $log_directory/$debug_log_file_name
            ;;
    esac
}

function log_info() {
    log_message=$1
    if [[ -z "${1}" ]]
    then
        echo "${dateTime} - LOGGING ERROR: No info log message provided!"
    else 
        log "INFO" "$log_message"
    fi
}

function log_debug() {
    log_message=$1
    if [[ -z "${1}" ]]
    then
        echo "${dateTime} - LOGGING ERROR: No debug log message provided!"
    else 
        log "DEBUG" "$log_message"
    fi
}

function log_error() {
    log_message=$1
    if [[ -z "${1}" ]]
    then
        echo "${dateTime} - LOGGING ERROR: No error log message provided!"
    else 
        log "ERROR" "$log_message"
    fi
}

function log_warning() {
    log_message=$1
    if [[ -z "${1}" ]]
    then
        echo "${dateTime} - LOGGING ERROR: No warning log message provided!"
    else 
        log "WARNING" "$log_message"
    fi
}