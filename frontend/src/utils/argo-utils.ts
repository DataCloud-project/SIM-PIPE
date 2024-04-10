// import type { ModalSettings } from '@skeletonlabs/skeleton';
import yaml from 'js-yaml';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function validateYAML(input: string) {
	try {
		yaml.load(input);
		return { valid: true };
	} catch (error) {
		return { valid: false, message: error };
	}
}
