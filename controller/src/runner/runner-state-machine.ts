import { assign, createMachine } from 'xstate';

import loadNextRun from './load-next-run.js';
import markRunAsRunningAndStepsAsScheduled from './mark-run-as-running.js';
import type { RunInStream } from './runs-stream.js';

export default createMachine({
  id: 'SIM-PIPE Simulation',
  initial: 'idling',
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  tsTypes: {} as import('./runner-state-machine.typegen').Typegen0,
  states: {
    idling: {
      onEntry: assign({ runId: undefined }),
      invoke: {
        src: 'loadNextRun',
        onError: {
          target: 'idling',
        },
        onDone: {
          target: 'run',
          actions: 'setRunId',
        },
      },
    },
    run: {
      initial: 'Mark run as running and steps as scheduled',
      states: {
        'Mark run as running and steps as scheduled': {
          on: {
            Ok: {
              target: 'Compute list of steps in the right order',
            },
          },
          invoke: {
            src: 'markRunAsRunningAndStepsAsScheduled',
            onDone: {
              target: '#SIM-PIPE Simulation.idling',
            },
          },
        },
        'Pull all images': {
          on: {
            Ok: {
              target: 'Create container and volumes',
            },
            Error: {
              target: 'Mark run as failed and remaining steps as cancelled',
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
                  target: '#SIM-PIPE Simulation.run.Upload last output files',
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
                    '#SIM-PIPE Simulation.run.Mark run as failed and remaining steps as cancelled',
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
                      target: '#SIM-PIPE Simulation.run.runSteps.Save logs',
                    },
                    Running: {
                      target: 'Wait 5s',
                    },
                    Timeout: {
                      target:
                        '#SIM-PIPE Simulation.run.runSteps.Stop container',
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
              target: 'Pull all images',
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
              target: '#SIM-PIPE Simulation.Garbage collection',
            },
          },
        },
        'Mark run as successful': {
          on: {
            Ok: {
              target: '#SIM-PIPE Simulation.Garbage collection',
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
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
}, {
  services: {
    loadNextRun,
    markRunAsRunningAndStepsAsScheduled,
  },
  actions: {
    setRunId: assign({ runId: (_, event) => event.data.runId }),
  },
});
