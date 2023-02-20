import { assign, createMachine } from 'xstate';

import createContainers from './create-containers.js';
import createVolumes from './create-volumes.js';
import dockerPruning from './docker-pruning.js';
import loadNextRun from './load-next-run.js';
import loadNextStep from './load-next-step.js';
import markRunAsFailed from './mark-run-as-failed.js';
import markRunAsStarted from './mark-run-as-started.js';
import markStepAsStarted from './mark-step-as-started.js';
import pullAllImages from './pull-all-images.js';
import startContainer from './start-container.js';
import updateStepStatus from './update-step-status.js';
import waitForContainer from './wait-for-container.js';
import type RunData from './run-data.js';
import type { RunInStream } from './runs-stream.js';

export default createMachine({
  id: 'simPipeRunner',
  initial: 'start',
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  tsTypes: {} as import('./runner-state-machine.typegen').Typegen0,
  states: {
    start: {
      always: 'idling',
    },
    idling: {
      onEntry: assign({ runId: undefined }),
      invoke: {
        src: 'loadNextRun',
        onError: {
          target: 'errorCooldown',
        },
        onDone: {
          target: 'run',
          actions: 'setRunId',
        },
      },
    },
    errorCooldown: {
      after: {
        cooldownDelay: {
          target: 'idling',
        },
      },
    },
    run: {
      initial: 'markRunAsStarted',
      states: {
        markRunAsStarted: {
          invoke: {
            src: 'markRunAsStarted',
            onDone: {
              target: 'pullAllImages',
              actions: 'setRunData',
            },
            onError: {
              target: 'error',
            },
          },
        },
        error: {
          invoke: {
            src: 'markRunAsFailed',
            onDone: {
              target: 'errorCooldown',
            },
            onError: {
              target: 'errorCooldown',
            },
          },
        },
        errorCooldown: {
          after: {
            cooldownDelay: {
              target: '#simPipeRunner.idling',
            },
          },
        },
        pullAllImages: {
          invoke: {
            src: 'pullAllImages',
            onDone: {
              target: 'createVolumes',
            },
            onError: {
              target: 'error',
            },
          },
        },
        createVolumes: {
          invoke: {
            src: 'createVolumes',
            onDone: {
              target: 'createContainers',
              actions: 'setRunData',
            },
            onError: {
              target: 'error',
            },
          },
        },
        createContainers: {
          invoke: {
            src: 'createContainers',
            onDone: {
              target: 'runSteps',
              actions: 'doNothing',
            },
            onError: {
              target: 'error',
            },
          },
        },
        runSteps: {
          initial: 'loadNextStep',
          states: {
            error: {
              invoke: {
                src: 'markCurrentStepAsFailed',
                onDone: {
                  target: '#simPipeRunner.run.errorCooldown',
                },
                onError: {
                  target: '#simPipeRunner.run.errorCooldown',
                },
              },
            },
            loadNextStep: {
              initial: 'loading',
              states: {
                loading: {
                  invoke: {
                    src: 'loadNextStep',
                    onDone: {
                      target: 'loaded',
                      actions: 'setRunData',
                    },
                    onError: {
                      target: '#simPipeRunner.run.runSteps.error',
                    },
                  },
                },
                loaded: {
                  type: 'final',
                  always: [
                    {
                      target: '#simPipeRunner.run.runSteps.startStep',
                      cond: 'hasStepLeft',
                    },
                    {
                      target: '#simPipeRunner.run.end',
                    },
                  ],
                },
              },
            },
            startStep: {
              type: 'parallel',
              states: {
                markStepAsStarted: {
                  initial: 'loading',
                  states: {
                    loading: {
                      invoke: {
                        src: 'markStepAsStarted',
                        onDone: {
                          target: 'complete',
                          actions: 'setRunData',
                        },
                        onError: {
                          target: '#simPipeRunner.run.runSteps.error',
                        },
                      },
                    },
                    complete: {
                      type: 'final',
                    },
                  },
                },
                startContainer: {
                  initial: 'loading',
                  states: {
                    loading: {
                      invoke: {
                        src: 'startContainer',
                        onDone: {
                          target: 'started',
                          actions: 'doNothing',
                        },
                      },
                    },
                    started: {
                      type: 'final',
                    },
                  },
                },
              },
              onDone: {
                target: 'waitStepToFinish',
              },
            },
            waitStepToFinish: {
              invoke: {
                src: 'waitForContainer',
                onDone: {
                  target: 'updateStepStatus',
                  actions: 'doNothing',
                },
              },
              after: {
                100_000: {
                  target: 'timeout',
                },
              },
            },
            timeout: {},
            updateStepStatus: {
              invoke: {
                src: 'updateStepStatus',
                onDone: {
                  actions: 'setRunData',
                  target: 'loadNextStep',
                },
              },
            },
            'Mark step as failed': {
              on: {
                Ok: {
                  target:
                    '#simPipeRunner.run.Mark run as failed and remaining steps as cancelled',
                },
              },
            },
            'Check container status': {
              on: {
                'Error status': {
                  target: 'Mark step as failed',
                },
                Success: {
                  target: 'Mark step as success',
                },
              },
            },
            'Mark step as success': {
              on: {
                Ok: {
                  target: 'loadNextStep',
                },
              },
            },
            'Stop container': {
              on: {
                Stopped: {
                  target: 'Save logs',
                },
              },
            },
            'Save logs': {
              on: {
                Ok: {
                  target: 'Check container status',
                },
              },
            },
          },
        },
        end: {
          always: {
            target: '#simPipeRunner.pruning',
          },
        },
        'Create container and volumes': {
          on: {
            Ok: {
              target: 'runSteps',
            },
          },
        },
        'Compute list of steps in the right order': {
          on: {
            Ok: {
              target: 'pullAllImages',
            },
          },
        },
        'Upload last output files': {
          on: {
            Ok: {
              target: 'Mark run as successful',
            },
            Error: {
              target: 'Mark run as failed and remaining steps as cancelled',
            },
          },
        },
        'Mark run as failed and remaining steps as cancelled': {
          on: {
            Ok: {
              target: '#simPipeRunner.pruning',
            },
          },
        },
        'Mark run as successful': {
          on: {
            Ok: {
              target: '#simPipeRunner.pruning',
            },
          },
        },
      },
    },
    pruning: {
      invoke: {
        src: 'dockerPruning',
        onDone: {
          target: 'start',
          actions: 'doNothing',
        },
        onError: {
          target: 'start',
          actions: 'doNothing',
        },
      },
    },
  },
  schema: {
    context: {} as {
      runId: string | undefined;
      runData: RunData | undefined;
    },
    events: {} as
      | { type: 'NEW_RUN' }
      | { type: 'Ok' }
      | { type: 'Failed to copy input files' }
      | { type: 'Error' }
      | { type: 'Started' }
      | { type: 'Error status' }
      | { type: 'Finished' }
      | { type: 'Running' }
      | { type: '5s' }
      | { type: 'Success' }
      | { type: 'No step left' }
      | { type: 'Timeout' }
      | { type: 'Stopped' },
    services: {} as {
      loadNextRun: {
        data: RunInStream;
      };
    },
  },
  context: {
    runId: undefined,
    runData: undefined,
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
}, {
  services: {
    loadNextRun,
    loadNextStep,
    markRunAsStarted,
    markRunAsFailed,
    pullAllImages,
    createVolumes,
    createContainers,
    markStepAsStarted,
    startContainer,
    waitForContainer,
    dockerPruning,
    updateStepStatus,
  },
  actions: {
    setRunId: assign({ runId: (_, event) => event.data.runId }),
    setRunData: assign({ runData: (_f, event) => event.data as RunData }),
    doNothing: () => { /* nop */ },
  },
  delays: {
    cooldownDelay: () => Math.round(Math.random() * 2000) + 4000,
  },
  guards: {
    hasStepLeft: (context) => context.runData?.currentStep !== undefined,
  },
});
