#!/usr/bin/env node
import dotenv from "dotenv"
import { createCommand } from "commander"
import { readLocalJsonFile } from "./lib/files.js"
import {
  auth,
  genkeys,
  deploy,
  initialize,
  addRecipients,
  signup,
  doTheThing,
  fund,
  recover,
  tally
} from "./commands/index.js"

dotenv.config()

const pkg = readLocalJsonFile("../../package.json")

const program = createCommand()

// Entry point.
program.name(pkg.name).description(pkg.description).version(pkg.version)

program
  .command("auth")
  .description(
    "Allow to interact with the blockchain-related commands (e.g., deploy) with a wallet by passing in wallet's mnemonic."
  )
  .argument("<mnemonic>", "the secret mnemonic phrase (e.g., 12 words) separated by spaces")
  .action((mnemonic: string) => {
    auth(mnemonic)
  })

program
  .command("genkeys")
  .description("Generate a new specified amount of MACI and ETH keypairs (QR Codes and csvs included)")
  .argument("<amount>", "amount of MACI and ETH keypairs to be generated")
  .action((amount: number) => {
    genkeys(amount)
  })
  .addHelpCommand(`ethlatamcli genkeys 3000`)

program
  .command("contracts:deploy")
  .description(
    "Deploy the smart contracts infrastructure necessary for running a new QFI/MACI instance for a specified network"
  )
  .argument("<network>", "the network where the contracts will be deployed")
  .action((network: string) => {
    deploy(network)
  })


program
  .command("initialize")
  .description("Initialize the deployed MACI/QFI smart contracts")
  .argument("<network>", "the network where the contracts has been deployed")
  .action((network: string) => {
    initialize(network)
  })

program
  .command("contracts:add-recipients")
  .description(
    "Add recipients on RecipientRegistry Smart Contract deployed on the network by taking data from CSV input file specified in the path"
  )
  .argument("<network>", "the network where the contracts has been deployed")
  .argument("<path>", "the path of the CSV input file where the recipients data is stored")
  .action((network: string, path: string) => {
    addRecipients(network, path)
  })

program
  .command("contracts:signup")
  .description("Signup users and refill with some crypto their addresses")
  .argument("<network>", "the network where the contracts has been deployed")
  .argument("<path>", "the path of the CSV input file where the signup data for users is stored")
  .action((network: string, path: string) => {
    signup(network, path)
  })

// INFO: 一次做上方的指令: genkeys, initialize, deploy, add-recipients, signup
program
  .command("dothething")
  .description("Does all the things without user input")
  .argument("<network>", "the network where the contracts has been deployed")
  .action((network: string) => {
    doTheThing(network)
  })

program
  .command("fund")
  .description("seeds user keys with 0.1 base network currency")
  .argument("<network>", "the network where the contracts has been deployed")
  .action((network: string) => {
    fund(network)
  })

program
  .command("recover")
  .description("continues signups at specified stateindex")
  .argument("<network>", "the network where the contracts has been deployed")
  .action((network: string) => {
    recover(network)
  })

// INFO: Calculate the tally of the current vote offchain
// npm run tally --network goerli --coordinatorPrivkey "macisk.2c512a29f5ac0d8f6d706c83c4e6350835157fa9a1e73a3f095a4d12f3fd3df3" --matchingPoolAmount 1000 --qfiContractAddress 0xBF3d5526970D5B3474fFf6ac8879d15b99Cdb5EF --startBlock 9911912 --lastBlock "latest" --firstVoteBlock "9912358"
program
  .command("tally")
  .description("calculates the tally of the current vote offchain")
  .argument("<network>", "the network where the contracts has been deployed")
  .argument("<coordinatorPrivkey>", "MACI privatekey used by coodinator in Diffie Hellman Secret")
  .argument("<matchingPoolAmount>", "Amount of xDAI to use for matching pool (dollar amount)")
  .argument("<qfiContractAddress>", "Block QFI contracts were deployed on")
  .argument("<startBlock>", "Block QFI contracts were deployed on")
  .argument("<firstVoteBlock>", "First block a vote was cast")
  .argument("<lastBlock>", "Last block to check for vote messages on, 'latest' for current block number")
  .action(
    (
      network: string,
      coordinatorPrivkey: string,
      matchingPoolAmount: string,
      qfiContractAddress: string,
      startBlock: string, 
      firstVoteBlock:string,
      lastBlock: string
    ) => {
      var optionalLastBlock = lastBlock === "latest" ? "latest" : lastBlock
      
      tally(network, coordinatorPrivkey, matchingPoolAmount, qfiContractAddress, startBlock, firstVoteBlock,  optionalLastBlock)
    }
  )

program.parseAsync()
