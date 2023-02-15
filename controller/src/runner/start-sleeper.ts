import { PassThrough } from 'node:stream';
import { createGunzip } from 'node:zlib';

import { runnerSleeperImage } from '../config.js';
import getDocker from './docker.js';

// This is the UUID of the sleeper container, that is fixed
// and designed to be obviously hardcoded.
const SLEEPER_UUID = '11112222-3333-4444-5555-123456789abc';

// AMD64 sleeper image
// See the sandbox/sleeper directory to see how it is built.
const SLEEPER_IMAGE = `
H4sIADPU7GMCA+2a3W7bNhSA1XYbkO2mewODu3VtkiIl2cAKZ4mHFsjmos06bGkQUBRla5ElQ6SLGoHRPlKvd7UX2D
NllCw7sfPjxHG8FOB3YfHn8Ec8PsekD0nDoUEYYt9pUNQQHLrUCZlPMPYCyjBBEAsfcuogFDRQEDZCP6SYowByX/AA
1a3lQEh0t1Q/CxafRRoR27URItTR5RjaBFsVam2AoVQs01O5az+LL/eFQO6q/7ft129edn69dmkQhA4h1+jfXtA/Ir
q6Ao3+7x1U+2KmaniI9v+XTJNlpnG9/WvTdxbtH9uusf9NcAKiADTBXb8GoAp4JpgSeWcYYvsZxM8Q3Yde03aaENY8
13URJN6fuWSaKBYlIjvSqTDqguYJeJFKlbC+0M21xG7a1wJn+d+kyCapbaUY771RQZSAZshiKc6VpUN1sVBk2axwX4
1m6c5AJPP9FLlOwsWspJ28B81kGMdVsNMPpsmXfdYtJ/Y2jYd9Iac1v6fZcZR0d6Nytu1EZaNBGiVqKtFJfhpG8ayr
PeaLuGw+Llbm4a/HAXi1vf/ix/pQZvU45SyuSz9Kmufys+xZRZGYZPUHOCwX9ADUZSzEQL+OLtrOurItORvkXyOVDc
WN17q+wmKzjPciJbgaZvkIrB84RHeTagkQR8nwAxgb/7/U/8dsJLJa7kNX9P/5Xm9x/48RdYz/3wSl9d3rGLn+rz7/
IX3YW9A/go5NjP43wcf23s+PHz2a5R9bz60i97RV5FtleeXpWZuW5Wm5lvVEf+ayX8312Jp7fi5z06dV9pO3+/pcfj
re9LlVFm8ttDMYDAaDwWAwGAwGg8Fwe9A/f5+enn7895NVkz2pMsV8q6bEB7Wm/r8rz/rfWIvn/IXz/RXH/Lztk0v6
3SoFv79E3mAwGAzLYQiH3PegQBjZAQ0ZpJwwxyaMIL8RQCgc6rnYZQJzjji3Xe4EJCQs8F2EQqe2hvg/ohfu/2Bom/
//N8HJVWHQs1D0PQd9L8RxL4kCzwVyx7e5a9CLpEqzkR705DY3FCaSR75uCHY6r/6o1NlgMJ11pV75oeLnEzqOVLFU
/b7Io85gWlgLUn4ssjCKRe09BOPq6oP/sls5eDdbsHfg8CYDVoHoD9ToqAjOThZxfDgX2q6CLE1VKHMFq9Eg13whLH
VNEIXhURTIXFOyxzB1mrbvUeJw7Ng0FEwbfhi4vKHtnwqX+hA1mO34uhoKm6DQ8z0ibOz6kLk+wvqFweF4bJztA6TP
kigUUt3Ej6/sGpfc/7SRPXcXWP8iuNDEfzeCdos7pacHa9kLaP/xWgzSfdad+I+J32rG2qVJlfv7vYmb0XXru3ui3c
vht8aYVyDTupKR/omMhLT+J/tHNl60f4ca+9/Q/m+6FdMbgdJI13AddDw25mgwGAwPmv8As1E7RgA4AAA=
`;

async function importSleeperImage(): Promise<void> {
  const docker = await getDocker();

  /* Do nothing if the image is already present */
  try {
    await docker.getImage(runnerSleeperImage).inspect();
    return;
  } catch (error) {
    if ((error as { statusCode: number }).statusCode !== 404) {
      throw error;
    }
  }

  // Decode from base64
  const compressedImageStream = new PassThrough();
  compressedImageStream.end(Buffer.from(SLEEPER_IMAGE, 'base64'));

  // Decompress the GZIP stream
  const imageStream = createGunzip();
  compressedImageStream.pipe(imageStream);

  /* Load the image, don't use importImage it's not working */
  await docker.loadImage(imageStream, {
    repo: runnerSleeperImage,
    tag: 'latest',
  });
}

/**
 * The purpose of this container is to check whether it is possible to create a container,
 * and to initialise Promscale and TimescaleDB with the right columns that are
 * automatically inferred from the labels.
 *
 * This is useful when you start a new deployment for the first time.
 */
export default async function startSleeper(): Promise<void> {
  const docker = await getDocker();
  const name = 'sim-pipe-sleeper';
  /* Pull the image in case it's not present */
  await importSleeperImage();

  /* Stop and remove the existing sleeper container if it exists */
  try {
    const sleeperContainer = docker.getContainer(name);
    const inspect = await sleeperContainer.inspect();
    if (inspect.State.Running) {
      await sleeperContainer.stop({ t: 0 });
    }
    await sleeperContainer.remove();
  } catch (error) {
    if ((error as { statusCode: number }).statusCode !== 404) {
      throw error;
    }
  }

  const container = await docker.createContainer({
    name,
    Image: runnerSleeperImage,
    Labels: {
      user_id: SLEEPER_UUID,
      simulation_id: SLEEPER_UUID,
      run_id: SLEEPER_UUID,
      step_id: SLEEPER_UUID,
    },
    // Restart unless explicitly stopped
    // https://docs.docker.com/engine/reference/run/#restart-policies---restart
    HostConfig: {
      RestartPolicy: {
        Name: 'unless-stopped',
      },
    },
  });
  await container.start();
  // await container.wait();
}
