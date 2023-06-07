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
    ''' Regex: pipeline name'''
    pipeline_name = re.finditer('Pipeline [a-zA-Z]+', response)
    pipeline_name_extracted = ''
    for match in pipeline_name:
        pipeline_name_extracted = match.group().split(' ')[1]
    pipeline_description = init(pipeline_name_extracted)

    ''' Regex: step name'''
    matched_stepnames = list(re.finditer('step [a-zA-Z_]+', response))
    ''' Regex: image names of steps'''
    matched_imagenames = list(re.finditer('implementation: container-implementation\s*image:\s*\'+(.+)\'+', response))
    ''' Regex: previous/dependency of steps'''
    matched_dependencies = list(re.finditer('previous:\s*\[(([a-zA-Z\s,_]+))\]', response))
    response = re.sub('\n', ' ', response)
    response = re.sub('\t', ' ', response)
    ''' Regex: env list of steps'''
    matched_envlist = list(re.finditer("step ([a-zA-Z_]+)[^{]*environmentParameters: ({[^}]+})", response))
    if( not (len(matched_stepnames) == len(matched_imagenames) == (len(matched_dependencies) + 1))):
        return "error", "Given pipeline description is not valid/complete"
    # go through each set of matches and assign attributes to current step
    env_list_index = 0 # every step need not have an env_list, so a separate index to retreive matched env listpy
    for index, matched_name in enumerate(matched_stepnames):
        steplist.append({})
        stepname = matched_name.group().split(' ')[1]
        # step name
        steplist[index]['name'] = re.sub('[^0-9a-zA-Z-]+', '', stepname)
      
        # dependencies
        if index > 0:
            steplist[index]["dependencies"] = re.sub('(_|\s)*', '', matched_dependencies[index-1][1]).split(',')

        pipeline_description["spec"]["templates"].append({})

        # image name
        if(matched_imagenames[index].group().split(' ')[1] == 'container-implementation'):  
            imagename = re.sub('[^0-9a-zA-Z-/:.]+', '', matched_imagenames[index].group().split(' ')[3])
            valid_argo_name = re.sub('[^0-9a-zA-Z-]+', '', matched_imagenames[index].group().split(' ')[3])
            steplist[index]['template'] = valid_argo_name + '-template' + str(index)
            pipeline_description["spec"]["templates"][index]['name'] = valid_argo_name + '-template' + str(index)
            pipeline_description["spec"]["templates"][index]['container'] = {}
            pipeline_description["spec"]["templates"][index]['container']['image'] = imagename
            # TODO: this has to be replaced to make it work without 'command'
            pipeline_description["spec"]["templates"][index]['container']['command'] = [ 'sh' ]

        # env list (if present for the step)
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
    # uncomment if needed to yaml file as output
    # with open(r'output.yaml', 'w') as file:
    # documents = yaml.dump(pipeline_description, file)
    return pipeline_description

# response with docker/whalesay images
# defpipe_response = "Pipeline Pilot Pipeline for Testing  {\n\tcommunicationMedium: medium \n\tsteps:\n\t\t- data-processing step Data_Analysis\n\t\t\timplementation: container-implementation image: 'data-analysis'\n\t\t\tenvironmentParameters: {\n\n\t\t\t}\n\t\t\tresourceProvider: \n\t\t\texecutionRequirement:\n\t\t\t\thardRequirements:\t\t\t\t\t\n\t\t\t\t\tnetworkRequirement:\n\t\t\t\t\t\tmin-bandwidth: 20\n\t\t\t\t\t\tmax-bandwidth: 100\n\t\t\t\t\t\tmin-latency: 10\n\t\t\t\t\t\tmax-latency: 20\n\n\n\t\t- data-processing step Digital_Twins\n\t\t\timplementation: container-implementation image: 'simulation'\n\t\t\tenvironmentParameters: {\n\n\t\t\t}\n\t\t\tresourceProvider: \n\t\t\texecutionRequirement:\n\t\t\t\thardRequirements:\t\t\t\t\t\n\t\t\t\t\thorizontalScale:\n\t\t\t\t\t\tmin-instance: 10\n\t\t\t\t\t\tmax-instance: 1000\n\t\t\tprevious: [Data Analysis]\n\n\t\t- data-processing step What-If_Analysis\n\t\t\timplementation: container-implementation image: 'what-if-analysis'\n\t\t\tenvironmentParameters: {\n\n\t\t\t}\n\t\t\tresourceProvider: \n\t\t\texecutionRequirement:\n\t\t\t\thardRequirements:\t\t\t\t\t\n\t\t\t\t\tnetworkRequirement:\n\t\t\t\t\t\tmin-bandwidth: 30\n\t\t\t\t\t\tmax-bandwidth: 100\n\t\t\t\t\t\tmin-latency: 20\n\t\t\t\t\t\tmax-latency: 30\n\t\t\tprevious: [Digital Twins]\n}\n\nCloudProvider Cloud Service {\n\tproviderLocation: 'x'\n\tmappingLocation: 'x'\n}\n\nEdgeProvider 2nd {\n\tproviderLocation: 'aa'\n\tmappingLocation: 'aa'\n}"
defpipe_response = "Pipeline Jot_Pipeline {\n\tcommunicationMedium: medium \n\tsteps:\n\t\t- data-processing step DataCleaning_Conv\n\t\t\timplementation: container-implementation image: 'flaskappconv:latest'\n\t\t\tenvironmentParameters: {\n\t\t\t\t: 'conversions'\n\t\t\t}\n\t\t\tresourceProvider: misha\n\t\t\texecutionRequirement:\n\t\t\t\thardRequirements:\t\t\t\t\t\n\n\n\t\t- data-processing step DataCleaning_Stats\n\t\t\timplementation: container-implementation image: 'flaskappstat:latest'\n\t\t\tenvironmentParameters: {\n\t\t\t\t: 'statistics'\n\t\t\t}\n\t\t\tresourceProvider: misha\n\t\t\texecutionRequirement:\n\t\t\t\thardRequirements:\t\t\t\t\t\n\t\t\tprevious: [DataCleaning_Conv]\n\n\t\t- data-processing step DataCleaning_Rev\n\t\t\timplementation: container-implementation image: 'flaskapprev:latest'\n\t\t\tenvironmentParameters: {\n\t\t\t\t: 'revenue'\n\t\t\t}\n\t\t\tresourceProvider: misha\n\t\t\texecutionRequirement:\n\t\t\t\thardRequirements:\t\t\t\t\t\n\t\t\tprevious: [DataCleaning_Conv, DataCleaning_Stats]\n}\n\n"
argo_data = convert(defpipe_response)

yaml_output = yaml.dump(argo_data, sort_keys=False) 

print(yaml_output) 
''' example output
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  generateName: test-pipeline-
spec:
  entrypoint: steps
  templates:
  - name: flaskappconvlatest-template0
    container:
      image: flaskappconv:latest
      command:
      - sh
  - name: flaskappstatlatest-template1
    container:
      image: flaskappstat:latest
      command:
      - sh
  - name: flaskapprevlatest-template2
    container:
      image: flaskapprev:latest
      command:
      - sh
  - name: steps
    dag:
      tasks:
      - name: DataCleaningConv
        template: flaskappconvlatest-template0
      - name: DataCleaningStats
        dependencies:
        - DataCleaningConv
        template: flaskappstatlatest-template1
      - name: DataCleaningRev
        dependencies:
        - DataCleaningConv
        - DataCleaningStats
        template: flaskapprevlatest-template2
'''
