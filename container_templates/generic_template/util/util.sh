#!/bin/bash
# 


function log_mq() {
    log_level=${1}
    msg=${2}
    input_file=${3}
    source_file=${4}
    line_no=${5}


    if [ $log_level == "Error" ]; then
        mq_log="Error"
    else
        mq_log="Log"
    fi

    
    # format message in json format    
    timestamp=$(date --utc +%FT%T.%3NZ)
    json_template='{"time":"%s","level":"%s","message":"%s","input_file":"%s","file":"%s","line":"%s","machine":"%s","step":"%s"}'
    message_formatted=$(printf "$json_template" "$timestamp" "$log_level" "$msg" "$input_file" "$source_file" "$line_no" "$HOSTNAME" "$STEP_NAME")

    # send it to the Error/Log message queue
    kubetools queue send "${mq_log}" "${message_formatted}"
}


log_error() {
    log_mq "Error" "$@"
}

log_warning() {
    log_mq "Warning" "$@"
}

log_info() {
    log_mq "Info" "$@"
}

handle_error() {
    log_error "$@"
    exit 1
}


# Simple function to fetch a file from a given directory 
fetch_file() {
    directory=${1}
    file_spec=${2}
    nfiles="$(find "${directory}" -name "${file_spec}" | wc -l)"

    
    if [ "${nfiles}" -gt "0" ]; then
        # Extract File Name in random pos
        file_num=`shuf -i1-${nfiles} -n1`
        path="$(find "${directory}" -name "${file_spec}" | head "-${file_num}" | tail -1)"
        file=${path##*/}
    fi

    echo "$file"
}


