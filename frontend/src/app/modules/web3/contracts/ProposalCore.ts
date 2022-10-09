/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from './common';
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from '@ethersproject/abi';
import type { Listener, Provider } from '@ethersproject/providers';
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from 'ethers';

export interface ProposalCoreInterface extends utils.Interface {
  functions: {
    'CANCELLED()': FunctionFragment;
    'FINISHED()': FunctionFragment;
    'IN_DEVELOPMENT()': FunctionFragment;
    'IN_DISPUTE()': FunctionFragment;
    'IN_DISPUTE_DISTRIBUTION()': FunctionFragment;
    'WAITING_BID()': FunctionFragment;
    'cancelProposal(uint256)': FunctionFragment;
    'createProposal(string,string,string,string)': FunctionFragment;
    'getCountOfProposals()': FunctionFragment;
    'getCountOfProposalsByUser(address)': FunctionFragment;
    'getProposalById(uint256)': FunctionFragment;
    'getProposalIdByUserAndIndex(address,uint256)': FunctionFragment;
    'getStatusOfProposal(uint256)': FunctionFragment;
    'onBidderSelected(uint256)': FunctionFragment;
    'onCreateDispute(uint256)': FunctionFragment;
    'onMediatorSelected(uint256)': FunctionFragment;
    'onPaymentTransferred(uint256,address)': FunctionFragment;
    'onSelectDistribution(uint256,uint256,address,uint8)': FunctionFragment;
    'owner()': FunctionFragment;
    'renounceOwnership()': FunctionFragment;
    'setBidContractAddress(address)': FunctionFragment;
    'setDisputeContractAddress(address)': FunctionFragment;
    'transferOwnership(address)': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'CANCELLED'
      | 'FINISHED'
      | 'IN_DEVELOPMENT'
      | 'IN_DISPUTE'
      | 'IN_DISPUTE_DISTRIBUTION'
      | 'WAITING_BID'
      | 'cancelProposal'
      | 'createProposal'
      | 'getCountOfProposals'
      | 'getCountOfProposalsByUser'
      | 'getProposalById'
      | 'getProposalIdByUserAndIndex'
      | 'getStatusOfProposal'
      | 'onBidderSelected'
      | 'onCreateDispute'
      | 'onMediatorSelected'
      | 'onPaymentTransferred'
      | 'onSelectDistribution'
      | 'owner'
      | 'renounceOwnership'
      | 'setBidContractAddress'
      | 'setDisputeContractAddress'
      | 'transferOwnership',
  ): FunctionFragment;

  encodeFunctionData(functionFragment: 'CANCELLED', values?: undefined): string;

  encodeFunctionData(functionFragment: 'FINISHED', values?: undefined): string;

  encodeFunctionData(
    functionFragment: 'IN_DEVELOPMENT',
    values?: undefined,
  ): string;

  encodeFunctionData(
    functionFragment: 'IN_DISPUTE',
    values?: undefined,
  ): string;

  encodeFunctionData(
    functionFragment: 'IN_DISPUTE_DISTRIBUTION',
    values?: undefined,
  ): string;

  encodeFunctionData(
    functionFragment: 'WAITING_BID',
    values?: undefined,
  ): string;

  encodeFunctionData(
    functionFragment: 'cancelProposal',
    values: [PromiseOrValue<BigNumberish>],
  ): string;

