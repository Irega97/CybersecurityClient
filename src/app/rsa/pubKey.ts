const bcu = require('bigint-crypto-utils');
const bc = require('bigint-conversion');

export class PublicKey {
    e: bigint;
    n: bigint;

    constructor(e: bigint, n: bigint) {
      this.e = e;
      this.n = n;
    }

    encrypt (m: bigint): bigint | string {
        const c: bigint = bcu.modPow(m, this.e, this.n);
        return c;
    }

    verify (s: bigint): bigint {
        return bcu.modPow(s, this.e, this.n);
    }
}

export class RsaBlinder {
    r: bigint; // factor de cegado
    pubKey: PublicKey;
    _ONE = BigInt(1);

    constructor(pubKey: PublicKey) {
        this.pubKey = pubKey;
        this.r = bcu.randBetween(this.pubKey.n);
    }

    blind (msg: bigint): bigint {
        const bm: bigint = ( msg * (this.pubKey.encrypt(this.r) as bigint) ) % this.pubKey.n;
        return bm;
    }

    unblind (blindedSignature: bigint): bigint {
        return blindedSignature * bcu.modInv(this.r, this.pubKey.n);
    }
}