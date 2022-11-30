#!/bin/bash

echo '***'

echo '#'
echo '#   Move to workspace'   
echo '#'


    # Move to Workspace
        echo "  Moving to Workspace ${input_path} ${work_path}"
        mv ${input_path} ${work_path} \
            || handle_error "Error in moving file ${input_path} into workspace ${work_path}" "${file_name}" "$0" "$LINENO"

        log_info "File moved to workspace" "${file_name}" "$0"