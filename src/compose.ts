import yaml from 'js-yaml';
import fs from 'node:fs';
import stream from 'node:stream';
import type Docker from 'dockerode';

import configs from './lib/configs.js';
import networks from './lib/networks.js';
import secrets from './lib/secrets.js';
import services from './lib/services.js';
import tools from './lib/tools.js';
import volumes from './lib/volumes.js';

export default class Compose {
  protected docker: Docker;

  protected file: string;

  protected projectName: string;

  protected recipe: unknown;

  constructor(dockerode: Docker, file: string, projectName: string) {
    this.docker = dockerode;
    this.file = file;
    this.projectName = projectName;

    this.recipe = yaml.load(fs.readFileSync(file, 'utf8'));
  }

  async up(options) : Promise<unknown> {
    const [secrets, volumes, configs, networks, services] = await Promise.all([
      secrets(this.docker, this.projectName, this.recipe),
      volumes(this.docker, this.projectName, this.recipe),
      configs(this.docker, this.projectName, this.recipe),
      networks(this.docker, this.projectName, this.recipe),
      services(this.docker, this.projectName, this.recipe, options),
    ]);
    return {
      file: this.file,
      secrets,
      volumes,
      configs,
      networks,
      services,
    };
  }

  async pull(serviceN, options) {
    options = options || {};
    const streams = [];
    const serviceNames = (serviceN === undefined || serviceN === null) ? tools.sortServices(this.recipe) : [serviceN];
    for (const serviceName of serviceNames) {
      const service = this.recipe.services[serviceName];
      try {
        var streami = await this.docker.pull(service.image);
        streams.push(streami);

        if (options.verbose === true) {
          streami.pipe(process.stdout);
        }

        if (options.streams !== true) {
          if (options.verbose === true) {
            streami.pipe(process.stdout);
          } else {
            streami.pipe(stream.PassThrough());
          }
          await new Promise((fulfill) => streami.once('end', fulfill));
        }
      } catch (error) {
        throw error;
      }
    }
    return streams;
  }
}
