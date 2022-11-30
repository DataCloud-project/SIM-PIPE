#!/bin/bash


echo '***'
echo "Data adapter for file system"

# input_folder -mounted to the container already so it's a local folder 
		# ENV_VAR  "input_folder" absolute path within the container 
		#file_name  - we get from message queue	
    	#ENV_VAR COMMUNICATION_MEDIUM if qubemq
    			#then load cm_kubemq.sh
    			#else load something else -exit with an error for the moment as we don;t have other cm adapters "Unknown comm medium" 


# readData -> call readMessage for fileName from the right adapter
# writeData(data,target) -> moving a file from one place to another; it need location present_location and target_location

