// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.simPipeRunner.idling:invocation[0]": {
      type: "done.invoke.simPipeRunner.idling:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.simPipeRunner.run.createContainers:invocation[0]": {
      type: "done.invoke.simPipeRunner.run.createContainers:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.simPipeRunner.run.createVolumes:invocation[0]": {
      type: "done.invoke.simPipeRunner.run.createVolumes:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.simPipeRunner.run.error:invocation[0]": {
      type: "done.invoke.simPipeRunner.run.error:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.simPipeRunner.run.markRunAsStarted:invocation[0]": {
      type: "done.invoke.simPipeRunner.run.markRunAsStarted:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.simPipeRunner.run.pullAllImages:invocation[0]": {
      type: "done.invoke.simPipeRunner.run.pullAllImages:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.simPipeRunner.idling:invocation[0]": {
      type: "error.platform.simPipeRunner.idling:invocation[0]";
      data: unknown;
    };
    "error.platform.simPipeRunner.run.createContainers:invocation[0]": {
      type: "error.platform.simPipeRunner.run.createContainers:invocation[0]";
      data: unknown;
    };
    "error.platform.simPipeRunner.run.createVolumes:invocation[0]": {
      type: "error.platform.simPipeRunner.run.createVolumes:invocation[0]";
      data: unknown;
    };
    "error.platform.simPipeRunner.run.error:invocation[0]": {
      type: "error.platform.simPipeRunner.run.error:invocation[0]";
      data: unknown;
    };
    "error.platform.simPipeRunner.run.markRunAsStarted:invocation[0]": {
      type: "error.platform.simPipeRunner.run.markRunAsStarted:invocation[0]";
      data: unknown;
    };
    "error.platform.simPipeRunner.run.pullAllImages:invocation[0]": {
      type: "error.platform.simPipeRunner.run.pullAllImages:invocation[0]";
      data: unknown;
    };
    "xstate.after(cooldownDelay)#simPipeRunner.errorCooldown": {
      type: "xstate.after(cooldownDelay)#simPipeRunner.errorCooldown";
    };
    "xstate.after(cooldownDelay)#simPipeRunner.run.errorCooldown": {
      type: "xstate.after(cooldownDelay)#simPipeRunner.run.errorCooldown";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    createContainers: "done.invoke.simPipeRunner.run.createContainers:invocation[0]";
    createVolumes: "done.invoke.simPipeRunner.run.createVolumes:invocation[0]";
    loadNextRun: "done.invoke.simPipeRunner.idling:invocation[0]";
    markRunAsFailed: "done.invoke.simPipeRunner.run.error:invocation[0]";
    markRunAsStarted: "done.invoke.simPipeRunner.run.markRunAsStarted:invocation[0]";
    pullAllImages: "done.invoke.simPipeRunner.run.pullAllImages:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    doNothing: "done.invoke.simPipeRunner.run.createContainers:invocation[0]";
    setRunData:
      | "done.invoke.simPipeRunner.run.createVolumes:invocation[0]"
      | "done.invoke.simPipeRunner.run.markRunAsStarted:invocation[0]";
    setRunId: "done.invoke.simPipeRunner.idling:invocation[0]";
  };
  eventsCausingDelays: {
    cooldownDelay:
      | "done.invoke.simPipeRunner.run.error:invocation[0]"
      | "error.platform.simPipeRunner.idling:invocation[0]"
      | "error.platform.simPipeRunner.run.error:invocation[0]";
  };
  eventsCausingGuards: {};
  eventsCausingServices: {
    createContainers: "done.invoke.simPipeRunner.run.createVolumes:invocation[0]";
    createVolumes: "done.invoke.simPipeRunner.run.pullAllImages:invocation[0]";
    loadNextRun:
      | "Ok"
      | "xstate.after(cooldownDelay)#simPipeRunner.errorCooldown"
      | "xstate.after(cooldownDelay)#simPipeRunner.run.errorCooldown"
      | "xstate.init";
    markRunAsFailed:
      | "error.platform.simPipeRunner.run.createContainers:invocation[0]"
      | "error.platform.simPipeRunner.run.createVolumes:invocation[0]"
      | "error.platform.simPipeRunner.run.markRunAsStarted:invocation[0]"
      | "error.platform.simPipeRunner.run.pullAllImages:invocation[0]";
    markRunAsStarted: "done.invoke.simPipeRunner.idling:invocation[0]";
    pullAllImages:
      | "Ok"
      | "done.invoke.simPipeRunner.run.markRunAsStarted:invocation[0]";
  };
  matchesStates:
    | "Garbage collection"
    | "Garbage collection.Delete the old step containers"
    | "Garbage collection.Delete the old unused images"
    | "Garbage collection.Delete the old unused volumes"
    | "errorCooldown"
    | "idling"
    | "run"
    | "run.Compute list of steps in the right order"
    | "run.Create container and volumes"
    | "run.Mark run as failed and remaining steps as cancelled"
    | "run.Mark run as successful"
    | "run.Upload last output files"
    | "run.createContainers"
    | "run.createVolumes"
    | "run.error"
    | "run.errorCooldown"
    | "run.markRunAsStarted"
    | "run.pullAllImages"
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
          | "Mark run as successful"
          | "Upload last output files"
          | "createContainers"
          | "createVolumes"
          | "error"
          | "errorCooldown"
          | "markRunAsStarted"
          | "pullAllImages"
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
