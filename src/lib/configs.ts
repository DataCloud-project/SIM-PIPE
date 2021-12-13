import fs from 'node:fs/promises';
import type Docker from 'dockerode';

import type Recipe from '../recipe';

export default async function Configs(
  docker: Docker,
  projectName: string,
  recipe: Recipe,
) : Promise<Docker.Config[]> {
  if (!recipe.configs) {
    return [];
  }

  return await Promise.all<Docker.Config>(Object.entries(recipe.configs)
    .filter(([, { external }]) => !external)
    .map(async ([configName, config]) => docker.createConfig({
      Name: config.name ?? `${projectName}_${configName}`,
      Data: await fs.readFile(config.file, 'utf8'),
    })));
}
