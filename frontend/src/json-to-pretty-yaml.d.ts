declare module 'json-to-pretty-yaml' {
	const YAML: {
		stringify: (json: unknown, _: null, indents: number) => string;
	};
	export default YAML;
}
