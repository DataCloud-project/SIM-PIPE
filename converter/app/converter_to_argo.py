import yaml
import re

def init(pipeline_name):
    # default configs for argo workflow template
    pipeline_description = {"apiVersion": 'argoproj.io/v1alpha1', "kind": 'Workflow' }
    pipeline_description["metadata"] = {}
    pipeline_name = 'test-pipeline'
    pipeline_description["metadata"]['generateName'] = pipeline_name + '-'
    pipeline_description["spec"] = {}
    pipeline_description["spec"]["entrypoint"] = 'steps'  
    pipeline_description["spec"]["templates"] = []
    return pipeline_description

def convert(response):
    if( response is None):
        return "error", "Given pipeline description is empty"
    steplist = []
    pipeline_name = re.finditer('Pipeline [a-zA-Z]+', response)
    pipeline_name_extracted = ''
    for match in pipeline_name:
        pipeline_name_extracted = match.group().split(' ')[1]
    pipeline_description = init(pipeline_name_extracted)

    # extract relevant information using string matching
    matched_stepnames = list(re.finditer('step [a-zA-Z_]+', response))
    matched_imagenames = list(re.finditer('implementation: container-implementation\s*image:\s*\'+(.+)\'+', response))
    response = re.sub('\n', ' ', response)
    response = re.sub('\t', ' ', response)
    matched_envlist = list(re.finditer("step ([a-zA-Z_]+)[^{]*environmentParameters: ({[^}]+})", response))
   
    if( not (len(matched_stepnames) == len(matched_imagenames))):
        return "error", "Given pipeline description is not valid"

    # go through each set of matches and assign attributes to current step
    env_list_index = 0 # every step need not have an env_list, so a separate index to retreive matched env listpy
    for index, matched_name in enumerate(matched_stepnames):
        steplist.append({})
        stepname = matched_name.group().split(' ')[1]
        # step name
        steplist[index]['name'] = re.sub('[^0-9a-zA-Z-]+', '', stepname)

        """
        Dependency is not provided in def-pipe response currently.
        Prerequisite is assumed as the order of appearance.
        TODO: this should be changed when DEF-PIPE gets updated with relavant values
        """ 
        if index > 0:
            steplist[index]["dependencies"] = [steplist[index-1]["name"]]

        pipeline_description["spec"]["templates"].append({})

        # image name
        if(matched_imagenames[index].group().split(' ')[1] == 'container-implementation'):  
            imagename = re.sub('[^0-9a-zA-Z-/]+', '', matched_imagenames[index].group().split(' ')[3])
            valid_argo_name = re.sub('[^0-9a-zA-Z-]+', '', matched_imagenames[index].group().split(' ')[3])
            steplist[index]['template'] = valid_argo_name + '-template' + str(index)
            pipeline_description["spec"]["templates"][index]['name'] = valid_argo_name + '-template' + str(index)
            pipeline_description["spec"]["templates"][index]['container'] = {}
            pipeline_description["spec"]["templates"][index]['container']['image'] = imagename
            # TODO: this has to be replaced to make it work without 'command'
            pipeline_description["spec"]["templates"][index]['container']['command'] = [ 'sh' ]

        # env 
        # check if the current step has any env list specified
        # if(matched_envlist[env_list_index][1] == pipeline_description["spec"]["templates"][index]['name']):
        if(matched_envlist[env_list_index][1] == stepname):
            matches = re.split(r' |: |{|}|\'|,', matched_envlist[env_list_index][2])
            matches = list(filter(None, matches))
            env_list = []
            if (len(matches) > 1): # some parameters are given
                for i in range(0, len(matches), 2):
                    env_list.append({'name': matches[i], 'value': matches[i+1]})
                pipeline_description["spec"]["templates"][index]['container']['env'] = env_list 
            env_list_index += 1 # increase env_list only if matched
    
    pipeline_description["spec"]["templates"].append({'name': 'steps', 'dag': {'tasks': steplist}})

    with open(r'output.yaml', 'w') as file:
        documents = yaml.dump(pipeline_description, file)
    return pipeline_description

# testing with def-pipe response format
# response with actual jot container images (can be used once secret is implemented)
# response = "Pipeline Jot_Pipeline {\n\tcommunicationMedium: medium \n\tsteps:\n\t\t- data-processing step DataCleaning_Conv\n\t\t\timplementation: container-implementation image: 'flaskappconv:latest'\n\t\t\tenvironmentParameters: {\n\t\t\t\t: 'conversions'\n\t\t\t}\n\t\t\tresourceProvider: misha\n\t\t\texecutionRequirement:\n\t\t\t\thardRequirements:\t\t\t\t\t\n\n\n\t\t- data-processing step DataCleaning_Stats\n\t\t\timplementation: container-implementation image: 'flaskappstat:latest'\n\t\t\tenvironmentParameters: {\n\t\t\t\t: 'statistics'\n\t\t\t}\n\t\t\tresourceProvider: misha\n\t\t\texecutionRequirement:\n\t\t\t\thardRequirements:\t\t\t\t\t\n\n\n\t\t- data-processing step DataCleaning_Rev\n\t\t\timplementation: container-implementation image: 'flaskapprev:latest'\n\t\t\tenvironmentParameters: {\n\t\t\t\t: 'revenue'\n\t\t\t}\n\t\t\tresourceProvider: misha\n\t\t\texecutionRequirement:\n\t\t\t\thardRequirements:\t\t\t\t\t\n\n}\n\n"

# response with docker/whalesay images
defpipe_response = "Pipeline Jot_Pipeline {\n\tcommunicationMedium: medium \n\tsteps:\n\t\t- data-processing step DataCleaning_Conv\n\t\t\timplementation: container-implementation image: 'docker/whalesay'\n\t\t\tenvironmentParameters: {\n\t\t\t\tenv2: 'conversions'\n\t\t\t}\n\t\t\tresourceProvider: misha\n\t\t\texecutionRequirement:\n\t\t\t\thardRequirements:\t\t\t\t\t\n\n\n\t\t- data-processing step DataCleaning_Stats\n\t\t\timplementation: container-implementation image: 'docker/whalesay'\n\t\t\tenvironmentParameters: {\n\t\t\t\tenv3: 'statistics'\n\t\t\t}\n\t\t\tresourceProvider: misha\n\t\t\texecutionRequirement:\n\t\t\t\thardRequirements:\t\t\t\t\t\n\n\n\t\t- data-processing step DataCleaning_Rev\n\t\t\timplementation: container-implementation image: 'docker/whalesay'\n\t\t\tenvironmentParameters: {\n\t\t\t\tenv1: 'revenue'\n\t\t\t}\n\t\t\tresourceProvider: misha\n\t\t\texecutionRequirement:\n\t\t\t\thardRequirements:\t\t\t\t\t\n\n}\n\n"
argo_data = convert(defpipe_response)

yaml_output = yaml.dump(argo_data, sort_keys=False) 

print(yaml_output) 

# problem with dependencies, check list notation
