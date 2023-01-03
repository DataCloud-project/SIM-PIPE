#!/bin/bash

# Get the base code directory
code_directory=${BDPF_CODE_DIRECTORY}

# Import logging functions
. ${code_directory}/util/logging.sh

log_info "Fetching data started ..."

dt_med=${BDPF_DATA_TRANSMISSION_MEDIUM}

case $dt_med in
	file_system)
		log_debug "Using data transmission medium: File System"
		. ${code_directory}/adapters/DT_adapters/dt_file_system.sh
		
		;;  

	*)
		log_error "Unknown or unset data transmission medium: ${dt_med}"
		exit 1
		;;
esac

init_dtm_adapter



log_info "Fetching data finished ..."

# echo '***'

# echo '#'
# echo '#   Fetch data'   
# echo '#'

# can be added as comand line argument but we can hardcode for the moment
# work_directory="./work"
# input_directory="./in"
# file_name="sample.zip"



# #based on transmission medium we call the right adaptors 
#       if [[ $1 == "file_system" ]];then 
#          echo "Data transmission medium is file system"
#            ./adapters/DT_adapters/dt_file_system.sh 
#            # adaptor -based on the above
#                # adopter.sh should have a function (getData)
#       fi  
       








# #import log util functions 
# . util/util.sh


#  # # Check if there are files to process in the input directory
#    echo "01_fetch_data -Check if there are files to process in the input directory-"
#     file_name=$(fetch_file "${input_directory}" "${file_name}")  
#     echo $file_name


# if [ -n "${file_name}" ]; then    
# 	echo "// File to process: ${file_name}"
#    log_info "Got a file name to be processed" "${file_name}" "$0"

# 	 # Construct Paths
#     input_path=${input_directory}/${file_name}
#     work_path=${work_directory}/${file_name}

#     # Check if file already there
#     found_existing="$(find "${work_directory}" -name "${file_name}" | wc -l)"



#     if [ "${found_existing}" -eq "0" ]; then

#         # Move to Workspace
#         echo "  Moving to Workspace ${input_path} ${work_path}"
#         mv ${input_path} ${work_path} \
#             || handle_error "Error in moving file ${input_path} into workspace ${work_path}" "${file_name}"

#         log_info "File moved to workspace" "${file_name}" "$0"
      

#     else
#         echo "// File ${file_name} already exists in working dir ... skipping operation"        
#         log_warning "File already exists in working dir ... skipping operation" "${file_name}" "$0" "$LINENO"

#         exit 1
#     fi


# else
#     echo "// No file to process"
#     exit 1
# fi