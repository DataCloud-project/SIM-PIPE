#!/bin/bash


echo '***'

echo '#'
echo '#   Init configs'   
echo '#'

echo "KUBEMQ_HOST: $KUBEMQ_HOST"

# the kubemq cli tools requies configured .config.yaml to be in the WORKDIR  
# the default KubeMQ server address is localhost, we need to that address with the right value from $KUBEMQ_HOST 
# environment varialble before moving the config file into the WORKDIR

# Replace localhost text by KubeMQ server address and created a new config
if [ -n "${KUBEMQ_HOST}" ]; then
    sed "s/localhost/$KUBEMQ_HOST/g" <${code_directory}/configs/config_kubetools.yaml >/.config.yaml
fi
