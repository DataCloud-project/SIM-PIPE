#!/bin/bash
# arg1: running frequency
# arg2: sandbox directory 
# arg3: code directory             
# arg4: input directory
# arg5: work directory
# arg6: output directory
# arg7: message queue read
# arg8: message queue write

# arg9 ... : application params

frequency=${1}
sandbox_directory=${2}
code_directory=${3}
input_directory=${4}
work_directory=${5}
output_directory=${6}
mq_read=${7}
mq_write=${8}

echo '***'

echo '#'
echo '#   Starting: main'
echo '#'

echo "frequency: ${frequency} seconds"
echo "sandbox_directory: ${sandbox_directory}"
echo "code_directory: ${code_directory}"
echo "input_directory: ${input_directory}"
echo "work_directory: ${work_directory}"
echo "output_directory: ${output_directory}"
echo "mq_read: ${mq_read}"
echo "mq_write: ${mq_write}"
echo '***'

# Remove first argument to make it easy to pass the remaining params
shift 1

# Initialize configuration files
${code_directory}/init_configs.sh "${code_directory}"

# What files to look for ?
echo "Fetching file pattern from: ${code_directory}/get_input_file_spec.sh"
input_file_spec=$(${code_directory}/get_input_file_spec.sh)
echo "Got filepattern: ${input_file_spec}"


while :; do

    # Call script to find a file and process it 
    "${code_directory}/fetch_process.sh" "${input_file_spec}" "${code_directory}/process_job.sh" "$@"
    
    retn_code=$?
    if [ ${retn_code} -eq 0 ]; then
        # File processed ... try next          
        echo "File processed successfully"
    else
        if [ ${frequency} -gt 0 ]; then
            # No file processed ... wait
            sleep ${frequency}     
        else
            # Exit loop if frequency is not provided
            echo "Exit from main loop, no frequency provided"
            break
        fi
    fi

done
