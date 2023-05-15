import getDocker from './docker.js';

export default async function dockerPruning(): Promise<void> {
  const docker = await getDocker();

  // Remove all stopped containers that are older than 1 hour
  await docker.pruneContainers({
    filters: {
      status: ['exited'],
      label: ['simpipe=true'],
    },
  });

  // Remove all unused volumes
  await docker.pruneVolumes({
    filters: {
      label: ['simpipe=true'],
    },
  });

  // Remove all unused images
  await docker.pruneImages();
}