  encodeFunctionData(
    functionFragment: 'createProposal',
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>
    ],
  ): string;

  encodeFunctionData(
    functionFragment: 'getCountOfProposals',
    values?: undefined,
  ): string;

  encodeFunctionData(
    functionFragment: 'getCountOfProposalsByUser',
    values: [PromiseOrValue<string>],
  ): string;

  encodeFunctionData(
    functionFragment: 'getProposalById',
    values: [PromiseOrValue<BigNumberish>],
  ): string;

  encodeFunctionData(
    functionFragment: 'getProposalIdByUserAndIndex',
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>],
  ): string;

  encodeFunctionData(
    functionFragment: 'getStatusOfProposal',
    values: [PromiseOrValue<BigNumberish>],
  ): string;

  encodeFunctionData(
    functionFragment: 'onBidderSelected',
    values: [PromiseOrValue<BigNumberish>],
  ): string;

  encodeFunctionData(
    functionFragment: 'onCreateDispute',
    values: [PromiseOrValue<BigNumberish>],
  ): string;

  encodeFunctionData(
    functionFragment: 'onMediatorSelected',
    values: [PromiseOrValue<BigNumberish>],
  ): string;

  encodeFunctionData(
    functionFragment: 'onPaymentTransferred',
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>],
  ): string;

  encodeFunctionData(
    functionFragment: 'onSelectDistribution',
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ],
  ): string;

  encodeFunctionData(functionFragment: 'owner', values?: undefined): string;

  encodeFunctionData(
    functionFragment: 'renounceOwnership',
    values?: undefined,
  ): string;

  encodeFunctionData(
    functionFragment: 'setBidContractAddress',
    values: [PromiseOrValue<string>],
  ): string;

  encodeFunctionData(
    functionFragment: 'setDisputeContractAddress',
    values: [PromiseOrValue<string>],
  ): string;

  encodeFunctionData(
    functionFragment: 'transferOwnership',
    values: [PromiseOrValue<string>],
  ): string;

  decodeFunctionResult(functionFragment: 'CANCELLED', data: BytesLike): Result;

  decodeFunctionResult(functionFragment: 'FINISHED', data: BytesLike): Result;

  decodeFunctionResult(
    functionFragment: 'IN_DEVELOPMENT',
    data: BytesLike,
  ): Result;

  decodeFunctionResult(functionFragment: 'IN_DISPUTE', data: BytesLike): Result;

  decodeFunctionResult(
    functionFragment: 'IN_DISPUTE_DISTRIBUTION',
    data: BytesLike,
  ): Result;

  decodeFunctionResult(
    functionFragment: 'WAITING_BID',
    data: BytesLike,
  ): Result;

  decodeFunctionResult(
    functionFragment: 'cancelProposal',
    data: BytesLike,
  ): Result;

  decodeFunctionResult(
    functionFragment: 'createProposal',
    data: BytesLike,
  ): Result;

  decodeFunctionResult(
    functionFragment: 'getCountOfProposals',
    data: BytesLike,
  ): Result;

  decodeFunctionResult(
    functionFragment: 'getCountOfProposalsByUser',
    data: BytesLike,
  ): Result;

  decodeFunctionResult(
    functionFragment: 'getProposalById',
    data: BytesLike,
  ): Result;

  decodeFunctionResult(
    functionFragment: 'getProposalIdByUserAndIndex',
    data: BytesLike,
  ): Result;

  decodeFunctionResult(
    functionFragment: 'getStatusOfProposal',
    data: BytesLike,
  ): Result;

  decodeFunctionResult(
    functionFragment: 'onBidderSelected',
    data: BytesLike,
  ): Result;

  decodeFunctionResult(
    functionFragment: 'onCreateDispute',
    data: BytesLike,
  ): Result;

  decodeFunctionResult(
    functionFragment: 'onMediatorSelected',
    data: BytesLike,
  ): Result;

  decodeFunctionResult(
    functionFragment: 'onPaymentTransferred',
    data: BytesLike,
  ): Result;

  decodeFunctionResult(
    functionFragment: 'onSelectDistribution',
    data: BytesLike,
  ): Result;

  decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;

  decodeFunctionResult(
    functionFragment: 'renounceOwnership',
    data: BytesLike,
  ): Result;

  decodeFunctionResult(
    functionFragment: 'setBidContractAddress',
    data: BytesLike,
  ): Result;

  decodeFunctionResult(
    functionFragment: 'setDisputeContractAddress',
    data: BytesLike,
  ): Result;

  decodeFunctionResult(
    functionFragment: 'transferOwnership',
    data: BytesLike,
  ): Result;

  events: {
    'Created(uint256,string,uint256)': EventFragment;
    'OnChangeBidAddress(address,address)': EventFragment;
    'OnChangeDisputeAddress(address,address)': EventFragment;
    'OwnershipTransferred(address,address)': EventFragment;
    'StatusChanged(uint256,bytes32,bytes32)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'Created'): EventFragment;

  getEvent(nameOrSignatureOrTopic: 'OnChangeBidAddress'): EventFragment;

  getEvent(nameOrSignatureOrTopic: 'OnChangeDisputeAddress'): EventFragment;

  getEvent(nameOrSignatureOrTopic: 'OwnershipTransferred'): EventFragment;

  getEvent(nameOrSignatureOrTopic: 'StatusChanged'): EventFragment;
}

