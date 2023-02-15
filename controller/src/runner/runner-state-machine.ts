import { assign, createMachine } from 'xstate';

import createContainers from './create-containers.js';
import createVolumes from './create-volumes.js';
import loadNextRun from './load-next-run.js';
import markRunAsFailed from './mark-run-as-failed.js';
import markRunAsStarted from './mark-run-as-started.js';
import pullAllImages from './pull-all-images.js';
import type RunData from './run-data.js';
import type { RunInStream } from './runs-stream.js';

export default createMachine({
  id: 'simPipeRunner',
  initial: 'idling',
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  tsTypes: {} as import('./runner-state-machine.typegen').Typegen0,
  states: {
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
          initial: 'Load next step',
          states: {
            'Load next step': {
              on: {
                Ok: {
                  target: 'Mark step as started',
                },
                'No step left': {
                  target: '#simPipeRunner.run.Upload last output files',
                },
              },
            },
            'Copy input files': {
              on: {
                'Failed to copy input files': {
                  target: 'Mark step as failed',
                },
                Ok: {
                  target: 'Start step container',
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
            'Start step container': {
              on: {
                Error: {
                  target: 'Mark step as failed',
                },
                Started: {
                  target: 'Computer is running',
                },
              },
            },
            'Computer is running': {
              initial: 'Check running state',
              states: {
                'Check running state': {
                  on: {
                    Finished: {
                      target: '#simPipeRunner.run.runSteps.Save logs',
                    },
                    Running: {
                      target: 'Wait 5s',
                    },
                    Timeout: {
                      target:
                        '#simPipeRunner.run.runSteps.Stop container',
                    },
                  },
                },
                'Wait 5s': {
                  on: {
                    '5s': {
                      target: 'Check running state',
                    },
                  },
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
            'Mark step as started': {
              on: {
                Ok: {
                  target: 'Copy input files',
                },
              },
            },
            'Mark step as success': {
              on: {
                Ok: {
                  target: 'Load next step',
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
              target: '#simPipeRunner.Garbage collection',
            },
          },
        },
        'Mark run as successful': {
          on: {
            Ok: {
              target: '#simPipeRunner.Garbage collection',
            },
          },
        },
      },
    },
    'Garbage collection': {
      initial: 'Delete the old step containers',
      states: {
        'Delete the old step containers': {
          on: {
            Ok: {
              target: 'Delete the old unused volumes',
            },
          },
        },
        'Delete the old unused volumes': {
          on: {
            Ok: {
              target: 'Delete the old unused images',
            },
          },
        },
        'Delete the old unused images': {},
      },
      on: {
        Ok: {
          target: 'idling',
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
    markRunAsStarted,
    markRunAsFailed,
    pullAllImages,
    createVolumes,
    createContainers,
  },
  actions: {
    setRunId: assign({ runId: (_, event) => event.data.runId }),
    setRunData: assign({ runData: (_f, event) => event.data as RunData }),
    doNothing: () => { /* nop */ },
  },
  delays: {
    cooldownDelay: () => Math.round(Math.random() * 2000) + 4000,
  },
});
