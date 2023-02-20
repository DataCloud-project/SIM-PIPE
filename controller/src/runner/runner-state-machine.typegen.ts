// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "done.invoke.simPipeRunner.idling:invocation[0]": {
      type: "done.invoke.simPipeRunner.idling:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.simPipeRunner.pruning:invocation[0]": {
      type: "done.invoke.simPipeRunner.pruning:invocation[0]";
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
    "done.invoke.simPipeRunner.run.runSteps.error:invocation[0]": {
      type: "done.invoke.simPipeRunner.run.runSteps.error:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.simPipeRunner.run.runSteps.loadNextStep.loading:invocation[0]": {
      type: "done.invoke.simPipeRunner.run.runSteps.loadNextStep.loading:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.simPipeRunner.run.runSteps.startStep.markStepAsStarted.loading:invocation[0]": {
      type: "done.invoke.simPipeRunner.run.runSteps.startStep.markStepAsStarted.loading:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.simPipeRunner.run.runSteps.startStep.startContainer.loading:invocation[0]": {
      type: "done.invoke.simPipeRunner.run.runSteps.startStep.startContainer.loading:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.simPipeRunner.run.runSteps.waitStepToFinish:invocation[0]": {
      type: "done.invoke.simPipeRunner.run.runSteps.waitStepToFinish:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.simPipeRunner.idling:invocation[0]": {
      type: "error.platform.simPipeRunner.idling:invocation[0]";
      data: unknown;
    };
    "error.platform.simPipeRunner.pruning:invocation[0]": {
      type: "error.platform.simPipeRunner.pruning:invocation[0]";
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
    "error.platform.simPipeRunner.run.runSteps.error:invocation[0]": {
      type: "error.platform.simPipeRunner.run.runSteps.error:invocation[0]";
      data: unknown;
    };
    "error.platform.simPipeRunner.run.runSteps.loadNextStep.loading:invocation[0]": {
      type: "error.platform.simPipeRunner.run.runSteps.loadNextStep.loading:invocation[0]";
      data: unknown;
    };
    "error.platform.simPipeRunner.run.runSteps.startStep.markStepAsStarted.loading:invocation[0]": {
      type: "error.platform.simPipeRunner.run.runSteps.startStep.markStepAsStarted.loading:invocation[0]";
      data: unknown;
    };
    "xstate.after(100000)#simPipeRunner.run.runSteps.waitStepToFinish": {
      type: "xstate.after(100000)#simPipeRunner.run.runSteps.waitStepToFinish";
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
    dockerPruning: "done.invoke.simPipeRunner.pruning:invocation[0]";
    loadNextRun: "done.invoke.simPipeRunner.idling:invocation[0]";
    loadNextStep: "done.invoke.simPipeRunner.run.runSteps.loadNextStep.loading:invocation[0]";
    markCurrentStepAsFailed: "done.invoke.simPipeRunner.run.runSteps.error:invocation[0]";
    markRunAsFailed: "done.invoke.simPipeRunner.run.error:invocation[0]";
    markRunAsStarted: "done.invoke.simPipeRunner.run.markRunAsStarted:invocation[0]";
    markStepAsStarted: "done.invoke.simPipeRunner.run.runSteps.startStep.markStepAsStarted.loading:invocation[0]";
    pullAllImages: "done.invoke.simPipeRunner.run.pullAllImages:invocation[0]";
    startContainer: "done.invoke.simPipeRunner.run.runSteps.startStep.startContainer.loading:invocation[0]";
    waitForContainer: "done.invoke.simPipeRunner.run.runSteps.waitStepToFinish:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: "markCurrentStepAsFailed";
  };
  eventsCausingActions: {
    doNothing:
      | "done.invoke.simPipeRunner.pruning:invocation[0]"
      | "done.invoke.simPipeRunner.run.createContainers:invocation[0]"
      | "done.invoke.simPipeRunner.run.runSteps.startStep.startContainer.loading:invocation[0]"
      | "done.invoke.simPipeRunner.run.runSteps.waitStepToFinish:invocation[0]"
      | "error.platform.simPipeRunner.pruning:invocation[0]";
    setRunData:
      | "done.invoke.simPipeRunner.run.createVolumes:invocation[0]"
      | "done.invoke.simPipeRunner.run.markRunAsStarted:invocation[0]"
      | "done.invoke.simPipeRunner.run.runSteps.loadNextStep.loading:invocation[0]"
      | "done.invoke.simPipeRunner.run.runSteps.startStep.markStepAsStarted.loading:invocation[0]";
    setRunId: "done.invoke.simPipeRunner.idling:invocation[0]";
  };
  eventsCausingDelays: {
    cooldownDelay:
      | "done.invoke.simPipeRunner.run.error:invocation[0]"
      | "done.invoke.simPipeRunner.run.runSteps.error:invocation[0]"
      | "error.platform.simPipeRunner.idling:invocation[0]"
      | "error.platform.simPipeRunner.run.error:invocation[0]"
      | "error.platform.simPipeRunner.run.runSteps.error:invocation[0]";
  };
  eventsCausingGuards: {
    hasStepLeft: "";
  };
  eventsCausingServices: {
    createContainers: "done.invoke.simPipeRunner.run.createVolumes:invocation[0]";
    createVolumes: "done.invoke.simPipeRunner.run.pullAllImages:invocation[0]";
    dockerPruning: "" | "Ok";
    loadNextRun:
      | ""
      | "xstate.after(cooldownDelay)#simPipeRunner.errorCooldown"
      | "xstate.after(cooldownDelay)#simPipeRunner.run.errorCooldown";
    loadNextStep:
      | "Ok"
      | "done.invoke.simPipeRunner.run.createContainers:invocation[0]"
      | "done.invoke.simPipeRunner.run.runSteps.waitStepToFinish:invocation[0]";
    markCurrentStepAsFailed:
      | "error.platform.simPipeRunner.run.runSteps.loadNextStep.loading:invocation[0]"
      | "error.platform.simPipeRunner.run.runSteps.startStep.markStepAsStarted.loading:invocation[0]";
    markRunAsFailed:
      | "error.platform.simPipeRunner.run.createContainers:invocation[0]"
      | "error.platform.simPipeRunner.run.createVolumes:invocation[0]"
      | "error.platform.simPipeRunner.run.markRunAsStarted:invocation[0]"
      | "error.platform.simPipeRunner.run.pullAllImages:invocation[0]";
    markRunAsStarted: "done.invoke.simPipeRunner.idling:invocation[0]";
    markStepAsStarted: "";
    pullAllImages:
      | "Ok"
      | "done.invoke.simPipeRunner.run.markRunAsStarted:invocation[0]";
    startContainer: "";
    waitForContainer: "done.state.simPipeRunner.run.runSteps.startStep";
  };
  matchesStates:
    | "errorCooldown"
    | "idling"
    | "pruning"
    | "run"
    | "run.Compute list of steps in the right order"
    | "run.Create container and volumes"
    | "run.Mark run as failed and remaining steps as cancelled"
    | "run.Mark run as successful"
    | "run.Upload last output files"
    | "run.createContainers"
    | "run.createVolumes"
    | "run.end"
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
    | "run.runSteps.Mark step as failed"
    | "run.runSteps.Mark step as success"
    | "run.runSteps.Save logs"
    | "run.runSteps.Start step container"
    | "run.runSteps.Stop container"
    | "run.runSteps.error"
    | "run.runSteps.loadNextStep"
    | "run.runSteps.loadNextStep.loaded"
    | "run.runSteps.loadNextStep.loading"
    | "run.runSteps.startStep"
    | "run.runSteps.startStep.markStepAsStarted"
    | "run.runSteps.startStep.markStepAsStarted.complete"
    | "run.runSteps.startStep.markStepAsStarted.loading"
    | "run.runSteps.startStep.startContainer"
    | "run.runSteps.startStep.startContainer.loading"
    | "run.runSteps.startStep.startContainer.started"
    | "run.runSteps.timeout"
    | "run.runSteps.waitStepToFinish"
    | "start"
    | {
        run?:
          | "Compute list of steps in the right order"
          | "Create container and volumes"
          | "Mark run as failed and remaining steps as cancelled"
          | "Mark run as successful"
          | "Upload last output files"
          | "createContainers"
          | "createVolumes"
          | "end"
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
                | "Mark step as failed"
                | "Mark step as success"
                | "Save logs"
                | "Start step container"
                | "Stop container"
                | "error"
                | "loadNextStep"
                | "startStep"
                | "timeout"
                | "waitStepToFinish"
                | {
                    "Computer is running"?: "Check running state" | "Wait 5s";
                    loadNextStep?: "loaded" | "loading";
                    startStep?:
                      | "markStepAsStarted"
                      | "startContainer"
                      | {
                          markStepAsStarted?: "complete" | "loading";
                          startContainer?: "loading" | "started";
                        };
                  };
            };
      };
  tags: never;
}
