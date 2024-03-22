/// <reference types="vite/client" />

// eslint-disable-next-line unicorn/prevent-abbreviations
interface ImportMetaEnv {
	readonly VITE_KEYCLOAK_ENABLED: string | undefined;
	readonly VITE_SIM_PIPE_CONTROLLER_URL: string | undefined;
	readonly VITE_KEYCLOAK_URL: string | undefined;
	readonly VITE_KEYCLOAK_REALM: string | undefined;
	readonly VITE_KEYCLOAK_CLIENT_ID: string | undefined;
	readonly VITE_SFTPGO_URL: string | undefined;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
