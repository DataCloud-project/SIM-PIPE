import fs from 'node:fs';
import path from 'node:path';
import stream from 'node:stream';
import tar from 'tar-fs';

import type Recipe from '../recipe';

export interface ServicePort {
  target: string;
  protocol: string;
  published: number | string;
}

export interface PortBinding {
  HostPort: string;
  HostIP?: string;
}

export interface HostConfig {
  RestartPolicy: {
    Name: string;
  }
  Binds?: string[];
}

export interface Volume {
  source?: string;
  target?: string;
  read_only?: string;
  volume?: {
    nocopy?: boolean;
  };
  bind?: {
    propagation?: string;
  };
}

export interface Service {
  restart: string;
  volumes_from: string[];
  volumes: (Volume | string)[];
}

export function fillPortArray(start: number, end: number) : number[] {
  return Array.from({ length: end - start + 1 }).map((_, index) => start + index);
}

export function buildPorts(
  servicePorts: (ServicePort | string)[],
) : { [port: string]: PortBinding[] } {
  return Object.fromEntries<PortBinding[]>(servicePorts.flatMap(
    (port) => {
      // LONG SYNTAX
      // !!! INCOMPLETE - NOT USING DIFFERENT MODES
      // - `mode`: `host` for publishing a host port on each node,
      // or `ingress` for a port to be load balanced.
      if (typeof port === 'object') {
        return [[`${port.target}/${port.protocol}`, [{ HostPort: `${port.published}` }]]];
      }

      // SHORT SYNTAX
      // TODO: SIMPLIFY THIS BLOCK OF CODE! MAYBE!
      const portSplit = port.split(':');

      if (portSplit.length === 2) {
      // "xxxx:xxxx"
        if (portSplit[1].includes('-')) {
        // "9090-9091:8080-8081"
          const splitPortSplit0 = portSplit[0].split('-');
          const targetPorts = fillPortArray(
            Number.parseInt(splitPortSplit0[0], 10),
            Number.parseInt(splitPortSplit0[1], 10),
          );

          const splitPortSplit1 = portSplit[1].split('-');
          const publishedPorts = fillPortArray(
            Number.parseInt(splitPortSplit1[0], 10),
            Number.parseInt(splitPortSplit1[1], 10),
          );

          if (targetPorts.length !== publishedPorts.length) {
            throw new Error('Port range mismatch, the range should have the same difference');
          }

          return targetPorts.map((target_port, index) => [`${target_port}/tcp`, [{
            HostPort: `${publishedPorts[index]}`,
          }]]);
        }

        // TODO Consider not supporting this and throwing an exception instead ?
        if (portSplit[0].includes('-')) {
        // "3000-3005:3000"
          const splitPortSplit = portSplit[0].split('-');
          return splitPortSplit.map((hostPort) => [`${portSplit[1]}/tcp`, [{
            HostPort: `${hostPort}`,
          }]]);
        }

        // TODO Consider refactoring to support udp on ranges too
        if (portSplit[1].includes('/')) {
        // "6060:6060/udp"
          return [portSplit[1], [{ HostPort: portSplit[0] }]];
        }

        // "8000:8000"
        return [`${portSplit[1]}/tcp`, [{ HostPort: portSplit[0] }]];
      }

      if (portSplit.length === 3) {
      // "x.x.x.x:xxxx:xxxx"
        if (portSplit[2].includes('-')) {
        // "127.0.0.1:5000-5010:5000-5010"
          const splitPortSplit1 = portSplit[1].split('-');
          const targetPorts = fillPortArray(
            Number.parseInt(splitPortSplit1[0], 10),
            Number.parseInt(splitPortSplit1[1], 10),
          );

          const splitPortSplit2 = portSplit[2].split('-');
          const publishedPorts = fillPortArray(
            Number.parseInt(splitPortSplit2[0], 10),
            Number.parseInt(splitPortSplit2[1], 10),
          );

          if (targetPorts.length !== publishedPorts.length) {
            throw new Error('Port range mismatch, the range should have the same difference');
          }

          return targetPorts.map((targetPort, index) => [`${targetPort}/tcp`, [{
            HostPort: `${publishedPorts[index]}`,
            HostIp: portSplit[0],
          }]]);
        }

        if (portSplit[1] === '') {
        // "127.0.0.1::5000
          return [`${portSplit[2]}/tcp`, [{ HostPort: portSplit[2], HostIp: portSplit[0] }]];
        }
        // "127.0.0.1:8001:8001"
        return [`${portSplit[2]}/tcp`, [{ HostPort: portSplit[1], HostIp: portSplit[0] }]];
      }

      // "xxxx"
      if (portSplit[0].includes('-')) {
        // "3000-3005"
        const splitPortSplit = portSplit[0].split('-');
        return splitPortSplit.map((targetAndHostPort) => [`${targetAndHostPort}/tcp`, [{
          HostPort: `${targetAndHostPort}`,
        }]]);
      }
      // "3000"
      return [[`${port}/tcp`, [{ HostPort: port }]]];
    },
  ));
}

