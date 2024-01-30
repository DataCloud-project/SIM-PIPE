// import type { ModalSettings } from '@skeletonlabs/skeleton';
import yaml from 'js-yaml';

export function validateYAML(input: string) {
	try {
		yaml.load(input);
		return { valid: true };
	} catch (error) {
		return { valid: false, message: error };
	}
}
