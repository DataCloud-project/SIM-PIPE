import yaml from 'js-yaml';
import fs from 'node:fs';
import path from 'node:path';
import type Docker from 'dockerode';

import servicesTools from './services-tools.js';
import tools from './tools.js';
import type Recipe from '../recipe';

export default async function Services(
  docker: Docker,
  projectName: string,
  recipe: Recipe,
  output: never,
  options: unknown,
): Promise<Docker.Service[]> {
  const services = [];
  const serviceNames = tools.sortServices(recipe);
  for (const serviceName of serviceNames) {
    const pathScope = {};
    pathScope.file = output.file;
    const networksToAttach = [];
    let service = recipe.services[serviceName];
    if (service.extends !== undefined) {
      if (service.extends.service !== undefined) {
        service = extendsServices(service, recipe, pathScope);
      } else {
        throw new Error('Service key in extends is required!');
      }
    }

    if (service.build !== undefined) {
      const absolutePath = path.dirname(pathScope.file);
      const object = {};

      if (service.image !== undefined) {
        object.t = service.image;
      } else {
        object.t = `${projectName}_${serviceName}`;
        service.image = `${projectName}_${serviceName}`;
      }

      if (typeof service.build === 'object') {
        if (service.build.context !== undefined) {
          const buildContextPath = path.resolve(path.join(absolutePath, service.build.context));
          if (fs.existsSync(buildContextPath)) {
            if (service.build.args !== undefined) {
              const out = {};
              if (Array.isArray(service.build.args)) {
                for (const argument_line of service.build.args) {
                  const argument = argument_line.split('=');
                  out[argument[0]] = argument[1];
                }
              } else {
                const argumentNames = Object.keys(service.build.args);
                for (const argumentName of argumentNames) {
                  out[argumentName] = service.build.args[argumentName];
                }
              }
              object.buildargs = out;
            }

            if (service.build.cache_from !== undefined) {
              object.cachefrom = service.build.cache_from;
            }

            if (service.build.extra_hosts !== undefined) {
              object.extrahosts = service.build.extra_hosts;
            }

            if (service.build.labels !== undefined) {
              if (service.build.labels.length > 0) {
                const labels = {};
                for (const labelsb of service.build.labels) {
                  const p = labelsb.split('=');
                  if (p[1] === undefined) {
                    p[1] = '';
                  }
                  labels[p[0]] = p[1];
                }
                object.labels = labels;
              } else {
                object.labels = service.build.labels;
              }
            }

            if (service.build.shm_size !== undefined) {
              // RE ARRAGE the function "convertSizeStringToByteValue" to a generic one
              object.shmsize = servicesTools.convertSizeStringToByteValue([{ path: '', rate: service.build.shm_size }]).Rate;
            }

            if (service.build.target !== undefined) {
              object.target = service.build.target;
            }

            await (service.build.dockerfile === undefined ? servicesTools.buildDockerImage(docker, buildContextPath, object, null, options) : servicesTools.buildDockerImage(docker, buildContextPath, object, service.build.dockerfile, options));
          } else {
            throw new Error(`build path ${buildContextPath} either does not exist, is not accessible, or is not a valid URL.`);
          }
        } else {
          throw new Error('Build context is required!');
        }
      } else {
        const dockerFilePath = path.resolve(path.join(absolutePath, service.build));
        if (fs.existsSync(dockerFilePath)) {
          await servicesTools.buildDockerImage(docker, dockerFilePath, object, null, options);
        } else {
          throw new Error(`build path ${dockerFilePath} either does not exist, is not accessible, or is not a valid URL.`);
        }
      }
    }

    const options_ = {
      name: `${projectName}_${serviceName}`,
      Image: service.image,
      HostConfig: servicesTools.buildHostConfig(service, recipe),
      Env: servicesTools.buildEnvVars(service),
      NetworkingConfig: {
        EndpointsConfig: {},
      },
    };

    if (service.networks !== undefined) {
      servicesTools.buildNetworks(service.networks, networksToAttach);
    } else {
      options_.NetworkingConfig.EndpointsConfig[`${projectName}_default`] = {
        IPAMConfig: {},
        Links: [],
        Aliases: [
          serviceName,
        ],
      };
    }

    // Can be used VolumesFrom from API DIRECTLY inside HostConfig :(
    if (service.volumes_from) {
      for (const volume_from of service.volumes_from) {
        const vf = volume_from.split(':');
        const svf = recipe.services[vf[0]];
        servicesTools.buildVolumes(svf.volumes, options_);
      }
    }

    if (service.volumes) {
      servicesTools.buildVolumes(service.volumes, options_);
    }
    if (service.container_name !== undefined) {
      options_.name = service.container_name;
    }
    if (service.domainname !== undefined) {
      options_.Domainname = service.domainname;
    }
    if (service.hostname !== undefined) {
      options_.Hostname = service.hostname;
    }
    if (service.mac_address !== undefined) {
      options_.MacAddress = service.mac_address;
    }
    if (service.stdin_open !== undefined) {
      options_.OpenStdin = service.stdin_open;
    }
    if (service.stop_grace_period !== undefined) {
      const period = Number.parseInt(service.stop_grace_period);
      if (service.stop_grace_period == period) {
        options_.StopTimeout = service.stop_grace_period;
      } else if (service.stop_grace_period.includes('m') && service.stop_grace_period.includes('s')) {
        const minutes = Number.parseInt(service.stop_grace_period.slice(0, Math.max(0, service.stop_grace_period.indexOf('m'))));
        const seconds = Number.parseInt(service.stop_grace_period.substring(service.stop_grace_period.indexOf('m') + 1, service.stop_grace_period.indexOf('s')));
        options_.StopTimeout = (minutes * 60) + seconds;
      } else {
        options_.StopTimeout = service.stop_grace_period.slice(0, Math.max(0, service.stop_grace_period.length - 2));
      }
    }
    if (service.stop_signal !== undefined) {
      options_.StopSignal = service.stop_signal;
    }
    if (service.expose !== undefined) {
      const ports = {};
      for (const port of service.expose) {
        ports[`${port}/tcp`] = {};
      }
      options_.ExposedPorts = ports;
    }
    if (service.tty !== undefined) {
      options_.Tty = service.tty;
    }
    if (service.user !== undefined) {
      options_.User = service.user;
    }
    if (service.working_dir !== undefined) {
      options_.WorkingDir = service.working_dir;
    }
    if (service.labels !== undefined) {
      if (service.labels.length > 0) {
        const labels = {};
        for (const labelsb of service.labels) {
          const p = labelsb.split('=');
          if (p[1] === undefined) {
            p[1] = '';
          }
          labels[p[0]] = p[1];
        }
        options_.Labels = labels;
      } else {
        options_.Labels = service.labels;
      }
    }
    if (service.healthcheck !== undefined) {
      const healthcheck = {};
      healthcheck.Test = service.healthcheck.test;
      healthcheck.Interval = convertFancyDurationToMs(service.healthcheck.interval);
      healthcheck.Timeout = convertFancyDurationToMs(service.healthcheck.timeout);
      healthcheck.Retries = service.healthcheck.retries;
      healthcheck.StartPeriod = convertFancyDurationToMs(service.healthcheck.start_period);
      options_.Healthcheck = healthcheck;
    }
    if (service.command !== undefined) {
      options_.Cmd = service.command;
    }
    if (service.entrypoint !== undefined) {
      if (Array.isArray(service.entrypoint)) {
        options_.Entrypoint = service.entrypoint;
      } else {
        const entrypoint = [];
        entrypoint.push(service.entrypoint);
        options_.Entrypoint = entrypoint;
      }
    }
    const container = await docker.createContainer(options_);

    if (networksToAttach.length > 1) {
      const networkNames = Object.keys(networksToAttach[0]);
      await findNetwork(output, networkNames[0]).disconnect({ Container: container.id });
      const networksToAttachSorted = tools.sortNetworksToAttach(networksToAttach);
      for (const networkToAttach of networksToAttachSorted) {
        const networkName = Object.keys(networkToAttach);
        await findNetwork(output, networkName).connect({ Container: container.id, EndpointConfig: networkToAttach[networkName] });
      }
    }
    await container.start();
    services.push(container);
  }
  return services;
}

