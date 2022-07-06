import express from 'express';
import { expressjwt } from 'express-jwt';
import got from 'got';
import pMemoize from 'p-memoize';
import ExpiryMap from 'expiry-map';
import type { Request as JWTRequest } from 'express-jwt';

const app = express();

const KEYCLOAK_REALM_ENDPOINT = process.env.KEYCLOAK_REALM_ENDPOINT ??
  'https://datacloud-auth.euprojects.net/auth/realms/user-authentication';

async function getKeycloakPublicKey() : Promise<string> {
  const response = await got(KEYCLOAK_REALM_ENDPOINT).json<{public_key: string}>();
  const { public_key: publicKey } = response;
  if (!publicKey) {
    throw new Error('No public key found');
  }
  return `-----BEGIN PUBLIC KEY-----\r\n${publicKey}\r\n-----END PUBLIC KEY-----`;
}

const keycloakPublicKeyCache = new ExpiryMap(10000); // 10s (should probably be longer in production)
const getKeycloakPublicKeyWithCache = pMemoize(
  getKeycloakPublicKey, { cache: keycloakPublicKeyCache },
);

const jwtMiddleware = expressjwt({
  secret: getKeycloakPublicKeyWithCache,
  algorithms: ['RS256'],
});

const secret = process.env.JWT_SECRET ?? 'secret';

app.get('/', async (req, res) => {
  if (req.headers.authorization !== `Bearer ${secret}`) {
    res.status(401).send('Unauthorized');
    return;
  }
  res.send(`Hello World ${req.headers['x-sim-pipe-user']}`);
});


app.get('/protected', jwtMiddleware, async (req: JWTRequest, res: express.Response) => {
  res.json({
    message: `Hello ${req.auth?.preferred_username ?? 'unknown user'}`,
    auth: req.auth,
  });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

/*
TODO for Apollo
https://www.apollographql.com/docs/apollo-server/data/resolvers/#the-context-argument
https://www.apollographql.com/docs/apollo-server/integrations/middleware/#apollo-server-express
*/