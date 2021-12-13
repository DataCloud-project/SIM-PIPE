import fs from 'node:fs/promises';
import type Docker from 'dockerode';

import type Recipe from '../recipe';

export default async function Secrets(
  docker: Docker,
  projectName: string,
  recipe: Recipe,
) : Promise<Docker.Secret[]> {
  if (!recipe.secrets) {
    return [];
  }

  return await Promise.all<Docker.Secret>(Object.entries(recipe.secrets)
    .filter(([, { external }]) => !external)
    .map(async ([configName, config]) => docker.createSecret({
      Name: config.name ?? `${projectName}_${configName}`,
      Data: await fs.readFile(config.file, 'utf8'),
    })));
}
