// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.SIM-PIPE Simulation.idling:invocation[0]": {
      type: "done.invoke.SIM-PIPE Simulation.idling:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.SIM-PIPE Simulation.run.Mark run as running and steps as scheduled:invocation[0]": {
      type: "done.invoke.SIM-PIPE Simulation.run.Mark run as running and steps as scheduled:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.SIM-PIPE Simulation.idling:invocation[0]": {
      type: "error.platform.SIM-PIPE Simulation.idling:invocation[0]";
      data: unknown;
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    loadNextRun: "done.invoke.SIM-PIPE Simulation.idling:invocation[0]";
    markRunAsRunningAndStepsAsScheduled: "done.invoke.SIM-PIPE Simulation.run.Mark run as running and steps as scheduled:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    setRunId: "done.invoke.SIM-PIPE Simulation.idling:invocation[0]";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {
    loadNextRun:
      | "Ok"
      | "done.invoke.SIM-PIPE Simulation.run.Mark run as running and steps as scheduled:invocation[0]"
      | "error.platform.SIM-PIPE Simulation.idling:invocation[0]"
      | "xstate.init";
    markRunAsRunningAndStepsAsScheduled: "done.invoke.SIM-PIPE Simulation.idling:invocation[0]";
  };
  matchesStates:
    | "Garbage collection"
    | "Garbage collection.Delete the old step containers"
    | "Garbage collection.Delete the old unused images"
    | "Garbage collection.Delete the old unused volumes"
    | "idling"
    | "run"
    | "run.Compute list of steps in the right order"
    | "run.Create container and volumes"
    | "run.Mark run as failed and remaining steps as cancelled"
    | "run.Mark run as running and steps as scheduled"
    | "run.Mark run as successful"
    | "run.Pull all images"
    | "run.Upload last output files"
    | "run.runSteps"
    | "run.runSteps.Check container status"
    | "run.runSteps.Computer is running"
    | "run.runSteps.Computer is running.Check running state"
    | "run.runSteps.Computer is running.Wait 5s"
    | "run.runSteps.Copy input files"
    | "run.runSteps.Load next step"
    | "run.runSteps.Mark step as failed"
    | "run.runSteps.Mark step as started"
    | "run.runSteps.Mark step as success"
    | "run.runSteps.Save logs"
    | "run.runSteps.Start step container"
    | "run.runSteps.Stop container"
    | {
        "Garbage collection"?:
          | "Delete the old step containers"
          | "Delete the old unused images"
          | "Delete the old unused volumes";
        run?:
          | "Compute list of steps in the right order"
          | "Create container and volumes"
          | "Mark run as failed and remaining steps as cancelled"
          | "Mark run as running and steps as scheduled"
          | "Mark run as successful"
          | "Pull all images"
          | "Upload last output files"
          | "runSteps"
          | {
              runSteps?:
                | "Check container status"
                | "Computer is running"
                | "Copy input files"
                | "Load next step"
                | "Mark step as failed"
                | "Mark step as started"
                | "Mark step as success"
                | "Save logs"
                | "Start step container"
                | "Stop container"
                | { "Computer is running"?: "Check running state" | "Wait 5s" };
            };
      };
  tags: never;
}
