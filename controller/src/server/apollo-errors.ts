/* eslint-disable max-classes-per-file */
import { GraphQLError } from 'graphql';

export class DSLParsingError extends GraphQLError {
  constructor(originalError?: Error) {
    super('Unable to parse the DSL', {
      extensions: {
        code: 'DSL_PARSING_ERROR',
      },
      originalError,
    });
  }
}

export class PingError extends GraphQLError {
  constructor(originalError?: Error) {
    super('Unable to ping the database or docker', {
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

export class FeatureDisabledError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: 'FEATURE_DISABLED_ERROR',
      },
    });
  }
}

/* eslint-enable max-classes-per-file */