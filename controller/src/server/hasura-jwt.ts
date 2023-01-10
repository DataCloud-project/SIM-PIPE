import crypto from 'node:crypto';
import type { KeyObject } from 'node:crypto';

export async function generateEd25519KeyPair(
): Promise<{ publicKey: KeyObject; privateKey: KeyObject }> {
  return await new Promise((resolve, reject) => {
    crypto.generateKeyPair('ed25519', undefined, (error, publicKey, privateKey) => {
      if (error) {
        reject(error);
      } else {
        resolve({ publicKey, privateKey });
      }
    });
  });
}

export function exportEd25519PrivateKeyToPem(privateKey: KeyObject): string {
  return privateKey.export({
    format: 'pem', type: 'pkcs8',
  }) as string;
}

export function exportEd25519PrivatekeyToBase64url(privateKey: KeyObject): string {
  const jwk = privateKey.export({
    format: 'jwk',
  });
  if (typeof jwk.d === 'string') {
    return jwk.d;
  }
  throw new Error('Unable to export private key to base64url');
}

export function exportEd25519PublicKeyToJWK(publicKey: KeyObject): string {
  return JSON.stringify(publicKey.export({
    format: 'jwk',
  }));
}

export function loadPrivateEd25519KeyFromPem(
  pem: string,
): { privateKey: KeyObject; publicKey: KeyObject } {
  const privateKey = crypto.createPrivateKey({ key: pem, format: 'pem', type: 'pkcs8' });
  const publicKey = crypto.createPublicKey(privateKey);
  return { privateKey, publicKey };
}

export function loadPrivateEd25519KeyFromBase64url(
  key: string,
): { privateKey: KeyObject; publicKey: KeyObject } {
  const jwk = {
    kty: 'OKP',
    crv: 'Ed25519',
    d: key,
    // Must be a string but is actually not used
    x: '',
  };
  const privateKey = crypto.createPrivateKey({ key: jwk, format: 'jwk' });
  const publicKey = crypto.createPublicKey(privateKey);
  return { privateKey, publicKey };
}

export async function initialiseKeyPair(
): Promise<{ publicKey: KeyObject; privateKey: KeyObject }> {
  const keyFromEnvironment = process.env.CONTROLLER_HASURA_JWT_PRIVATE_KEY;
  if (keyFromEnvironment) {
    return loadPrivateEd25519KeyFromPem(keyFromEnvironment);
  }
  /* eslint-disable no-console */
  console.warn('No private key found in environment variable CONTROLLER_HASURA_JWT_PRIVATE_KEY');
  console.warn('Generating a new key pair');
  const keypair = await generateEd25519KeyPair();
  console.warn('Generated Private Key:', exportEd25519PrivatekeyToBase64url(keypair.privateKey));
  /* eslint-enable no-console */
  return keypair;
}
