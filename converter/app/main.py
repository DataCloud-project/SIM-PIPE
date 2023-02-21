from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Body

import re
import json
app = FastAPI()

# added allowed origin as * for now, TODO: later can be modified to have the ip of the svelte frontend server
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=["POST"],
    allow_headers=["*"],
)

@app.post("/convert/")
def converter(response: str = Body()):
    (code, pipeline_description) = convert(json.loads(response)['response'])
    return code, pipeline_description

def convert(response):
    if( response is None):
        return "error", "Given pipeline description is empty"

    pipeline_description = {}
    steps = []
    pipeline_name = re.finditer('Pipeline [a-zA-Z]+', response)
    for match in pipeline_name:
        pipeline_description["name"] = match.group().split(' ')[1]

    # extract relevant information using string matching
    matched_stepnames = list(re.finditer('step [a-zA-Z]+', response))
    matched_imagenames = list(re.finditer('implementation: container-implementation\s*image:\s*\'+(.+)\'+', response))
    response = re.sub('\n', ' ', response)
    response = re.sub('\t', ' ', response)
    matched_envlist = list(re.finditer("step ([a-zA-Z]+)[^{]*environmentParameters: ({[^}]+})", response))

    if( not (len(matched_stepnames) == len(matched_imagenames))):
        return "error", "Given pipeline description is not valid"

    # go through each set of matches and assign attributes to current step
    env_list_index = 0 # every step need not have an env_list, so a separate index to retreive matched env list
    for index, matched_name in enumerate(matched_stepnames):
        steps.append({})

        # step name
        steps[index]["name"] = matched_name.group().split(' ')[1]
        """
        Dependency and step number are not provided in def-pipe response currently.
        Step_number is therefore assumed as the order of appearance.
        Prerequisite is also filled in this way
        TODO: this should be changed when DEF-PIPE gets updated with relavant values
        """ 
        steps[index]["step_number"] = index + 1 
        if index > 0:
            steps[index]["prerequisite"] = [steps[index-1]["step_number"]] 

        # image name
        if(matched_imagenames[index].group().split(' ')[1] == 'container-implementation'):    
            steps[index]["image"] = matched_imagenames[index].group().split(' ')[3]

        # env 
        # check if the current step has any env list specified
        if(matched_envlist[env_list_index][1] == steps[index]["name"]):
            matches = re.split(r' |: |{|}|\'|,', matched_envlist[env_list_index][2])
            matches = list(filter(None, matches))
            env_list = []
            if (len(matches) > 1): # some parameters are given
                for i in range(0, len(matches), 2):
                    env_list.append('='.join([matches[i], matches[i+1]]))
                steps[index]["env"] = env_list
            env_list_index += 1 # increase env_list only if matched
        else:
            steps[index]["env"] = []    #no environmentParameters specified for current step
    pipeline_description["steps"] = steps
    return "success", pipeline_description
