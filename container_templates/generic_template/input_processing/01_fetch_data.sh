#!/bin/bash

echo '***'

echo '#'
echo '#   Fetch data'   
echo '#'

# can be added as comand line argument but we can hardcode for the moment
work_directory="./work"




#based on transmission medium we call the right adaptors 
      if [[ $1 == "file_system" ]];then 
         echo "Data transmission medium is file system"
           ./adapters/DT_adapters/dt_file_system.sh 
           # adaptor -based on the above
               # adopter.sh should have a function (getData)
      fi  
       








#import log util functions 
. util/util.sh


 # # Check if there are files to process in the input directory
 #    file_name=$(fetch_file "${input_directory}" "30")  
 #    echo $file_name


# if [ -n "${file_name}" ]; then    
# 	echo "// File to process: ${file_name}"

# 	 # Construct Paths
#     input_path=${file_directory}/${file_name}
#     work_path=${work_directory}/${file_name}

#     # Check if file already there
#     found_existing="$(find "${work_directory}" -name "${file_name}" | wc -l)"




# else
#     echo "// No file to process"
#     exit 1
# fi