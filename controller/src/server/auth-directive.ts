import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { defaultFieldResolver, GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import type { GraphQLSchema } from 'graphql';

import type { Context } from './resolvers.js';

export const authDirectiveTypeDefs = gql`
  directive @auth on OBJECT | FIELD_DEFINITION
`;

export function authDirectiveTransformer(schema: GraphQLSchema): GraphQLSchema {
  const authDirectiveArgumentMaps: Map<string, Record<string, unknown>> = new Map();
  return mapSchema(schema, {
    // If a type has the @auth directive, store it in a map of type name to auth directives
    [MapperKind.TYPE]: (type) => {
      const authDirective = getDirective(schema, type, 'auth')?.[0];
      if (authDirective) {
        authDirectiveArgumentMaps.set(type.name, authDirective);
      }
      // Do not change the type
      return undefined;
    },
    // For every object field
    [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
      // Find the auth directive, or the parent directive from the type
      const authDirective = getDirective(schema, fieldConfig, 'auth')?.[0]
        ?? authDirectiveArgumentMaps.get(typeName);
      // If a directive exists
      if (authDirective) {
        // Find the resolver, or the default one if a resolver is not already set
        const resolve = fieldConfig.resolve ?? defaultFieldResolver;

        // Put a new resolver that will check whether the user is authenticated
        // eslint-disable-next-line no-param-reassign
        fieldConfig.resolve = function authResolver(
          source, arguments_, context: Context, info,
        ): unknown {
          if (!context.user) {
            throw new GraphQLError('User is not authenticated', {
              extensions: {
                code: 'UNAUTHENTICATED',
                http: {
                  status: 401,
                },
              },
            });
          }
          // Call the parent resolver
          return resolve(source, arguments_, context, info);
        };

        // Return the modified field config
        return fieldConfig;
      }
      // No changes
      return undefined;
    },
  });
}