var findNetwork = function (output, name) {
  for (const network of output.networks) {
    if (network.name == name) { return network.network; }
  }
};

var convertFancyDurationToMs = function (value) {
  const interval = Number.parseInt(value);
  if (value == interval) {
    return value;
  } if (value.includes('m') && value.includes('s')) {
    const minutes = Number.parseInt(value.slice(0, Math.max(0, value.indexOf('m'))));
    const seconds = Number.parseInt(value.substring(value.indexOf('m') + 1, value.indexOf('s')));
    return ((minutes * 60) + seconds) * 1000 * 1_000_000;
  }
  return Number.parseInt(value.slice(0, Math.max(0, value.length - 2))) * 1000 * 1_000_000;
};

// https://github.com/compose-spec/compose-spec/blob/master/spec.md#extends
var extendsServices = function (service, recipe, pathScope) {
  // https://github.com/compose-spec/compose-spec/blob/master/spec.md#finding-referenced-service
  if (service.extends.file === undefined) {
    // EXTENDS OF THE SAME RECIPE
    return buildExtendsService(service, service.extends.service, recipe, pathScope);
  }
  // EXTENDS OF ANOTHER RECIPE
  const absolutePath = path.dirname(pathScope.file);
  const extendsRecipe = yaml.load(fs.readFileSync(path.resolve(path.join(absolutePath, service.extends.file)), 'utf8'));
  return buildExtendsService(service, service.extends.service, extendsRecipe, pathScope);
};