export interface CreatedEventObject {
  id: BigNumber;
  category: string;
  amount: BigNumber;
}

export type CreatedEvent = TypedEvent<[BigNumber, string, BigNumber],
  CreatedEventObject>;

export type CreatedEventFilter = TypedEventFilter<CreatedEvent>;

export interface OnChangeBidAddressEventObject {
  oldAddress: string;
  newAddress: string;
}

export type OnChangeBidAddressEvent = TypedEvent<[string, string],
  OnChangeBidAddressEventObject>;

export type OnChangeBidAddressEventFilter =
  TypedEventFilter<OnChangeBidAddressEvent>;

export interface OnChangeDisputeAddressEventObject {
  oldAddress: string;
  newAddress: string;
}

export type OnChangeDisputeAddressEvent = TypedEvent<[string, string],
  OnChangeDisputeAddressEventObject>;

export type OnChangeDisputeAddressEventFilter =
  TypedEventFilter<OnChangeDisputeAddressEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}

export type OwnershipTransferredEvent = TypedEvent<[string, string],
  OwnershipTransferredEventObject>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface StatusChangedEventObject {
  proposalId: BigNumber;
  oldStatus: string;
  newStatus: string;
}

export type StatusChangedEvent = TypedEvent<[BigNumber, string, string],
  StatusChangedEventObject>;

export type StatusChangedEventFilter = TypedEventFilter<StatusChangedEvent>;

