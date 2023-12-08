import os
import yaml
import json
import subprocess

# import asyncio # TODO: rewite to use async calls
from pathlib import Path


class Kwok:
    """
    Start a kwok cluster and run and simulate an argo workflow on the cluster.
    """

    runtime = "kind"
    argo_version = "v3.4.13"
    config_yaml = "config/stages.yaml"
    nodes_yaml = "config/nodes.yaml"
    controlplane_node_name = "kwok-kwok-control-plane"
    basic_configuration_file = "~/.kwok/kwok.yaml"
    steps = [
        {
            "name": "create cluster",
            "command": f"kwokctl create cluster --runtime {runtime} --config {config_yaml}",
        },
        {"name": "define nodes", "command": f"kubectl apply -f {nodes_yaml}"},
        {
            "name": "create namespace for argo",
            "command": "kubectl create namespace argo",
        },
        {
            "name": "install argo",
            "command": f"kubectl apply -n argo -f https://github.com/argoproj/argo-workflows/releases/download/{argo_version}/install.yaml",
        },
        {
            "name": "migrate argo-server onto control plane",
            "command": 'kubectl patch deploy argo-server -n argo --type=json -p [{"op":"add","path":"/spec/template/spec/nodeName","value":"kwok-kwok-control-plane"}]',
        },
        {
            "name": "migrate workflow-controller onto control plane",
            "command": 'kubectl patch deploy workflow-controller -n argo --type=json -p [{"op":"add","path":"/spec/template/spec/nodeName","value":"kwok-kwok-control-plane"}]',
        },
    ]

    logs = []
    workflow = None  # input workflow
    workflow4kwok = None  # modified workflow
    _workflow_4kwok_filename = ".kwok-workflow.yaml"
    workflow_name = None  # name of the workflow submitted to kwok
    _simulation_status = None  # status of the simulation (json)

    def __init__(self, argo_workflow_file: str = None, runtime: str = runtime):
        if runtime:
            self.runtime = runtime
        if argo_workflow_file:
            self.load_workflow(argo_workflow_file)
        self.start_kwok_cluster()

    def setup_simulation(self):
        # setup simulation parameters
        pass

    def run_simulation(self):
        """Run workflow on kwok cluster"""
        self._write_workflow()  # create tmp local workflow file
        self.call_argo(
            f"argo submit {self._workflow_4kwok_filename}"
        )  # submit workflow to kwok cluster
        # self._delete_workflow()  # delete the tmp local workflow
        self.get_submitted_workflow_name()
        self._delete_workflow()  # delete the tmp local workflow

    def is_simulation_complete(self) -> bool:
        """Check if the simulation is complete
        Also sets the simulation progress status json object
        """
        raw_json_string = self.get_results(output_format="json")
        j = json.loads(raw_json_string)
        self._simulation_status = j["status"]
        phase = None
        try:
            phase = self._simulation_status["phase"]
        except KeyError:
            pass
        if phase == "Succeeded":
            return True
        else:
            return False

    def get_simulation_progress(self) -> str:
        """Get the progress of the simulation"""
        return self._simulation_status

    def get_results(self, output_format: str = None):
        """Get the results of the simulation"""
        if output_format == "json":
            proc = self.call_argo(f"argo get {self.workflow_name} -o json")
        elif output_format == "yaml":
            proc = self.call_argo(f"argo get {self.workflow_name} -o yaml")
        else:
            proc = self.call_argo(f"argo get {self.workflow_name}")

        return proc.stdout.decode("utf-8")

    def get_submitted_workflow_name(self):
        """Get the name of the workflow submitted to kwok
        Call this after submitting the workflow
        """
        proc = self.call_argo("argo list @latest -o json")
        j = json.loads(proc.stdout.decode("utf-8"))
        self.workflow_name = j[0]["metadata"]["name"]
        return self.workflow_name

    def update_kwok_config(self):
        """Update the kwok config file"""
        # TODO: This updates the config file. However, somehow it does not update the kwok cluster!
        # This seem to be a bug in kwokctl. Need to investigate.
        self.call_kwokctl(f"kwokctl config tidy --config {self.config_yaml}")

    def _write_workflow(self, output_file: str = None):
        """Write the workflow to a temporary file"""
        if output_file is None:
            self._workflow_4kwok_filename = ".kwok_workflow.yaml"
        else:
            ifile = Path(output_file)
            self._workflow_4kwok_filename = (
                ifile.parent / f"{ifile.stem}_kwok_inputworkflow{ifile.suffix}"
            )

        with open(self._workflow_4kwok_filename, "w") as f:
            yaml.dump(self.workflow4kwok, f)

    def _delete_workflow(self):
        """Delete the temporary workflow file"""
        os.remove(self._workflow_4kwok_filename)

    def collect_logs(
        self,
        completed_process: subprocess.CompletedProcess,
        print_json_logs: bool = True,
        print_std_logs: bool = True,
    ):
        """Collect logs from completed process"""
        for i in completed_process.stdout.decode("utf-8").split("\n"):
            if i != "":
                try:
                    log_entry = json.loads(i)
                    if print_json_logs:
                        print(
                            "{level} {time} {msg}".format(
                                level=log_entry["level"],
                                time=log_entry["time"],
                                msg=log_entry["msg"],
                            )
                        )
                    self.logs.append(log_entry)
                except json.JSONDecodeError:
                    if print_std_logs:
                        print(i)

    def start_kwok_cluster(self):
        """start kwok cluster"""
        for step in self.steps:
            print(f"Running step: {step['name']}")
            self.collect_logs(
                subprocess.run(
                    step["command"].split(),
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                )
            )

    def cleanup(self):
        """cleanup kwok cluster
        ... delete cluster
        """
        self.delete_cluster()

    def delete_cluster(self):
        """delete kwok cluster"""
        self.collect_logs(
            subprocess.run(
                ["kwokctl", "delete", "cluster"],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
            )
        )

    def call_kwokctl(self, command: str):
        """kwokctl"""
        p = subprocess.run(
            command.split(), stdout=subprocess.PIPE, stderr=subprocess.STDOUT
        )
        return self.collect_logs(p)

    def call_argo(self, command: str):
        """argo"""
        p = subprocess.run(
            command.split(), stdout=subprocess.PIPE, stderr=subprocess.STDOUT
        )
        return p

    def call_kubectl(self, command: str):
        """kubectl"""
        cmd = command.split()
        p = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if p.returncode == 0:
            output = p.stdout.decode("utf-8")
        else:
            output = p.stderr.decode("utf-8")
        if "-o" in cmd:
            output_format = cmd[cmd.index("-o") + 1]
            if output_format == "json":
                return json.loads(output)
            elif output_format == "yaml":
                return yaml.load(output, Loader=yaml.FullLoader)
            else:
                return output
        else:
            return output

    def load_workflow(self, workflow_file: str):
        """
        Load the workflow file into the class
        workflow_file: The input workflow file (yaml)
        """
        ifile = Path(workflow_file)
        self.workflow = yaml.load(open(ifile), Loader=yaml.FullLoader)
        # self.workflow4kwok = self._modify_workflow_for_kwok(ifile)
        self.workflow4kwok = self.workflow

    def _modify_workflow_for_kwok(self, ifile: Path):
        """
        Modify the workflow to remove the inputs, outputs, and arguments sections from the workflow.
        :param input_file: The input workflow file
        """
        workflow = yaml.load(open(ifile), Loader=yaml.FullLoader)
        for template in workflow["spec"]["templates"]:
            look_for = ["steps", "dag"]
            remove = ["inputs", "outputs", "arguments"]
            for key in remove:
                if key in template:
                    template.pop(key)
                for subsection in look_for:
                    if subsection in template.keys():
                        for step in template[subsection]:
                            for element in step:
                                if key in element:
                                    element.pop(key)

        return workflow
