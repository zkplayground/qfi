/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  Overrides,
  BigNumberish,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  SimpleHackathon,
  SimpleHackathonInterface,
} from "../SimpleHackathon";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_balance",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_controller",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "_recipientId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "_metadata",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_timestamp",
        type: "uint256",
      },
    ],
    name: "RecipientAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "_recipientId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_timestamp",
        type: "uint256",
      },
    ],
    name: "RecipientRemoved",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
      {
        internalType: "string",
        name: "_metadata",
        type: "string",
      },
    ],
    name: "addRecipient",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "controller",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_startTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_endTime",
        type: "uint256",
      },
    ],
    name: "getRecipientAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRecipientCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "getVoiceCredits",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maci",
    outputs: [
      {
        internalType: "contract MACI",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxRecipients",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "register",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_recipientId",
        type: "bytes32",
      },
    ],
    name: "removeRecipient",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract MACI",
        name: "_maci",
        type: "address",
      },
    ],
    name: "setMaciInstance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_maxRecipients",
        type: "uint256",
      },
    ],
    name: "setMaxRecipients",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5060405161129838038061129883398101604081905261002f916100bd565b8061004061003b610069565b61006d565b600180546001600160a01b0319166001600160a01b0392909216919091179055506007556100f8565b3390565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b600080604083850312156100cf578182fd5b825160208401519092506001600160a01b03811681146100ed578182fd5b809150509250929050565b611191806101076000396000f3fe608060405234801561001057600080fd5b50600436106100ba5760003560e01c806313e65cf3146100bf578063148ec9ab146100d457806324b8fbf6146100fd57806334a0922c1461011057806362564ed414610125578063715018a614610138578063739b53841461014057806388a13072146101535780638da5cb5b14610168578063af99b63f14610170578063b36543a914610178578063d7c9ebdd1461018b578063f2fde38b1461019e578063f77c4791146101b1575b600080fd5b6100d26100cd366004610ad9565b6101b9565b005b6100e76100e2366004610c32565b610223565b6040516100f49190610d01565b60405180910390f35b6100d261010b366004610af5565b61026f565b6101186102d5565b6040516100f49190610c9d565b610118610133366004610c4a565b6102e4565b6100d2610481565b6100d261014e366004610bb3565b6104cc565b61015b6105d2565b6040516100f4919061108b565b6101186105d8565b61015b6105e7565b61015b610186366004610af5565b6105fe565b6100d2610199366004610c32565b610606565b6100d26101ac366004610ad9565b610689565b6101186106fa565b6101c1610709565b6001600160a01b03166101d26105d8565b6001600160a01b0316146102015760405162461bcd60e51b81526004016101f890610fa9565b60405180910390fd5b600680546001600160a01b0319166001600160a01b0392909216919091179055565b60006002548210156102475760405162461bcd60e51b81526004016101f890610ec5565b6001546001600160a01b031633146102615750600061026a565b50600281905560015b919050565b6006546001600160a01b031633146102995760405162461bcd60e51b81526004016101f890610fde565b6102a16105d8565b6001600160a01b0316826001600160a01b0316146102d15760405162461bcd60e51b81526004016101f890610d5c565b5050565b6006546001600160a01b031681565b60008315806102f4575060055484115b156103015750600061047a565b600060056103106001876110ac565b8154811061032e57634e487b7160e01b600052603260045260246000fd5b9060005260206000200180548060200260200160405190810160405280929190818152602001828054801561038257602002820191906000526020600020905b81548152602001906001019080831161036e575b5050505050905080516000141561039d57600091505061047a565b80516000905b8015610475576000836103b76001846110ac565b815181106103d557634e487b7160e01b600052603260045260246000fd5b60209081029190910181015160008181526003808452604091829020825160808101845281546001600160a01b03168152600182015495810195909552600281015492850183905201546060840152909250871015610435575050610463565b60608101511580159061044c575087816060015111155b1561045e57839550505050505061047a565b519250505b8061046d816110c3565b9150506103a3565b509150505b9392505050565b610489610709565b6001600160a01b031661049a6105d8565b6001600160a01b0316146104c05760405162461bcd60e51b81526004016101f890610fa9565b6104ca600061070d565b565b6104d4610709565b6001600160a01b03166104e56105d8565b6001600160a01b03161461050b5760405162461bcd60e51b81526004016101f890610fa9565b6001600160a01b0383166105315760405162461bcd60e51b81526004016101f890610f23565b8061054e5760405162461bcd60e51b81526004016101f890610d0c565b600083838360405160200161056593929190610c75565b6040516020818303038152906040528051906020012090506000610589828661075d565b9050817fddc3968b1ce25baf13504e6d2de09bbf72f4b32b9d80e2f4914842f0f9217b0d86868685426040516105c3959493929190610cb1565b60405180910390a25050505050565b60025481565b6000546001600160a01b031690565b6004546005546000916105f9916110ac565b905090565b505060075490565b61060e610709565b6001600160a01b031661061f6105d8565b6001600160a01b0316146106455760405162461bcd60e51b81526004016101f890610fa9565b61064e816109d6565b807fc678e7ee92280740c8b3be4826e92b29fb5477e2ddc3eb2e9ca45f74daa4972e4260405161067e919061108b565b60405180910390a250565b610691610709565b6001600160a01b03166106a26105d8565b6001600160a01b0316146106c85760405162461bcd60e51b81526004016101f890610fa9565b6001600160a01b0381166106ee5760405162461bcd60e51b81526004016101f890610df4565b6106f78161070d565b50565b6001546001600160a01b031681565b3390565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b600080600254116107805760405162461bcd60e51b81526004016101f890610db9565b600083815260036020526040902060010154156107af5760405162461bcd60e51b81526004016101f89061104e565b60055460009081906107c2906001611094565b9050600254811161086f57604080516001808252818301909252919250829160009160208083019080368337019050509050858160008151811061081657634e487b7160e01b600052603260045260246000fd5b602090810291909101810191909152600580546001810182556000919091528251610868927f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db090920191840190610a79565b5050610968565b60045461088e5760405162461bcd60e51b81526004016101f890610e3a565b60048054600091906108a2906001906110ac565b815481106108c057634e487b7160e01b600052603260045260246000fd5b9060005260206000200154905060048054806108ec57634e487b7160e01b600052603160045260246000fd5b6001900381819060005260206000200160009055905560036000828152602001908152602001600020600101549250600560018461092a91906110ac565b8154811061094857634e487b7160e01b600052603260045260246000fd5b600091825260208083209091018054600181018255908352912001869055505b50604080516080810182526001600160a01b0380861682526020808301858152428486019081526000606086018181528b82526003948590529690209451855494166001600160a01b0319909416939093178455516001840155905160028301559151910155905092915050565b600081815260036020526040902060010154610a045760405162461bcd60e51b81526004016101f890610e72565b6000818152600360208190526040909120015415610a345760405162461bcd60e51b81526004016101f890610f6f565b60008181526003602081905260408220429101556004805460018101825591527f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b0155565b828054828255906000526020600020908101928215610ab4579160200282015b82811115610ab4578251825591602001919060010190610a99565b50610ac0929150610ac4565b5090565b5b80821115610ac05760008155600101610ac5565b600060208284031215610aea578081fd5b813561047a81611106565b60008060408385031215610b07578081fd5b8235610b1281611106565b915060208301356001600160401b0380821115610b2d578283fd5b818501915085601f830112610b40578283fd5b813581811115610b5257610b526110f0565b604051601f8201601f19908116603f01168101908382118183101715610b7a57610b7a6110f0565b81604052828152886020848701011115610b92578586fd5b82602086016020830137856020848301015280955050505050509250929050565b600080600060408486031215610bc7578081fd5b8335610bd281611106565b925060208401356001600160401b0380821115610bed578283fd5b818601915086601f830112610c00578283fd5b813581811115610c0e578384fd5b876020828501011115610c1f578384fd5b6020830194508093505050509250925092565b600060208284031215610c43578081fd5b5035919050565b600080600060608486031215610c5e578283fd5b505081359360208301359350604090920135919050565b606084901b6001600160601b0319168152600082846014840137910160140190815292915050565b6001600160a01b0391909116815260200190565b6001600160a01b038616815260806020820181905281018490526000848660a08401378060a0868401015260a0601f19601f87011683010190508360408301528260608301529695505050505050565b901515815260200190565b60208082526030908201527f526563697069656e7452656769737472793a204d6574616461746120696e666f60408201526f20697320656d70747920737472696e6760801b606082015260800190565b6020808252603e908201527f5369676e5570546f6b656e476174656b65657065723a206f6e6c7920636f6f7260408201527f64696e61746f722063616e2063616c6c20746869732066756e6374696f6e0000606082015260800190565b6020808252602d9082015260008051602061111c83398151915260408201526c1a5d081a5cc81b9bdd081cd95d609a1b606082015260800190565b60208082526026908201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160408201526564647265737360d01b606082015260800190565b6020808252602a9082015260008051602061111c8339815191526040820152691a5d081c995858da195960b21b606082015260800190565b60208082526033908201527f526563697069656e7452656769737472793a20526563697069656e74206973206040820152726e6f7420696e2074686520726567697374727960681b606082015260800190565b602080825260409082018190527f526563697069656e7452656769737472793a204d6178206e756d626572206f66908201527f20726563697069656e74732063616e206e6f7420626520646563726561736564606082015260800190565b6020808252602c908201527f526563697069656e7452656769737472793a20526563697069656e742061646460408201526b72657373206973207a65726f60a01b606082015260800190565b6020808252602c9082015260008051602061113c83398151915260408201526b1958591e481c995b5bdd995960a21b606082015260800190565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b6020808252604a908201527f5369676e5570546f6b656e476174656b65657065723a206f6e6c79207370656360408201527f6966696564204d41434920696e7374616e63652063616e2063616c6c207468696060820152693990333ab731ba34b7b760b11b608082015260a00190565b6020808252602f9082015260008051602061113c83398151915260408201526e1958591e481c9959da5cdd195c9959608a1b606082015260800190565b90815260200190565b600082198211156110a7576110a76110da565b500190565b6000828210156110be576110be6110da565b500390565b6000816110d2576110d26110da565b506000190190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160a01b03811681146106f757600080fdfe526563697069656e7452656769737472793a20526563697069656e74206c696d526563697069656e7452656769737472793a20526563697069656e7420616c72a2646970667358221220af2264b12a30695317a04a848021a58408a622ed6c93a4677913f6aa2f4867e164736f6c63430008010033";

type SimpleHackathonConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SimpleHackathonConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SimpleHackathon__factory extends ContractFactory {
  constructor(...args: SimpleHackathonConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    _balance: BigNumberish,
    _controller: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<SimpleHackathon> {
    return super.deploy(
      _balance,
      _controller,
      overrides || {}
    ) as Promise<SimpleHackathon>;
  }
  getDeployTransaction(
    _balance: BigNumberish,
    _controller: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_balance, _controller, overrides || {});
  }
  attach(address: string): SimpleHackathon {
    return super.attach(address) as SimpleHackathon;
  }
  connect(signer: Signer): SimpleHackathon__factory {
    return super.connect(signer) as SimpleHackathon__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SimpleHackathonInterface {
    return new utils.Interface(_abi) as SimpleHackathonInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SimpleHackathon {
    return new Contract(address, _abi, signerOrProvider) as SimpleHackathon;
  }
}