export interface ProposalCore extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;

  attach(addressOrName: string): this;

  deployed(): Promise<this>;

  interface: ProposalCoreInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>,
  ): Array<TypedListener<TEvent>>;

  listeners(eventName?: string): Array<Listener>;

  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>,
  ): this;

  removeAllListeners(eventName?: string): this;

  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    CANCELLED(overrides?: CallOverrides): Promise<[string]>;

    FINISHED(overrides?: CallOverrides): Promise<[string]>;

    IN_DEVELOPMENT(overrides?: CallOverrides): Promise<[string]>;

    IN_DISPUTE(overrides?: CallOverrides): Promise<[string]>;

    IN_DISPUTE_DISTRIBUTION(overrides?: CallOverrides): Promise<[string]>;

    WAITING_BID(overrides?: CallOverrides): Promise<[string]>;

    cancelProposal(
      proposalId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    createProposal(
      name: PromiseOrValue<string>,
      description: PromiseOrValue<string>,
      category: PromiseOrValue<string>,
      contactInfo: PromiseOrValue<string>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    getCountOfProposals(overrides?: CallOverrides): Promise<[BigNumber]>;

    getCountOfProposalsByUser(
      userAddress: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;

    getProposalById(
      proposalId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[string, string, string, string, string, BigNumber, string, BigNumber] & {
      name: string;
      description: string;
      category: string;
      contactInfo: string;
      creator: string;
      amount: BigNumber;
      status: string;
      createdAt: BigNumber;
    }>;

    getProposalIdByUserAndIndex(
      userAddress: PromiseOrValue<string>,
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;

    getStatusOfProposal(
      proposalId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[string]>;

    onBidderSelected(
      proposalId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    onCreateDispute(
      proposalId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    onMediatorSelected(
      proposalId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    onPaymentTransferred(
      proposalId: PromiseOrValue<BigNumberish>,
      bidderAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    onSelectDistribution(
      proposalId: PromiseOrValue<BigNumberish>,
      bidId: PromiseOrValue<BigNumberish>,
      bidderAddress: PromiseOrValue<string>,
      splitBidderShare: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    setBidContractAddress(
      contractAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    setDisputeContractAddress(
      contractAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;
  };

  CANCELLED(overrides?: CallOverrides): Promise<string>;

  FINISHED(overrides?: CallOverrides): Promise<string>;

  IN_DEVELOPMENT(overrides?: CallOverrides): Promise<string>;

  IN_DISPUTE(overrides?: CallOverrides): Promise<string>;

  IN_DISPUTE_DISTRIBUTION(overrides?: CallOverrides): Promise<string>;

  WAITING_BID(overrides?: CallOverrides): Promise<string>;

  cancelProposal(
    proposalId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  createProposal(
    name: PromiseOrValue<string>,
    description: PromiseOrValue<string>,
    category: PromiseOrValue<string>,
    contactInfo: PromiseOrValue<string>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  getCountOfProposals(overrides?: CallOverrides): Promise<BigNumber>;

  getCountOfProposalsByUser(
    userAddress: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  getProposalById(
    proposalId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<[string, string, string, string, string, BigNumber, string, BigNumber] & {
    name: string;
    description: string;
    category: string;
    contactInfo: string;
    creator: string;
    amount: BigNumber;
    status: string;
    createdAt: BigNumber;
  }>;

  getProposalIdByUserAndIndex(
    userAddress: PromiseOrValue<string>,
    index: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  getStatusOfProposal(
    proposalId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<string>;

  onBidderSelected(
    proposalId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  onCreateDispute(
    proposalId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  onMediatorSelected(
    proposalId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  onPaymentTransferred(
    proposalId: PromiseOrValue<BigNumberish>,
    bidderAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  onSelectDistribution(
    proposalId: PromiseOrValue<BigNumberish>,
    bidId: PromiseOrValue<BigNumberish>,
    bidderAddress: PromiseOrValue<string>,
    splitBidderShare: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  setBidContractAddress(
    contractAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  setDisputeContractAddress(
    contractAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  callStatic: {
    CANCELLED(overrides?: CallOverrides): Promise<string>;

    FINISHED(overrides?: CallOverrides): Promise<string>;

    IN_DEVELOPMENT(overrides?: CallOverrides): Promise<string>;

    IN_DISPUTE(overrides?: CallOverrides): Promise<string>;

    IN_DISPUTE_DISTRIBUTION(overrides?: CallOverrides): Promise<string>;

    WAITING_BID(overrides?: CallOverrides): Promise<string>;

    cancelProposal(
      proposalId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;

    createProposal(
      name: PromiseOrValue<string>,
      description: PromiseOrValue<string>,
      category: PromiseOrValue<string>,
      contactInfo: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    getCountOfProposals(overrides?: CallOverrides): Promise<BigNumber>;

    getCountOfProposalsByUser(
      userAddress: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    getProposalById(
      proposalId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[string, string, string, string, string, BigNumber, string, BigNumber] & {
      name: string;
      description: string;
      category: string;
      contactInfo: string;
      creator: string;
      amount: BigNumber;
      status: string;
      createdAt: BigNumber;
    }>;

    getProposalIdByUserAndIndex(
      userAddress: PromiseOrValue<string>,
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    getStatusOfProposal(
      proposalId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<string>;

    onBidderSelected(
      proposalId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;

    onCreateDispute(
      proposalId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;

    onMediatorSelected(
      proposalId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;

    onPaymentTransferred(
      proposalId: PromiseOrValue<BigNumberish>,
      bidderAddress: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<void>;

    onSelectDistribution(
      proposalId: PromiseOrValue<BigNumberish>,
      bidId: PromiseOrValue<BigNumberish>,
      bidderAddress: PromiseOrValue<string>,
      splitBidderShare: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setBidContractAddress(
      contractAddress: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<void>;

    setDisputeContractAddress(
      contractAddress: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<void>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<void>;
  };

  filters: {
    'Created(uint256,string,uint256)'(
      id?: null,
      category?: PromiseOrValue<string> | null,
      amount?: PromiseOrValue<BigNumberish> | null,
    ): CreatedEventFilter;
    Created(
      id?: null,
      category?: PromiseOrValue<string> | null,
      amount?: PromiseOrValue<BigNumberish> | null,
    ): CreatedEventFilter;

    'OnChangeBidAddress(address,address)'(
      oldAddress?: null,
      newAddress?: null,
    ): OnChangeBidAddressEventFilter;
    OnChangeBidAddress(
      oldAddress?: null,
      newAddress?: null,
    ): OnChangeBidAddressEventFilter;

    'OnChangeDisputeAddress(address,address)'(
      oldAddress?: null,
      newAddress?: null,
    ): OnChangeDisputeAddressEventFilter;
    OnChangeDisputeAddress(
      oldAddress?: null,
      newAddress?: null,
    ): OnChangeDisputeAddressEventFilter;

    'OwnershipTransferred(address,address)'(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null,
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null,
    ): OwnershipTransferredEventFilter;

    'StatusChanged(uint256,bytes32,bytes32)'(
      proposalId?: PromiseOrValue<BigNumberish> | null,
      oldStatus?: null,
      newStatus?: PromiseOrValue<BytesLike> | null,
    ): StatusChangedEventFilter;
    StatusChanged(
      proposalId?: PromiseOrValue<BigNumberish> | null,
      oldStatus?: null,
      newStatus?: PromiseOrValue<BytesLike> | null,
    ): StatusChangedEventFilter;
  };

  estimateGas: {
    CANCELLED(overrides?: CallOverrides): Promise<BigNumber>;

    FINISHED(overrides?: CallOverrides): Promise<BigNumber>;

    IN_DEVELOPMENT(overrides?: CallOverrides): Promise<BigNumber>;

    IN_DISPUTE(overrides?: CallOverrides): Promise<BigNumber>;

    IN_DISPUTE_DISTRIBUTION(overrides?: CallOverrides): Promise<BigNumber>;

    WAITING_BID(overrides?: CallOverrides): Promise<BigNumber>;

    cancelProposal(
      proposalId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    createProposal(
      name: PromiseOrValue<string>,
      description: PromiseOrValue<string>,
      category: PromiseOrValue<string>,
      contactInfo: PromiseOrValue<string>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    getCountOfProposals(overrides?: CallOverrides): Promise<BigNumber>;

    getCountOfProposalsByUser(
      userAddress: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    getProposalById(
      proposalId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    getProposalIdByUserAndIndex(
      userAddress: PromiseOrValue<string>,
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    getStatusOfProposal(
      proposalId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    onBidderSelected(
      proposalId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    onCreateDispute(
      proposalId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    onMediatorSelected(
      proposalId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    onPaymentTransferred(
      proposalId: PromiseOrValue<BigNumberish>,
      bidderAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    onSelectDistribution(
      proposalId: PromiseOrValue<BigNumberish>,
      bidId: PromiseOrValue<BigNumberish>,
      bidderAddress: PromiseOrValue<string>,
      splitBidderShare: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    setBidContractAddress(
      contractAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    setDisputeContractAddress(
      contractAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    CANCELLED(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    FINISHED(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    IN_DEVELOPMENT(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    IN_DISPUTE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    IN_DISPUTE_DISTRIBUTION(
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    WAITING_BID(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    cancelProposal(
      proposalId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    createProposal(
      name: PromiseOrValue<string>,
      description: PromiseOrValue<string>,
      category: PromiseOrValue<string>,
      contactInfo: PromiseOrValue<string>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    getCountOfProposals(
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getCountOfProposalsByUser(
      userAddress: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getProposalById(
      proposalId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getProposalIdByUserAndIndex(
      userAddress: PromiseOrValue<string>,
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getStatusOfProposal(
      proposalId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    onBidderSelected(
      proposalId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    onCreateDispute(
      proposalId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    onMediatorSelected(
      proposalId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    onPaymentTransferred(
      proposalId: PromiseOrValue<BigNumberish>,
      bidderAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    onSelectDistribution(
      proposalId: PromiseOrValue<BigNumberish>,
      bidId: PromiseOrValue<BigNumberish>,
      bidderAddress: PromiseOrValue<string>,
      splitBidderShare: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    setBidContractAddress(
      contractAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    setDisputeContractAddress(
      contractAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;
  };
}