var buildExtendsService = function (service, extendsServiceName, recipe, pathScope) {
  let extend = false;
  const extendsRecipeServiceNames = Object.keys(recipe.services);
  for (const extendsRecipeServiceName of extendsRecipeServiceNames) {
    if (extendsRecipeServiceName == extendsServiceName) {
      const extendsService = recipe.services[extendsRecipeServiceName];
      // deep copy
      // var oldService = JSON.parse(JSON.stringify(service));
      const oldService = service;
      service = extendsService;
      const serviceKeys = Object.keys(service);
      for (const key of serviceKeys) {
        verifyRestrictions(key);
        if (key == 'extends') {
          extend = true;
        }
      }
      const oldServiceKeys = Object.keys(oldService);
      for (const key of oldServiceKeys) {
        if (key != 'extends') {
          mergingService(key, service, oldService);
        }
      }
      if (oldService.extends.file) {
        const absolutePath = path.dirname(pathScope.file);
        pathScope.file = path.resolve(path.join(absolutePath, oldService.extends.file));
      }
      if (extend) { service = extendsServices(service, recipe, pathScope); }

      return service;
    }
  }
  throw new Error('Extends service not found');
};

// https://github.com/compose-spec/compose-spec/blob/master/spec.md#restrictions
var verifyRestrictions = function (key) {
  const restrictions = [
    'links',
    'volumes_from',
    'depends_on',
    'ipc',
    'pid',
    'network_mode',
    // 'net'
  ];
  if (restrictions.includes(key)) {
    throw new Error('This extends service cannot be used as a base');
  }
};