export function buildVolumesHostconfig(volumes: (Volume | string)[], type?: string) : string[] {
  // if (output.Binds === undefined) {
  //  output.Binds = [];
  // }
  return volumes.map((volume) => {
    if (typeof volume === 'string') {
      let aux = volume;
      if (type === 'ro') {
        aux += ':ro';
      }
      return aux;
    }
    let volumestr = '';
    if (volume.source && volume.target) {
      volumestr += `${volume.source}:${volume.target}:`;
    }
    if (volume.read_only || type === 'ro') {
      volumestr += 'ro,';
    }
    if (volume.volume && volume.volume.nocopy) {
      volumestr += 'nocopy,';
    }
    if (volume.bind && volume.bind.propagation) {
      volumestr += `${volume.bind.propagation},`;
    }
    volumestr = volumestr.slice(0, -1);
    return volumestr;
  });
}

export function buildVolumes(volumes, options) {
  if (options.Volumes === undefined) {
    options.Volumes = {};
  }
  for (const volume of volumes) {
    if (typeof volume === 'string' || volume instanceof String) {
      const v = volume.split(':');
      options.Volumes[v[1]] = {};
    } else if (volume.target) {
      options.Volumes[volume.target] = {};
    }
  }
}

export function buildEnvVars(service) {
  const output = [];

  if (service.env_file !== undefined) {
    if (Array.isArray(service.env_file)) {
      for (const environment_file_path of service.env_file) {
        this.buildEnvVarsFromFile(environment_file_path, output);
      }
    } else {
      this.buildEnvVarsFromFile(service.env_file, output);
    }
  }

  if (service.environment !== undefined) {
    if (Array.isArray(service.environment)) {
      for (const environment_line of service.environment) {
        output.push(environment_line);
      }
    } else {
      const environmentsNames = Object.keys(service.environment);
      for (const environmentName of environmentsNames) {
        output.push(`${environmentName}=${service.environment[environmentName]}`);
      }
    }
  }
  return output;
}

