import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}




export type DataKey = {tag: "State", values: void} | {tag: "Pledge", values: readonly [string]};


export interface CampaignState {
  backers: Array<string>;
  creator: string;
  current_amount: i128;
  deadline: u64;
  description: string;
  goal: i128;
  image_url: string;
  is_cancelled: boolean;
  is_claimed: boolean;
  name: string;
  token: string;
}

export interface Client {
  /**
   * Construct and simulate a init transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initializes the campaign. Can only be called once.
   */
  init: ({creator, token, goal, deadline, name, description, image_url}: {creator: string, token: string, goal: i128, deadline: u64, name: string, description: string, image_url: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a claim transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * If the campaign succeeds, the creator calls this to claim funds.
   */
  claim: (options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a prune transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Allows backers to prune their pledge record to free up storage after a successful campaign.
   */
  prune: ({backer}: {backer: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a cancel transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Cancels the campaign and enables immediate refunds for backers.
   */
  cancel: (options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a pledge transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Backers call this to pledge tokens to the campaign.
   */
  pledge: ({backer, amount}: {backer: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a refund transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * If the campaign fails, backers call this to refund their pledges.
   */
  refund: ({backer}: {backer: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_state transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get current state of the campaign
   */
  get_state: (options?: MethodOptions) => Promise<AssembledTransaction<CampaignState>>

  /**
   * Construct and simulate a get_pledge transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get the total amount pledged by a specific backer
   */
  get_pledge: ({backer}: {backer: string}, options?: MethodOptions) => Promise<AssembledTransaction<i128>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAAAAADJJbml0aWFsaXplcyB0aGUgY2FtcGFpZ24uIENhbiBvbmx5IGJlIGNhbGxlZCBvbmNlLgAAAAAABGluaXQAAAAHAAAAAAAAAAdjcmVhdG9yAAAAABMAAAAAAAAABXRva2VuAAAAAAAAEwAAAAAAAAAEZ29hbAAAAAsAAAAAAAAACGRlYWRsaW5lAAAABgAAAAAAAAAEbmFtZQAAABAAAAAAAAAAC2Rlc2NyaXB0aW9uAAAAABAAAAAAAAAACWltYWdlX3VybAAAAAAAABAAAAAA",
        "AAAAAAAAAEBJZiB0aGUgY2FtcGFpZ24gc3VjY2VlZHMsIHRoZSBjcmVhdG9yIGNhbGxzIHRoaXMgdG8gY2xhaW0gZnVuZHMuAAAABWNsYWltAAAAAAAAAAAAAAA=",
        "AAAAAAAAAFtBbGxvd3MgYmFja2VycyB0byBwcnVuZSB0aGVpciBwbGVkZ2UgcmVjb3JkIHRvIGZyZWUgdXAgc3RvcmFnZSBhZnRlciBhIHN1Y2Nlc3NmdWwgY2FtcGFpZ24uAAAAAAVwcnVuZQAAAAAAAAEAAAAAAAAABmJhY2tlcgAAAAAAEwAAAAA=",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAgAAAAAAAAAAAAAABVN0YXRlAAAAAAAAAQAAAAAAAAAGUGxlZGdlAAAAAAABAAAAEw==",
        "AAAAAAAAAD9DYW5jZWxzIHRoZSBjYW1wYWlnbiBhbmQgZW5hYmxlcyBpbW1lZGlhdGUgcmVmdW5kcyBmb3IgYmFja2Vycy4AAAAABmNhbmNlbAAAAAAAAAAAAAA=",
        "AAAAAAAAADNCYWNrZXJzIGNhbGwgdGhpcyB0byBwbGVkZ2UgdG9rZW5zIHRvIHRoZSBjYW1wYWlnbi4AAAAABnBsZWRnZQAAAAAAAgAAAAAAAAAGYmFja2VyAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
        "AAAAAAAAAEFJZiB0aGUgY2FtcGFpZ24gZmFpbHMsIGJhY2tlcnMgY2FsbCB0aGlzIHRvIHJlZnVuZCB0aGVpciBwbGVkZ2VzLgAAAAAAAAZyZWZ1bmQAAAAAAAEAAAAAAAAABmJhY2tlcgAAAAAAEwAAAAA=",
        "AAAAAAAAACFHZXQgY3VycmVudCBzdGF0ZSBvZiB0aGUgY2FtcGFpZ24AAAAAAAAJZ2V0X3N0YXRlAAAAAAAAAAAAAAEAAAfQAAAADUNhbXBhaWduU3RhdGUAAAA=",
        "AAAAAAAAADFHZXQgdGhlIHRvdGFsIGFtb3VudCBwbGVkZ2VkIGJ5IGEgc3BlY2lmaWMgYmFja2VyAAAAAAAACmdldF9wbGVkZ2UAAAAAAAEAAAAAAAAABmJhY2tlcgAAAAAAEwAAAAEAAAAL",
        "AAAAAQAAAAAAAAAAAAAADUNhbXBhaWduU3RhdGUAAAAAAAALAAAAAAAAAAdiYWNrZXJzAAAAA+oAAAATAAAAAAAAAAdjcmVhdG9yAAAAABMAAAAAAAAADmN1cnJlbnRfYW1vdW50AAAAAAALAAAAAAAAAAhkZWFkbGluZQAAAAYAAAAAAAAAC2Rlc2NyaXB0aW9uAAAAABAAAAAAAAAABGdvYWwAAAALAAAAAAAAAAlpbWFnZV91cmwAAAAAAAAQAAAAAAAAAAxpc19jYW5jZWxsZWQAAAABAAAAAAAAAAppc19jbGFpbWVkAAAAAAABAAAAAAAAAARuYW1lAAAAEAAAAAAAAAAFdG9rZW4AAAAAAAAT" ]),
      options
    )
  }
  public readonly fromJSON = {
    init: this.txFromJSON<null>,
        claim: this.txFromJSON<null>,
        prune: this.txFromJSON<null>,
        cancel: this.txFromJSON<null>,
        pledge: this.txFromJSON<null>,
        refund: this.txFromJSON<null>,
        get_state: this.txFromJSON<CampaignState>,
        get_pledge: this.txFromJSON<i128>
  }
}