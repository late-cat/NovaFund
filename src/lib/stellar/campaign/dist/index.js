import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
if (typeof window !== "undefined") {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAAAAADJJbml0aWFsaXplcyB0aGUgY2FtcGFpZ24uIENhbiBvbmx5IGJlIGNhbGxlZCBvbmNlLgAAAAAABGluaXQAAAAEAAAAAAAAAAdjcmVhdG9yAAAAABMAAAAAAAAABXRva2VuAAAAAAAAEwAAAAAAAAAEZ29hbAAAAAsAAAAAAAAACGRlYWRsaW5lAAAABgAAAAA=",
            "AAAAAAAAAEBJZiB0aGUgY2FtcGFpZ24gc3VjY2VlZHMsIHRoZSBjcmVhdG9yIGNhbGxzIHRoaXMgdG8gY2xhaW0gZnVuZHMuAAAABWNsYWltAAAAAAAAAAAAAAA=",
            "AAAAAAAAADNCYWNrZXJzIGNhbGwgdGhpcyB0byBwbGVkZ2UgdG9rZW5zIHRvIHRoZSBjYW1wYWlnbi4AAAAABnBsZWRnZQAAAAAAAgAAAAAAAAAGYmFja2VyAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
            "AAAAAAAAAEFJZiB0aGUgY2FtcGFpZ24gZmFpbHMsIGJhY2tlcnMgY2FsbCB0aGlzIHRvIHJlZnVuZCB0aGVpciBwbGVkZ2VzLgAAAAAAAAZyZWZ1bmQAAAAAAAEAAAAAAAAABmJhY2tlcgAAAAAAEwAAAAA=",
            "AAAAAAAAACFHZXQgY3VycmVudCBzdGF0ZSBvZiB0aGUgY2FtcGFpZ24AAAAAAAAJZ2V0X3N0YXRlAAAAAAAAAAAAAAEAAAfQAAAADUNhbXBhaWduU3RhdGUAAAA=",
            "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAgAAAAAAAAAAAAAABVN0YXRlAAAAAAAAAQAAAAAAAAAGUGxlZGdlAAAAAAABAAAAEw==",
            "AAAAAQAAAAAAAAAAAAAADUNhbXBhaWduU3RhdGUAAAAAAAAGAAAAAAAAAAdjcmVhdG9yAAAAABMAAAAAAAAADmN1cnJlbnRfYW1vdW50AAAAAAALAAAAAAAAAAhkZWFkbGluZQAAAAYAAAAAAAAABGdvYWwAAAALAAAAAAAAAAppc19jbGFpbWVkAAAAAAABAAAAAAAAAAV0b2tlbgAAAAAAABM="]), options);
        this.options = options;
    }
    fromJSON = {
        init: (this.txFromJSON),
        claim: (this.txFromJSON),
        pledge: (this.txFromJSON),
        refund: (this.txFromJSON),
        get_state: (this.txFromJSON)
    };
}