// https://github.com/compose-spec/compose-spec/blob/master/spec.md#merging-service-definitions
var mergingService = function (key, service, oldService) {
  const mappings = [
    'environment',
    // 'healthcheck',
    'labels',
    'sysctls',
    'extra_hosts',
    'ulimits',
  ];
  const objectMappings = {
    build: { args: '', labels: '', extra_hosts: '' },
    deploy: {
      labels: '', update_config: '', rollback_config: '', restart_policy: '', resources: { limits: '' },
    },
    blkio_config: {
      device_read_bps: '', device_read_iops: '', device_write_bps: '', device_write_iops: '',
    },
    logging: { options: '' },
  };
  const sequences = [
    'cap_add',
    'cap_drop',
    // 'configs', // not implemented yet
    'device_cgroup_rules',
    'expose',
    // 'external_links', // not implemented yet
    'ports',
    // 'secrets', // not fully implemented yet
    'security_opt',
  ];
  const objectSequences = {
    deploy: {
      placement: { constraints: '', preferences: '' },
      reservations: { generic_resources: '' },
    },
  };

  // https://github.com/compose-spec/compose-spec/blob/master/spec.md#mappings - MAPPINGS
  if (key == 'build' || key == 'deploy' || key == 'blkio_config' || key == 'logging') {
    // one object level missing in deploy resources
    const objectMappingsKeys = Object.keys(objectMappings[key]);
    for (const objectMappingsKey of objectMappingsKeys) {
      if (oldService[key][objectMappingsKey] !== undefined) {
        service[key][objectMappingsKey] = oldService[key][objectMappingsKey];
      }
    }
  } else if (mappings.includes(key) && service[key] !== undefined) {
    // TRICKY TRICKY (bugs can appear because long and short syntaxes)
    if (Array.isArray(oldService[key]) || Array.isArray(service[key])) {
      if (!Array.isArray(service[key])) {
        const temporaryService = [];
        const environmentsNames = Object.keys(service[key]);
        for (const environmentName of environmentsNames) {
          temporaryService.push(`${environmentName}=${service[key][environmentName]}`);
        }
        service[key] = temporaryService;
      }
      if (!Array.isArray(oldService[key])) {
        const temporaryOldService = [];
        const environmentsNames = Object.keys(oldService[key]);
        for (const environmentName of environmentsNames) {
          temporaryOldService.push(`${environmentName}=${oldService[key][environmentName]}`);
        }
        oldService[key] = temporaryOldService;
      }
      for (const oldServiceLine of oldService[key]) {
        for (const serviceLine of service[key]) {
          if (serviceLine.split('=')[0] == oldServiceLine.split('=')[0] || serviceLine.split(':')[0] == oldServiceLine.split(':')[0]) {
            service[key].splice(service[key].indexOf(serviceLine), 1, oldServiceLine);
          }
        }
        if (!service[key].includes(oldServiceLine)) {
          service[key].push(oldServiceLine);
        }
      }
    } else {
      Object.assign(service[key], oldService[key]);
    }
    // https://github.com/compose-spec/compose-spec/blob/master/spec.md#sequences - SEQUENCES
  } else if (key == 'dns' || key == 'dns_search' || key == 'env_file' || key == 'tmpfs') {
    if (Array.isArray(oldService[key]) || Array.isArray(service[key])) {
      if (!Array.isArray(service[key])) {
        const temporaryService = [];
        if (service[key] !== undefined) {
          temporaryService.push(service[key]);
        }
        service[key] = temporaryService;
      }
      if (!Array.isArray(oldService[key])) {
        oldService[key] = [oldService[key]];
      }
      service[key] = service[key].concat(oldService[key]);
    } else {
      service[key] = [];
      service[key].push(service[key]);
      service[key].push(oldService[key]);
    }
  } else if (key == 'deploy') {
    const objectSequencesKeys = Object.keys(objectSequences[key]);
    for (const objectSequencesKey of objectSequencesKeys) {
      if (oldService[key][objectSequencesKey] !== undefined) {
        service[key][objectSequencesKey] = oldService[key][objectSequencesKey];
      }
    }
  } else if (sequences.includes(key) && service[key] !== undefined) {
    if (Array.isArray(oldService[key]) || Array.isArray(service[key])) {
      for (const oldServiceLine of oldService[key]) {
        if (!service[key].includes(oldServiceLine)) {
          service[key].push(oldServiceLine);
        }
      }
    } // else !!! for now all keys are arrays with future implementations can maybe change !!!
  } else {
    // https://github.com/compose-spec/compose-spec/blob/master/spec.md#scalars - SCALARS
    service[key] = oldService[key];
  }
};
