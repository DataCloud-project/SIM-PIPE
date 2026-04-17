const runtimeEnv: Record<string, string | undefined> =
	typeof window === 'undefined'
		? {}
		: // eslint-disable-next-line no-underscore-dangle
			(window as unknown as { __ENV__?: Record<string, string> }).__ENV__ ?? {};

export const KEYCLOAK_ENABLED =
	import.meta.env.VITE_KEYCLOAK_ENABLED ?? runtimeEnv.KEYCLOAK_ENABLED;

export const SIM_PIPE_CONTROLLER_URL =
	import.meta.env.VITE_SIM_PIPE_CONTROLLER_URL ?? runtimeEnv.SIM_PIPE_CONTROLLER_URL;

export const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL ?? runtimeEnv.KEYCLOAK_URL;

export const KEYCLOAK_REALM =
	import.meta.env.VITE_KEYCLOAK_REALM ?? runtimeEnv.KEYCLOAK_REALM ?? 'user-authentication';

export const KEYCLOAK_CLIENT_ID =
	import.meta.env.VITE_KEYCLOAK_CLIENT_ID ?? runtimeEnv.KEYCLOAK_CLIENT_ID ?? 'sim-pipe-web';
