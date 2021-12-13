import type Docker from 'dockerode';

import type Recipe from '../recipe';

export interface Network {
  name: string;
  network: Docker.Network;
}

async function createNetworkOrGetExisting(
  docker: Docker,
  name: string,
  options?: Docker.NetworkCreateOptions,
): Promise<Docker.Network> {
  try {
    return await docker.createNetwork({
      ...options,
      Name: name,
      CheckDuplicate: true,
    });
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    if (error.statusCode === 409 && error.json?.message?.includes('already exists')) {
      const returnedNetwork = await docker.listNetworks({
        filters: { name: [name] },
      });
      return docker.getNetwork(returnedNetwork[0].Id);
    }

    throw error;
  }
}

export default async function Networks(
  docker: Docker,
  projectName: string,
  recipe: Recipe,
) : Promise<Network[]> {
  const networks = await Promise.all<Network>(Object.entries(recipe.networks ?? {})
    .filter(([, network]) => !network || !network.external)
    .map(async ([networkName, network]) => {
      const name = `${projectName}_${networkName}`;
      if (network === null) {
        return {
          name,
          network: await createNetworkOrGetExisting(docker, name),
        };
      }

      const options = {
        Name: network.name ?? name,
        Driver: network.driver,
        DriverOpts: network.driver_opts,
        Labels: network.labels,
        Attachable: network.attachable,
        EnableIPv6: network.enable_ipv6,
        Internal: network.internal,
        CheckDuplicate: true,
        IPAM: network.ipam ? {
          Driver: network.ipam.driver,
          Options: network.ipam.options,
          // TODO this doesn't match the types in Dockerode
          /* Config: network.ipam.config ? {
            Subnet: network.ipam.config.subnet,
            IPRange: network.ipam.config.ip_range,
            Gateway: network.ipam.config.gateway,
            AuxAddress: network.ipam.config.aux_addresses,
          } : undefined, */
        } : undefined,
      };

      return {
        name,
        network: await createNetworkOrGetExisting(docker, options.Name, options),
      };
    }));

  if (networks.length === 0) {
    return [{
      name: `${projectName}_default`,
      network: await createNetworkOrGetExisting(docker, `${projectName}_default`),
    }];
  }
  return networks;
}