export function buildNetworks(serviceNetworks, networksToAttach) {
  if (Array.isArray(serviceNetworks)) {
    for (const [index, serviceNetwork] of serviceNetworks.entries()) {
      const networkName = `${projectName}_${serviceNetwork}`;
      const networkTemplate = {
        NetworkingConfig: {
          EndpointsConfig: {},
        },
      };
      networkTemplate.NetworkingConfig.EndpointsConfig[networkName] = {};
      networkTemplate.NetworkingConfig.EndpointsConfig[networkName].Aliases = [serviceName];
      if (index === 0) { opts.NetworkingConfig.EndpointsConfig = networkTemplate.NetworkingConfig.EndpointsConfig; }

      networksToAttach.push(networkTemplate.NetworkingConfig.EndpointsConfig);
    }
  } else {
    const networkNames = Object.keys(serviceNetworks);
    for (const [index, networkName_] of networkNames.entries()) {
      const network = serviceNetworks[networkName_] || {};
      const networkName = `${projectName}_${networkName_}`;
      const networkTemplate = {
        NetworkingConfig: {
          EndpointsConfig: {},
        },
      };
      networkTemplate.NetworkingConfig.EndpointsConfig[networkName] = {};
      networkTemplate.NetworkingConfig.EndpointsConfig[networkName].IPAMConfig = {};
      if (network.aliases !== undefined) {
        networkTemplate.NetworkingConfig.EndpointsConfig[networkName].Aliases = network.aliases;
      }
      if (network.ipv4_address !== undefined) {
        networkTemplate.NetworkingConfig.EndpointsConfig[networkName].IPAMConfig.IPv4Address = network.ipv4_address;
      }
      if (network.ipv6_address !== undefined) {
        networkTemplate.NetworkingConfig.EndpointsConfig[networkName].IPAMConfig.IPv6Address = network.ipv6_address;
      }
      if (network.link_local_ips !== undefined) {
        networkTemplate.NetworkingConfig.EndpointsConfig[networkName].IPAMConfig.LinkLocalIPs = network.link_local_ips;
      }
      if (network.priority !== undefined) {
        networkTemplate.NetworkingConfig.EndpointsConfig[networkName].priority = network.priority;
      } else {
        networkTemplate.NetworkingConfig.EndpointsConfig[networkName].priority = 0;
      }
      if (index === 0) {
        opts.NetworkingConfig.EndpointsConfig = networkTemplate.NetworkingConfig.EndpointsConfig;
      }
      networksToAttach.push(networkTemplate.NetworkingConfig.EndpointsConfig);
    }
  }
}

// TODO: OPTIMIZE!
export function convertSizeStringToByteValue(object) {
  let rate = object[0].rate.toLowerCase();
  const new_object = [{}];
  if (rate.includes('k')) {
    if (rate.indexOf('k') == rate.length - 1) {
      rate = rate.replace('k', '');
    } else if (rate.indexOf('k') == rate.length - 2) {
      rate = rate.replace('kb', '');
    }
    new_object[0].Path = object[0].path;
    new_object[0].Rate = rate * 1024;
    return new_object;
  } if (rate.includes('m')) {
    if (rate.indexOf('m') == rate.length - 1) {
      rate = rate.replace('m', '');
    } else if (rate.indexOf('m') == rate.length - 2) {
      rate = rate.replace('mb', '');
    }
    new_object[0].Path = object[0].path;
    new_object[0].Rate = rate * 1024 * 1024;
    return new_object;
  } if (rate.includes('g')) {
    if (rate.indexOf('g') == rate.length - 1) {
      rate = rate.replace('g', '');
    } else if (rate.indexOf('g') == rate.length - 2) {
      rate = rate.replace('gb', '');
    }
    new_object[0].Path = object[0].path;
    new_object[0].Rate = rate * 1024 * 1024 * 1024;
    return new_object;
  }
}

export function buildEnvVarsFromFile(environment_file_path, output) {
  // Each line in an env file MUST be in `VAR=VAL` format.
  const environment_file = fs.readFileSync(environment_file_path, 'utf8').toString().split('\n');
  for (const environment_line of environment_file) {
    // Lines beginning with `#` MUST be ignored. Blank lines MUST also be ignored.
    if (environment_line != '' && environment_line.indexOf('#') != 0) {
      const environment_line_split = environment_line.split('=');
      // `VAL` MAY be omitted, sin such cases the variable value is empty string. `=VAL` MAY be omitted, in such cases the variable is **unset**.
      if (environment_line_split[0] != '' && environment_line_split[1] != '') {
        output.push(environment_line);
      }
    }
  }
}

