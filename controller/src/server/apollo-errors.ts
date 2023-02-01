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

/* eslint-enable max-classes-per-file */
