#!/bin/bash


echo '***'

echo '#'
echo '#   The start of a new era'   
echo '#'


#EVN VARS relative to the pipeline, not to the entire environment 

STEP_NAME="01_fetch_data.sh"
data_transmission_env="file_system"

# env vars  (    
# STEP_NAME=...
 




#Initialize configuration files 
# ./init_configs.sh




# Trigger for starting the process 
	
	#fetch the data 
	data_location=$(./input_processing/01_fetch_data.sh $data_transmission_env)
		# data_location = "./input_processing/${STEP_NAME}" 


echo "$data_location"
	#move to processing 
		#
	#./input_processing/02_move_to_workspace.sh  data_location
		#if move_to_workspace = true 
				#process the data 
				./step_action/04_execute_processing.sh 
		 #else
		 	#throw error