export async function buildDockerImage(docker, buildPath, object, dockerfile, options) {
  options = options || {};
  if (dockerfile !== null) {
    object.dockerfile = path.basename(dockerfile);
    const streami = await docker.buildImage({
      context: buildPath,
      src: [dockerfile],
    }, object);
    if (options.verbose === true) {
      streami.pipe(process.stdout);
    } else {
      streami.pipe(stream.PassThrough());
    }
    await new Promise((fulfill) => streami.once('end', fulfill));
  } else {
    const tarStream = tar.pack(buildPath);
    const streami = await docker.buildImage(tarStream, object);
    if (options.verbose === true) {
      streami.pipe(process.stdout);
    } else {
      streami.pipe(stream.PassThrough());
    }
    await new Promise((fulfill) => streami.once('end', fulfill));
  }
}

// ToDo: complete the compose specification
export function buildHostConfig(service: Service, recipe: Recipe) : HostConfig {
  const output : HostConfig = {
    RestartPolicy: { Name: service.restart },
  };

  if (service.volumes_from !== undefined) {
    for (const volume_from of service.volumes_from) {
      const vf = volume_from.split(':');
      const svf = recipe.services[vf[0]];
      buildVolumesHostconfig(svf.volumes, output, vf[1]);
    }
  }

  if (service.volumes !== undefined) {
    output.Binds = buildVolumesHostconfig(service.volumes);
  }

  if (service.ports !== undefined) {
    buildPorts(service.ports, output);
  }

  if (service.cpu_count !== undefined) {
    output.CpuCount = service.cpu_count;
  }
  if (service.cpu_percent !== undefined) {
    output.CpuPercent = service.cpu_percent;
  }
  if (service.cpu_shares !== undefined) {
    output.CpuShares = service.cpu_shares;
  }
  if (service.cpu_period !== undefined) {
    output.CpuPeriod = service.cpu_period;
  }
  if (service.cpu_quota !== undefined) {
    output.CpuQuota = service.cpu_quota;
  }
  if (service.cpu_rt_runtime !== undefined) {
    output.CpuRealtimeRuntime = service.cpu_rt_runtime;
  }
  if (service.cpu_rt_period !== undefined) {
    output.CpuRealtimePeriod = service.cpu_rt_period;
  }
  if (service.cpuset !== undefined) {
    output.CpusetCpus = service.cpuset;
  }
  if (service.cap_add !== undefined) {
    output.CapAdd = service.cap_add;
  }
  if (service.cap_drop !== undefined) {
    output.CapDrop = service.cap_drop;
  }
  if (service.cgroup_parent !== undefined) {
    output.CgroupParent = service.cgroup_parent;
  }
  if (service.device_cgroup_rules !== undefined) {
    output.DeviceCgroupRules = service.device_cgroup_rules;
  }
  if (service.dns !== undefined) {
    output.Dns = service.dns;
  }
  if (service.dns_opt !== undefined) {
    output.DnsOptions = service.dns_opt;
  }
  if (service.dns_search !== undefined) {
    output.DnsSearch = service.dns_search;
  }
  if (service.extra_hosts !== undefined) {
    output.ExtraHosts = service.extra_hosts;
  }
  if (service.group_add !== undefined) {
    output.GroupAdd = service.group_add;
  }
  if (service.init !== undefined) {
    output.Init = service.init;
  }
  if (service.ipc !== undefined) {
    output.IpcMode = service.ipc;
  }
  if (service.isolation !== undefined) {
    output.Isolation = service.isolation;
  }
  if (service.mem_swappiness !== undefined) {
    output.MemorySwappiness = service.mem_swappiness;
  }
  if (service.oom_kill_disable !== undefined) {
    output.OomKillDisable = service.oom_kill_disable;
  }
  if (service.oom_score_adj !== undefined) {
    output.OomScoreAdj = service.oom_score_adj;
  }
  if (service.pid !== undefined) {
    output.PidMode = service.pid;
  }
  if (service.pids_limit !== undefined) {
    output.PidsLimit = service.pids_limit;
  }
  if (service.privileged !== undefined) {
    output.Privileged = service.privileged;
  }
  if (service.read_only !== undefined) {
    output.ReadonlyRootfs = service.read_only;
  }
  if (service.runtime !== undefined) {
    output.Runtime = service.runtime;
  }
  if (service.security_opt !== undefined) {
    output.SecurityOpt = service.security_opt;
  }
  if (service.shm_size !== undefined) {
    output.ShmSize = service.shm_size;
  }
  if (service.storage_opt !== undefined) {
    output.StorageOpt = service.storage_opt;
  }
  if (service.sysctls !== undefined) {
    if (service.sysctls.length > 0) {
      const sysctls = {};
      for (const sysctlsb of service.sysctls) {
        const p = sysctlsb.split('=');
        sysctls[p[0]] = p[1];
      }
      output.Sysctls = sysctls;
    } else {
      const sysctlKeys = Object.keys(service.sysctls);
      const newSysctls = {};
      for (const key of sysctlKeys) {
        newSysctls[key] = service.sysctls[key].toString();
      }
      output.Sysctls = newSysctls;
    }
  }
  if (service.userns_mode !== undefined) {
    output.UsernsMode = service.userns_mode;
  }
  if (service.tmpfs !== undefined) {
    const tmpfs = {};
    if (Array.isArray(service.tmpfs)) {
      for (const tmpfsb of service.tmpfs) {
        const p = tmpfsb.split(':');
        if (p[1] === undefined) {
          p[1] = '';
        }
        tmpfs[p[0]] = p[1];
      }
      output.Tmpfs = tmpfs;
    } else {
      const p = service.tmpfs.split(':');
      if (p[1] === undefined) {
        p[1] = '';
      }
      tmpfs[p[0]] = p[1];
      output.Tmpfs = tmpfs;
    }
  }
  if (service.ulimits !== undefined) {
    const ulimitsKeys = Object.keys(service.ulimits);
    const ulimitsArray = [];
    for (const key of ulimitsKeys) {
      const ulimitsObject = {};
      if (typeof service.ulimits[key] === 'object') {
        ulimitsObject.Name = key;
        ulimitsObject.Soft = service.ulimits[key].soft;
        ulimitsObject.Hard = service.ulimits[key].hard;
        ulimitsArray.push(ulimitsObject);
      } else {
        ulimitsObject.Name = key;
        ulimitsObject.Soft = service.ulimits[key];
        ulimitsObject.Hard = service.ulimits[key];
        ulimitsArray.push(ulimitsObject);
      }
    }
    output.Ulimits = ulimitsArray;
  }
  if (service.blkio_config !== undefined) {
    if (service.blkio_config.weight !== undefined) {
      output.BlkioWeight = service.blkio_config.weight;
    }
    if (service.blkio_config.weight_device !== undefined) {
      const weight_device = [{}];
      weight_device[0].Path = service.blkio_config.weight_device[0].path;
      weight_device[0].Weight = service.blkio_config.weight_device[0].weight;
      output.BlkioWeightDevice = weight_device;
    }
    if (service.blkio_config.device_read_bps !== undefined) {
      output.BlkioDeviceReadBps = convertSizeStringToByteValue(service.blkio_config.device_read_bps);
    }
    if (service.blkio_config.device_read_iops !== undefined) {
      const device_read_iops = [{}];
      device_read_iops[0].Path = service.blkio_config.device_read_iops[0].path;
      device_read_iops[0].Rate = service.blkio_config.device_read_iops[0].rate;
      output.BlkioDeviceReadIOps = device_read_iops;
    }
    if (service.blkio_config.device_write_bps !== undefined) {
      output.BlkioDeviceWriteBps = convertSizeStringToByteValue(service.blkio_config.device_write_bps);
    }
    if (service.blkio_config.device_write_iops !== undefined) {
      const device_write_iops = [{}];
      device_write_iops[0].Path = service.blkio_config.device_write_iops[0].path;
      device_write_iops[0].Rate = service.blkio_config.device_write_iops[0].rate;
      output.BlkioDeviceWriteIOps = device_write_iops;
    }
  }
  if (service.logging !== undefined) {
    const logging = {};
    logging.Type = service.logging.driver;
    logging.Config = service.logging.options;
    output.LogConfig = logging;
  }
  return output;
}
