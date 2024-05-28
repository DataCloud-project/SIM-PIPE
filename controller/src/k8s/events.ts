import { KubeConfig, Watch } from '@kubernetes/client-node';

export default function eventsServer(): void {
  // eslint-disable-next-line no-console
  console.log('Hello from the events server!');
  // Load Kubernetes configuration from the default location
  const kubeConfig = new KubeConfig();
  kubeConfig.loadFromDefault();

  // Define the resource to watch
  const resource = '/api/v1/namespaces/default/events';

  // Start watching for events
  const watch = new Watch(kubeConfig);
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  watch.watch(resource, {}, (type, event) => {
    // eslint-disable-next-line no-console
    console.log(`Event ${type}: ${JSON.stringify(event)}`);
  }, (error) => {
    // eslint-disable-next-line no-console
    console.error('Error:', error);
  });

  // eslint-disable-next-line no-console
  console.log('Watching for Kubernetes events...');
}
