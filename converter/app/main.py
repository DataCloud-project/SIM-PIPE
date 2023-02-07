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
    # print('response received in fast API')
    # print(response)
    # response = str(response)
    # response = json.loads(response)["data"]
    # response = json.loads(response)

    pipeline_description = {}
    steps = []

    pipeline_name = re.finditer('Pipeline [a-zA-Z]+', response)
    for match in pipeline_name:
        pipeline_description["name"] = match.group().split(' ')[1]

    # extract relevant information based on string matching
    matched_stepnames = list(re.finditer('step [a-zA-Z]+', response))
    matched_imagenames = list(re.finditer('implementation: container-implementation image: \'[a-zA-Z\.:0-9]+\'', response))
    response = re.sub('\n', '', response)
    response = re.sub('\t', '', response)
    matched_envlist = list(re.finditer("environmentParameters: {[^}]+}", response))

    if( not (len(matched_stepnames) == len(matched_imagenames) == len(matched_envlist))):
        return "error", "Given input is not valid"
        
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
        matches = re.split(r' |: |{|}|\'|,', matched_envlist[index].group())
        matches = list(filter(None, matches))
        env_list = []
        if (len(matches) > 1): # some parameters are given
            for i in range(1, len(matches), 2):
                env_list.append('='.join([matches[i], matches[i+1]]))
            steps[index]["env"] = env_list

    pipeline_description["steps"] = steps
    print('finished parsing')
    print(pipeline_description)
    return "success", pipeline_description
