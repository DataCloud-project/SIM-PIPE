/* eslint-disable max-classes-per-file */
import { GraphQLError } from 'graphql';

export class PingError extends GraphQLError {
  constructor(originalError?: Error) {
    super('Unable to ping the installation', {
      extensions: {
        code: 'PING_ERROR',
      },
      originalError,
    });
  }
}

export class NotFoundError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: 'NOT_FOUND_ERROR',
      },
    });
  }
}

export class ConflictError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: 'CONFLICT_ERROR',
      },
    });
  }
}

export class InputValidationError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: 'INPUT_VALIDATION_ERROR',
      },
    });
  }
}

export class InvalidArgoWorkflowError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: 'INVALID_ARGO_WORKFLOW_ERROR',
      },
    });
  }
}

export class InvalidArgoWorkflowTemplateError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: 'INVALID_ARGO_WORKFLOW_TEMPLATE_ERROR',
      },
    });
  }
}

export class WrongRequestError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: 'WRONG_REQUEST_ERROR',
      },
    });
  }
}

/* eslint-enable max-classes-per-file */
