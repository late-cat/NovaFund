import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
if (typeof window !== "undefined") {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CBGNLTWENII3LYUUVFU7DKCXV4HQTEKJQEUWXJKVIMVNMQL7E2DP2MEM",
    }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAAAAAENJbml0aWFsaXplIHRoZSBmYWN0b3J5IHdpdGggdGhlIFdBU00gaGFzaCBvZiB0aGUgQ2FtcGFpZ24gY29udHJhY3QuAAAAAARpbml0AAAAAQAAAAAAAAAJd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
            "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAgAAAAAAAAAAAAAACFdhc21IYXNoAAAAAAAAAAAAAAAJQ2FtcGFpZ25zAAAA",
            "AAAAAAAAACtSZXR1cm5zIHRoZSBsaXN0IG9mIGFsbCBkZXBsb3llZCBjYW1wYWlnbnMuAAAAAA1nZXRfY2FtcGFpZ25zAAAAAAAAAAAAAAEAAAPqAAAAEw==",
            "AAAAAAAAADNEZXBsb3lzIGEgbmV3IENhbXBhaWduIGNvbnRyYWN0IGFuZCBpbml0aWFsaXplcyBpdC4AAAAAD2NyZWF0ZV9jYW1wYWlnbgAAAAAFAAAAAAAAAAdjcmVhdG9yAAAAABMAAAAAAAAABXRva2VuAAAAAAAAEwAAAAAAAAAEZ29hbAAAAAsAAAAAAAAACGRlYWRsaW5lAAAABgAAAAAAAAAEc2FsdAAAA+4AAAAgAAAAAQAAABM="]), options);
        this.options = options;
    }
    fromJSON = {
        init: (this.txFromJSON),
        get_campaigns: (this.txFromJSON),
        create_campaign: (this.txFromJSON)
    };
}
