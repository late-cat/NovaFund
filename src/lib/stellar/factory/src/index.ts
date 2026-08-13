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


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CBPZXCKCLDUM24BHNINPWQBEVJ5NFUTOQWIWMUJOE4SELLZF4UI4YEG6",
  }
} as const

export type DataKey = {tag: "WasmHash", values: void} | {tag: "CampaignCount", values: void} | {tag: "Campaign", values: readonly [u32]};

export interface Client {
  /**
   * Construct and simulate a init transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initialize the factory with the WASM hash of the Campaign contract.
   */
  init: ({wasm_hash}: {wasm_hash: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_campaigns transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Returns a paginated list of deployed campaigns.
   */
  get_campaigns: ({start, limit}: {start: u32, limit: u32}, options?: MethodOptions) => Promise<AssembledTransaction<Array<string>>>

  /**
   * Construct and simulate a create_campaign transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Deploys a new Campaign contract and initializes it.
   */
  create_campaign: ({creator, token, goal, deadline, salt, name, description, image_url}: {creator: string, token: string, goal: i128, deadline: u64, salt: Buffer, name: string, description: string, image_url: string}, options?: MethodOptions) => Promise<AssembledTransaction<string>>

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
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAwAAAAAAAAAAAAAACFdhc21IYXNoAAAAAAAAAAAAAAANQ2FtcGFpZ25Db3VudAAAAAAAAAEAAAAAAAAACENhbXBhaWduAAAAAQAAAAQ=",
        "AAAAAAAAAENJbml0aWFsaXplIHRoZSBmYWN0b3J5IHdpdGggdGhlIFdBU00gaGFzaCBvZiB0aGUgQ2FtcGFpZ24gY29udHJhY3QuAAAAAARpbml0AAAAAQAAAAAAAAAJd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
        "AAAAAAAAAC9SZXR1cm5zIGEgcGFnaW5hdGVkIGxpc3Qgb2YgZGVwbG95ZWQgY2FtcGFpZ25zLgAAAAANZ2V0X2NhbXBhaWducwAAAAAAAAIAAAAAAAAABXN0YXJ0AAAAAAAABAAAAAAAAAAFbGltaXQAAAAAAAAEAAAAAQAAA+oAAAAT",
        "AAAAAAAAADNEZXBsb3lzIGEgbmV3IENhbXBhaWduIGNvbnRyYWN0IGFuZCBpbml0aWFsaXplcyBpdC4AAAAAD2NyZWF0ZV9jYW1wYWlnbgAAAAAIAAAAAAAAAAdjcmVhdG9yAAAAABMAAAAAAAAABXRva2VuAAAAAAAAEwAAAAAAAAAEZ29hbAAAAAsAAAAAAAAACGRlYWRsaW5lAAAABgAAAAAAAAAEc2FsdAAAA+4AAAAgAAAAAAAAAARuYW1lAAAAEAAAAAAAAAALZGVzY3JpcHRpb24AAAAAEAAAAAAAAAAJaW1hZ2VfdXJsAAAAAAAAEAAAAAEAAAAT" ]),
      options
    )
  }
  public readonly fromJSON = {
    init: this.txFromJSON<null>,
        get_campaigns: this.txFromJSON<Array<string>>,
        create_campaign: this.txFromJSON<string>
  }
}