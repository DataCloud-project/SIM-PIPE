export const KEYCLOAK_ENABLED = import.meta.env.VITE_KEYCLOAK_ENABLED;

export const SIM_PIPE_CONTROLLER_URL = import.meta.env.VITE_SIM_PIPE_CONTROLLER_URL;

export const KEYCLOAK_URL =
	import.meta.env.VITE_KEYCLOAK_URL ?? 'https://datacloud-auth.euprojects.net/auth';

export const KEYCLOAK_REALM = import.meta.env.VITE_KEYCLOAK_REALM ?? 'user-authentication';

export const KEYCLOAK_CLIENT_ID = import.meta.env.VITE_KEYCLOAK_CLIENT_ID ?? 'sim-pipe-web';

export const SFTPGO_URL = import.meta.env.VITE_SFTPGO_URL;
