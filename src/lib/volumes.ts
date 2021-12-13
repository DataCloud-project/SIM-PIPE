import type Docker from 'dockerode';

import type Recipe from '../recipe';

export default async function Volumes(
  docker: Docker,
  projectName: string,
  recipe: Recipe,
): Promise<Docker.Volume[]> {
  if (!recipe.volumes) {
    return [];
  }

  return await Promise.all<Docker.Volume>(Object.entries(recipe.volumes)
    .filter(([, config]) => !config || !config.external)
    .map(async ([volumeName, volume]) => docker.createVolume({
      Name: volume.name ?? `${projectName}_${volumeName}`,
      Driver: volume.driver ?? 'local',
      DriverOpts: volume.driver_opts,
      Labels: volume.labels,
    })));
}
