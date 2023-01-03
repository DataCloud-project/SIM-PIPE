#!/bin/bash

# echo '***'
# echo "Data adapter for file system"
# input_folder -mounted to the container already so it's a local folder 
		# ENV_VAR  "input_folder" absolute path within the container 
		#file_name  - we get from message queue	
    	#ENV_VAR COMMUNICATION_MEDIUM if kubemq
    			#then load cm_kubemq.sh
    			#else load something else -exit with an error for the moment as we don;t have other cm adapters "Unknown comm medium" 

# readData -> call readMessage for fileName from the right adapter
# writeData(data,target) -> moving a file from one place to another; it need location present_location and target_location

# Initializes the data transmission medium adapter
function init_dtm_adapter() {
	# Check if initialization is marked done
	if [[ -z "$init_dtm_done" ]]; then 
		# Get the base code directory
		code_directory=${BDPF_CODE_DIRECTORY}

		# Import logging functions
		. ${code_directory}/util/logging.sh
		log_info "Initializing File System data transmission medium adapter ..."

		# Check the communication medium of the step
		communication_med=${BDPF_COMMUNICATION_MEDIUM}

		log_info "Importing communication medium adapter ..."
		# Import the respective communication medium adapter
		case $communication_med in
			kubemq)
				log_debug "Using communication medium: KubeMQ"
				. ${code_directory}/adapters/CM_adapters/cm_kubemq.sh
				
				;;  

			*)
				log_error "Unknown communication medium"
				exit 1
				;;
		esac
		# Initialize communication medium adapter
		init_cm_adapter

		# Initialization marked done
		init_dtm_done=1
	fi
}

# Reads data input coming from a previous step
function read_data() {
	# check if first step by asking from communication medium to get the input communication
	if [[ -z "${MQ_READ}" ]]; then
		MY_SCRIPT_VARIABLE="Some default value because DEPLOY_ENV is undefined"
	else
		MY_SCRIPT_VARIABLE="${DEPLOY_ENV}"
	fi
	# if first step, get data from input folder
	# if not first step, check communication medium for messages
}

# Writes data to a target location
# Signature: write_data [data] [target_folder_location]
function write_data() {
	data = $1
	target = $2
}

