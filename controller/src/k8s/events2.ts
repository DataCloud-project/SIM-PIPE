/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import * as k8s from '@kubernetes/client-node';

const kubernetesEndpoint = 'api/v1/namespaces';
const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const watch = new k8s.Watch(kc);

export default async function eventsServer(): Promise<any> {
  console.log(kc.getContexts(), watch.config.exportConfig());
  const request = await watch.watch(
    kubernetesEndpoint,
    // optional query parameters can go here.
    {
      allowWatchBookmarks: true,
    },
    // callback is called for each received object.
    (type, apiObject, watchObject) => {
      console.log(type, apiObject, watchObject);
    },
    // done callback is called if the watch terminates normally
    (error) => console.error(error),
  );
  return request;
}
