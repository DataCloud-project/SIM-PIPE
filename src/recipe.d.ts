export default interface Recipe {
  configs?: { [configName: string]: {
    name?: string;
    external?: boolean;
    file: string; // FilePath of the configuration data
  } };

  networks?: { [networkName: string]: {
    name?: string;
    external?: boolean;
    ipam?: {
      driver: string;
      options: { [key: string]: string };
      /* config?: {
        subnet?: string;
        ip_range?: string;
        gateway?: string;
        aux_addresses?: { [key: string]: string };
      }; */
    };
    driver?: string;
    driver_opts?: { [key: string]: string };
    labels?: { [key: string]: string };
    attachable?: boolean;
    enable_ipv6?: boolean;
    internal?: boolean;
  } | null };

  secrets?: { [secretName: string]: {
    name?: string;
    external?: boolean;
    file: string;
  } };

  volumes?: { [volumeName: string]: {
    name?: string;
    external?: boolean;
    driver?: string;
    driver_opts?: { [key: string]: string };
    labels?: { [key: string]: string };
  } | null };
}
