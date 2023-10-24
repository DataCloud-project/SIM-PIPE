import { InputValidationError } from '../server/apollo-errors.js';

function isValidKubernetesLabel(input: string): boolean {
  return /^[\dA-Za-z]([\w.-]{0,61}[\dA-Za-z])?$/.test(input);
}

// eslint-disable-next-line import/prefer-default-export
export function assertIsValidKubernetesLabel(input: string): void {
  if (!isValidKubernetesLabel(input)) {
    throw new InputValidationError(`Invalid Kubernetes label: ${input}`);
  }
}
