import { bigintToText } from "bigint-conversion";
import { PublicKey  as publickey} from "../rsa/pubKey";

export class PrivateKey{
    d: BigInt;
    publicKey: publickey;
    bcu = require('bigint-crypto-utils');
//import * as bc from 'bigint-conversion';
    bc = require('bigint-conversion');
    
    constructor (d: BigInt, publicKey: publickey) {
        this.d = BigInt(d);
        this.publicKey = publicKey;
    }

    async decrypt (c: any) {
        c = this.bc.hexToBigint(c)
        let decrypted = this.bcu.modPow(c, this.d, this.publicKey.n);
        let d = this.bc.bigintToText(decrypted);
        return d;
    }

    sign (m: any) {
        //m = this.bc.textToBigint(m);
        //return this.bc.bigintToText(this.bcu.modPow(m, this.d, this.publicKey.n));
        return this.bcu.modPow(m, this.d, this.publicKey.n);
    }
  }