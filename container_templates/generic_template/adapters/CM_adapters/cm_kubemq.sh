#!/bin/bash


echo '***'


code_directory=${1}

echo "KUBEMQ_HOST: $KUBEMQ_HOST"

# the kubemq cli tools requies configured .config.yaml to be in the WORKDIR  
# the default KubeMQ server address is localhost, we need to that address with the right value from $KUBEMQ_HOST 
# environment varialble before moving the config file into the WORKDIR

# Replace localhost text by KubeMQ server address and created a new config
if [ -n "${KUBEMQ_HOST}" ]; then
    sed "s/localhost/$KUBEMQ_HOST/g" <${code_directory}/configs/config_kubetools.yaml >/.config.yaml
fi










# # inject it via ENV_VAR ; mq_read = ENV_VAR 

# # example output of kubetools when there is a message in the queue
# #-----------------------------------------------------------------
# # 2020/05/01 15:45:51 receiving queue message from hello-world-queue channel
# # 2020/05/01 15:45:51 received 1 messages, 0 messages Expired 
# # 2020/05/01 15:45:51 queue message received:
# # 	this is a queue message 1
# #-----------------------------------------------------------------

# # to get the message, get a line next to a line having key words of 'queue message received' and trim the trailing indentation
# message=$(kubetools queue receive "${mq_read}" 2>&1 | awk '/queue message received/{getline; print}' | awk '{$1=$1;print}')

# echo ${message}





#function readMessage(){  message  } 







#function writeMessage(message) {  what message to write mq_write 
#ENV_VAR = mq_write 
#
#}









# ## function for notifying next step 

# mq_write=${1}
# message=${2}

# # example output of kubetools when there is a message in the queue
# #-----------------------------------------------------------------
# # 2020/05/01 17:23:43 queue message sent at: 2020-05-01 17:23:43.951256941 +0200 CEST
# #-----------------------------------------------------------------

# # if the message successfully, it will return a line having key words of 'queue message sent'
# result=$(kubetools queue send "${mq_write}" "${message}" 2>&1 | grep 'queue message sent')

# echo ${result}




########### util (need to figure out the best structure)
# log()
# {
#     log_level=${1}
#     msg=${2}
#     input_file=${3}
#     source_file=${4}
#     line_no=${5}


#     if [ $log_level == "Error" ]; then
#         mq_log="Error"
#     else
#         mq_log="Log"
#     fi


#     # format message in json format    
#     timestamp=$(date --utc +%FT%T.%3NZ)
#     json_template='{"time":"%s","level":"%s","message":"%s","input_file":"%s","file":"%s","line":"%s","machine":"%s","step":"%s"}'
#     message_formatted=$(printf "$json_template" "$timestamp" "$log_level" "$msg" "$input_file" "$source_file" "$line_no" "$HOSTNAME" "$STEP_NAME")

#     # send it to the Error/Log message queue
#     kubetools queue send "${mq_log}" "${message_formatted}"
# }


# log_error()
# {
#     log "Error" "$@"
# }

# log_warning()
# {
#     log "Warning" "$@"
# }

# log_info()
# {
#     log "Info" "$@"
# }

# handle_error()
# {
#     log_error "$@"
#     exit 1
# }
