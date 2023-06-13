import { CoreV1Api, CustomObjectsApi, KubeConfig } from '@kubernetes/client-node';

export default class K8sClient {
  private kubeConfig: KubeConfig;

  private coreClient: CoreV1Api | undefined;

  private customObjectsClient: CustomObjectsApi | undefined;

  constructor() {
    this.kubeConfig = new KubeConfig();
    this.kubeConfig.loadFromDefault();
  }

  get core(): CoreV1Api {
    if (!this.coreClient) {
      this.coreClient = this.kubeConfig.makeApiClient(CoreV1Api);
    }
    return this.coreClient;
  }

  get customObjects(): CustomObjectsApi {
    if (!this.customObjectsClient) {
      this.customObjectsClient = this.kubeConfig.makeApiClient(CustomObjectsApi);
    }
    return this.customObjectsClient;
  }
}
