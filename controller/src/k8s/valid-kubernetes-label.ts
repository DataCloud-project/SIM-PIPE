import { InputValidationError } from '../server/apollo-errors.js';

export function isValidKubernetesLabel(input: string): boolean {
  return /^[\dA-Za-z]([\w.-]{0,61}[\dA-Za-z])?$/.test(input);
}

export function assertIsValidKubernetesLabel(input: string): void {
  if (!isValidKubernetesLabel(input)) {
    throw new InputValidationError(`Invalid Kubernetes label: ${input}`);
  }
}
