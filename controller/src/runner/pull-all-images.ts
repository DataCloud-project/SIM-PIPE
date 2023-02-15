import type { Stream } from 'node:stream';

import getDocker from './docker.js';
import { assertRunData } from './run-data.js';
import type RunData from './run-data.js';

async function pullImage(image: string): Promise<void> {
  const docker = await getDocker();
  return new Promise<void>((resolve, reject) => {
    const onFinished = (): void => {
      resolve();
    };
    docker.pull(image, {}, (error: unknown, stream: Stream) => {
      if (error) {
        reject(error);
      } else {
        try {
          docker.modem.followProgress(stream, onFinished);
        } catch (dockerModemError) {
          if ((dockerModemError as Error).name === 'TypeError') resolve();
          else reject(dockerModemError);
        }
      }
    });/* .catch((error) => {
      reject(error);
    }); */
  });
}

export default async function pullAllImages(
  context: { runData: RunData | undefined }): Promise<void> {
  assertRunData(context);
  const { runData } = context;

  const images = runData.steps.map((step) => step.image);
  await Promise.all(images.map((image) => pullImage(image)));
}
