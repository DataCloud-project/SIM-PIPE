import {
  exportKeyObjectToJWK, generateEd25519KeyPair, initialiseKeyPair,
} from './server/hasura-jwt.js';
import startServer from './server/server.js';

await startServer();

const keys = await generateEd25519KeyPair();
console.log(keys);

console.log(exportKeyObjectToJWK(keys.publicKey));
console.log(exportKeyObjectToJWK(keys.privateKey));
console.log(await initialiseKeyPair());
