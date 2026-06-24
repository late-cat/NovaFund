import { Buffer } from "buffer";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
} from "@stellar/stellar-sdk/contract";
import type { u64, i128 } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
export type DataKey =
  | {
      tag: "State";
      values: void;
    }
  | {
      tag: "Pledge";
      values: readonly [string];
    };
export interface CampaignState {
  creator: string;
  current_amount: i128;
  deadline: u64;
  goal: i128;
  is_claimed: boolean;
  token: string;
}
export interface Client {
  /**
   * Construct and simulate a init transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initializes the campaign. Can only be called once.
   */
  init: (
    {
      creator,
      token,
      goal,
      deadline,
    }: {
      creator: string;
      token: string;
      goal: i128;
      deadline: u64;
    },
    options?: MethodOptions
  ) => Promise<AssembledTransaction<null>>;
  /**
   * Construct and simulate a claim transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * If the campaign succeeds, the creator calls this to claim funds.
   */
  claim: (options?: MethodOptions) => Promise<AssembledTransaction<null>>;
  /**
   * Construct and simulate a pledge transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Backers call this to pledge tokens to the campaign.
   */
  pledge: (
    {
      backer,
      amount,
    }: {
      backer: string;
      amount: i128;
    },
    options?: MethodOptions
  ) => Promise<AssembledTransaction<null>>;
  /**
   * Construct and simulate a refund transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * If the campaign fails, backers call this to refund their pledges.
   */
  refund: (
    {
      backer,
    }: {
      backer: string;
    },
    options?: MethodOptions
  ) => Promise<AssembledTransaction<null>>;
  /**
   * Construct and simulate a get_state transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get current state of the campaign
   */
  get_state: (options?: MethodOptions) => Promise<AssembledTransaction<CampaignState>>;
}
export declare class Client extends ContractClient {
  readonly options: ContractClientOptions;
  static deploy<T = Client>(
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
  ): Promise<AssembledTransaction<T>>;
  constructor(options: ContractClientOptions);
  readonly fromJSON: {
    init: (json: string) => AssembledTransaction<null>;
    claim: (json: string) => AssembledTransaction<null>;
    pledge: (json: string) => AssembledTransaction<null>;
    refund: (json: string) => AssembledTransaction<null>;
    get_state: (json: string) => AssembledTransaction<CampaignState>;
  };
}
