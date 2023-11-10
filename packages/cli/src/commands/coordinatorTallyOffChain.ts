/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable radix */
/* eslint-disable no-console */

import fs from 'fs';
import path from 'path';
import logSymbols from "log-symbols"
import { clear } from "console"
import chalk from "chalk"
import { BigNumber, BigNumberish, ethers } from "ethers"
import { Message, PubKey, PrivKey, Keypair } from "qaci-domainobjs"
import { MaciState } from "qaci-core"

import { connectToBlockchain, getNetworkExplorerUrl } from "../lib/blockchain.js"
import { QFI__factory } from "../../../contracts/typechain/factories/QFI__factory.js"
import { GrantRound__factory } from "../../../contracts/typechain/factories/GrantRound__factory.js"

import { cleanDir, directoryExists, makeDir, writeLocalJsonFile } from "../lib/files.js"
import {
  deployedContracts,
  header,
  jsonRecipientsRecords,
  mnemonicBaseDirPath,
  mnemonicFilePath,
  outputDirPath
} from "../lib/constants.js"
import { askForConfirmation, customSpinner } from "../lib/prompts.js"

interface SignUpAction {
  type: string
  blockNumber: number
  transactionIndex: number
  stateIndex: number
  pubKey: string
  voiceCreditBalance: number
  timestamp: number
}

interface VoteAction {
  type: string
  blockNumber: number
  transactionIndex: number
  logIndex: number
  message: any
  encPubKey: string
}

interface GrantRoundAction {
  type: string
  blockNumber: number
  transactionIndex: number
  voiceCreditFactor: number
  coordinatorPubKey: string
}

/**
 * Initialize command.
 * @param network <string> - the network where the contracts are going to be deployed.
 */
async function tally(
  network: string,
  coordinatorPrivKey: string,
  matchingPoolAmount: string,
  qfiContractAddress: string,
  startBlock: string,
  firstVoteBlock: string,
  lastBlock: string
) {
  clear()
  console.log({
    network,
    coordinatorPrivKey,
    matchingPoolAmount,
    qfiContractAddress,
    startBlock,
    firstVoteBlock,
    lastBlock
  })

  console.log(header)
  const startTime = new Date();
  //  TODO: save to local file
  // Save to local file.
  const maciBasePath = `${outputDirPath}/maci`
  const signUpsFilePath = `${outputDirPath}/maci/Signups.json`
  const grantRoundsFilePath = `${outputDirPath}/maci/GrantRounds.json`
  const votesFilePath = `${outputDirPath}/maci/Votes.json`
  const signUpFileExists = await directoryExists(signUpsFilePath)
  const grantRoundFileExists = await directoryExists(grantRoundsFilePath)
  const voteFileExists = await directoryExists(votesFilePath)
  try {
    // Check for output directory.
    if (!directoryExists(outputDirPath)) makeDir(outputDirPath)
    if (!directoryExists(maciBasePath)) makeDir(maciBasePath)
    // Check if mnemonic already present.
    if (!directoryExists(mnemonicBaseDirPath) && !directoryExists(mnemonicFilePath))
      throw new Error(`You must first authenticate by running \`auth \\"<your-mnemonic>\\"\` command!`)
    process.stdout.write(`\n`)

    /** NOTE: Set up Web3 Provider */
    const { provider, wallet } = await connectToBlockchain(network)
    const balanceInEthers = ethers.utils.formatEther((await wallet.getBalance()).toString())

    const gasPrice = await provider.getGasPrice()
    const double = BigNumber.from("2")
    const doubleGasPrice = gasPrice.mul(double)
    const gasLimit = ethers.utils.hexlify(10000000)

    const deployer = wallet
    const { confirmation: preFlightCheck } = await askForConfirmation(
      "Ready to Start the Tally Process? This will conduct operations offchain"
    )

    if (!preFlightCheck) {
      console.log(`\nFarewell👋`)
      process.exit(0)
    }

    // Get deployed contracts instances.
    const qfi = new ethers.Contract(qfiContractAddress, QFI__factory.abi, deployer)
    const currentGrantRound = await qfi.currentGrantRound()
    const grantRound = new ethers.Contract(currentGrantRound, GrantRound__factory.abi, deployer)

    const currentBlock = await provider.getBlockNumber()
    const numBlocksPerRequest = 2000
    /// //////////////////////////////////////////////////////////////////////////
    const spinner = customSpinner(`Read Smart Contracts`, "point")
    spinner.start()

    const qfiface = qfi.interface
    const grantRoundIface = grantRound.interface

    const coordinatorPubKeyOnChain = await grantRound.coordinatorPubKey()
    const coordinatorKeyPair: Keypair = new Keypair(PrivKey.unserialize(coordinatorPrivKey))
    const dd = await grantRound.getDeployTimeAndDuration()
    const deployTime = Number(dd[0])
    const duration = Number(dd[1])
    const BLOCKSPERDAY = 43200
    const firstBlock = parseInt(startBlock)
    const firstVote =  parseInt(firstVoteBlock);
    const lastBlockSignups = (4 / 24) * BLOCKSPERDAY + firstBlock
    const lastBlockVotes = lastBlock == "latest" ? currentBlock : parseInt(lastBlock)
    // (2 / (60 * 60 * 24) + 1) * 43200 + startBlock
    const onChainMaxValues = await grantRound.maxValues()
    const onChainTreeDepths = await grantRound.treeDepths()
    const onChainBatchSizes = await grantRound.batchSizes()
    const stateTreeDepth = await qfi.stateTreeDepth()

    const maxValues = {
      maxMessages: Number(onChainMaxValues.maxMessages.toNumber()),
      maxVoteOptions: Number(onChainMaxValues.maxVoteOptions.toNumber())
    }
    const treeDepths = {
      intStateTreeDepth: Number(onChainTreeDepths.intStateTreeDepth),
      messageTreeDepth: Number(onChainTreeDepths.messageTreeDepth),
      messageTreeSubDepth: Number(onChainTreeDepths.messageTreeSubDepth),
      voteOptionTreeDepth: Number(onChainTreeDepths.voteOptionTreeDepth)
    }
    const batchSizes = {
      tallyBatchSize: Number(onChainBatchSizes.tallyBatchSize),
      messageBatchSize: Number(onChainBatchSizes.messageBatchSize)
    }
    console.log(`\n`)
    console.log("Coordinator PubKey:", coordinatorPubKeyOnChain)
    console.log("Deploy Time:", deployTime)
    console.log("Duration:", duration)
    console.log("Max Values:", maxValues)
    console.log("Tree Depths:", treeDepths)
    console.log("Batch Sizes:", batchSizes)
    spinner.stop()
    let logsTotal = 0

    /// ///////////////////////////////////////////////////////////////////////////
    console.log(`${logSymbols.success}Fetch Sign up logs`)
    let signUps: SignUpAction[] = []
    logsTotal = 0
    try {
      // NOTE: Get SignUp Actions from QFI Smart Contract
      let signUpLogs = [] as any[]

      for (let i = firstBlock; i < lastBlockSignups; i += numBlocksPerRequest + 1) {
        const fromBlock = i >= currentBlock ? currentBlock : i
        const toBlock = i + numBlocksPerRequest >= currentBlock ? currentBlock : i + numBlocksPerRequest
        const logs = await provider.getLogs({
          ...qfi.filters.SignUp(),
          fromBlock: fromBlock,
          toBlock
        })

        logsTotal += logs.length
        console.log(`${logsTotal} signups found so far, scanned up to block number: ${i} / ${lastBlockSignups}`)

        signUpLogs = signUpLogs.concat(logs)
      }
      console.log("Fetched", signUpLogs.length, "signups\n")

      // NOTE: Decode into actions, sort and save to local file (if not already present).
      signUps = signUpLogs
        .map((log) => {
          const event = qfiface.parseLog(log)

          return {
            type: "SignUp",
            blockNumber: log.blockNumber,
            transactionIndex: log.transactionIndex,
            stateIndex: Number(event.args._stateIndex),
            pubKey: new PubKey(event.args._userPubKey.map((x) => BigInt(x))).serialize(),
            voiceCreditBalance: Number(event.args._voiceCreditBalance),
            timestamp: Number(event.args._timestamp)
          }
        })
        .sort((a, b) => {
          const checkBlock = a.blockNumber - b.blockNumber
          const checkTxIndex = a.transactionIndex - b.transactionIndex
          return checkBlock === 0 ? checkTxIndex : checkBlock
        })
    } catch (err) {
      throw Error(`Failed to get MACI State from Smart Contracts: ${err.message}`)
    }
    // /// ///////////////////////////////////////////////////////////////////////////
    console.log(`${logSymbols.success}Fetch GrantRound logs`)
    logsTotal = 0
    let grantRounds: GrantRoundAction[] = []
    try {
      // NOTE: Get GrantRound Actions from GrantRound Smart Contracts
      let grantRoundLogs = [] as any[]
      for (let i = firstBlock; i < lastBlockSignups; i += numBlocksPerRequest + 1) {
        const fromBlock = i >= currentBlock ? currentBlock : i
        const toBlock = i + numBlocksPerRequest >= currentBlock ? currentBlock : i + numBlocksPerRequest
        const logs = await provider.getLogs({
          ...qfi.filters.GrantRoundDeployed(),
          fromBlock: fromBlock,
          toBlock
        })

        logsTotal += logs.length
        console.log(`${logsTotal} grantRounds found so far, scanned up to block number: ${i} / ${lastBlockSignups}`)

        grantRoundLogs = grantRoundLogs.concat(logs)
      }
      // NOTE: Decode into actions, sort and save to local file (if not already present).
      grantRounds = grantRoundLogs
        .map((log, ii) => {
          const event = qfiface.parseLog(log)
          return {
            type: "GrantRoundDeployed",
            blockNumber: log.blockNumber,
            transactionIndex: log.transactionIndex,
            voiceCreditFactor: Number(event.args._voiceCreditFactor),
            coordinatorPubKey: new PubKey(event.args._coordinatorPubKey.map((x) => BigInt(x))).serialize(),
            roundAddress: event.args._currentGrantRound,
          }
        })
        .sort((a, b) => {
          const checkBlock = a.blockNumber - b.blockNumber
          const checkTxIndex = a.transactionIndex - b.transactionIndex
          return checkBlock === 0 ? checkTxIndex : checkBlock
        })
    } catch (err) {
      throw Error(`Failed to get MACI State from Smart Contracts: ${err.message}`)
    }

    /// ///////////////////////////////////////////////////////////////////////////
    console.log(`${logSymbols.success}Fetch Vote logs`)
    logsTotal = 0
    let votes: VoteAction[] = []
    try {
      // NOTE: Get Vote Actions from GrantRound Smart Contracts
      let voteLogs = [] as any[]
      console.log({
        message: 'Fetch Vote logs',
        firstVote,
        lastBlockVotes,
      })
      for (let i = Number(startBlock); i <= currentBlock; i += numBlocksPerRequest + 1) {
        const fromBlock = i >= currentBlock ? currentBlock : i
        const toBlock = i + numBlocksPerRequest >= currentBlock ? currentBlock : i + numBlocksPerRequest
        console.log({
          message: 'Fetch Vote logs',
          fromBlock,
          toBlock,
        })
        const logs = await provider.getLogs({
          ...grantRound.filters.PublishMessage(),
          fromBlock: fromBlock,
          toBlock
        })

        logsTotal += logs.length
        console.log(`${logsTotal} votes found so far, scanned up to block number: ${i} / ${lastBlockVotes}`)

        voteLogs = voteLogs.concat(logs)
      }

      // NOTE: Decode into actions, sort and save to local file (if not already present).
      votes = voteLogs
        .map((log) => {
          const event = grantRoundIface.parseLog(log)
          const message = event.args._message[0].map((x) => x.toString())
          const encPubKey = new PubKey(event.args._encPubKey.map((x) => BigInt(x.toString()))).serialize()
          return {
            type: "PublishMessage",
            blockNumber: log.blockNumber,
            transactionIndex: log.transactionIndex,
            logIndex: log.logIndex,
            message,
            encPubKey
          }
        })
        .sort((a, b) => {
          const checkBlock = a.blockNumber - b.blockNumber
          const checkTxIndex = a.transactionIndex - b.transactionIndex
          return checkBlock === 0 ? checkTxIndex : checkBlock
        })
    } catch (err) {
      throw Error(`Failed to get MACI State from Smart Contracts: ${err.message}`)
    }
    // ///////////////////////////////////////////////////////////////////////////

    // NOTe: Build Maci State locally from SignUp and GrantRound actions
    const maciState: MaciState = new MaciState()

    console.log(`\n`)
    console.log("Votes:", votes.length)
    console.log("SignUps:", signUps.length)
    console.log("GrantRounds:", grantRounds.length)
    /// ///////////////////////////////////////////////////////////////////////////

    console.log(`${logSymbols.success}Fetched MACI State from Contract`)
    console.log(`${logSymbols.success}Building MACI State locally: process signups`)
    for (const { pubKey, voiceCreditBalance, timestamp } of signUps) {
      maciState.signUp(PubKey.unserialize(pubKey), voiceCreditBalance, timestamp)
    }
    console.log(`${logSymbols.success}Building MACI State locally: process grant rounds`)

    for (const grantRound of grantRounds) {
      console.log(`\n ${grantRound.voiceCreditFactor}`)
      console.log(`\n ${grantRound.coordinatorPubKey}`)
      maciState.deployPoll(
        duration,
        BigInt(deployTime + duration),
        maxValues,
        treeDepths,
        batchSizes.messageBatchSize,
        coordinatorKeyPair
      )

      console.log(grantRound)
    }
    console.log(`${logSymbols.success}Building MACI State locally: process votes`)

    for (const { message, encPubKey } of votes) {
      const _message = new Message(message.map((x) => BigInt(x)))

      const _encPubKey = PubKey.unserialize(encPubKey)

      console.log(`\n Processing message with DH key:`)
      console.log(`${encPubKey}`)
      maciState.polls[0].publishMessage(_message, _encPubKey)
    }
    console.log(`\n${logSymbols.info} Succcess: Built MACI State, gen SNARK Circtuit inputs \n`)

    console.log("Circuit input in Batches + Proof Generation")
    // NOTE: Merge state tree offchain
    const maciStateAq = maciState.stateAq
    maciStateAq.mergeSubRoots(0) // 0 as input attempts to merge all subroots
    maciStateAq.merge(stateTreeDepth)

    // NOTE: Merge message tree offchain
    const maciPoll = maciState.polls[0]
    maciPoll.messageAq.mergeSubRoots(0) // NOTE: 0 as input attempts to merge all subroots
    maciPoll.messageAq.merge(treeDepths.messageTreeDepth)

    // NOTE: Circuit input generation offchain
    const processMessagesCircuitInputsByBatch = []
    while (maciPoll.hasUnprocessedMessages()) {
      const circuitInputs = maciPoll.processMessages(0) // Process _batchSize messages starting from the saved index.

      // NOTE: new state root and ballot root commitment calculated off chain
      const { newSbCommitment } = circuitInputs
      console.log(`Batch - ${maciPoll.currentMessageBatchIndex} left`)
      processMessagesCircuitInputsByBatch.push(circuitInputs)
    }

    // NOTE: Proof Generation offchain
    const processMessagesVerifierInputsByBatch = processMessagesCircuitInputsByBatch.map(
      (circuitInputs, batchNumber) => {
        // NOTE: these are required for the Verifier Contract onchain
        const maciNewSbCommitment = circuitInputs.newSbCommitment
        const pollAddress = currentGrantRound
        return {
          pollAddress,
          maciNewSbCommitment
        }
      }
    )

    const tallyVotesCircuitInputsByBatch = []
    while (maciPoll.hasUntalliedBallots()) {
      const circuitInputs = maciPoll.tallyVotes() // Process _batchSize ballots starting from the saved index.

      // NOTE: new stally commitment calculated off chain
      const { newTallyCommitment } = circuitInputs

      console.log(`Batch${maciPoll.numBatchesTallied}`)

      tallyVotesCircuitInputsByBatch.push(circuitInputs)
      console.log("/=========TALLY SO FAR==========/")
      console.log(maciPoll.results.map((x: any) => x.toString()))
    }

    // NOTE: Proof Generation offchain
    const tallyVotesVerifierInputsByBatch = tallyVotesCircuitInputsByBatch.map((circuitInputs, batchNumber) => {
      // NOTE: these are required for the Verifier Contract onchain

      const { newTallyCommitment } = circuitInputs
      const { newResultsRootSalt } = circuitInputs
      const { newSpentVoiceCreditSubtotalSalt } = circuitInputs
      const { newPerVOSpentVoiceCreditsRootSalt } = circuitInputs
      const pollAddress = currentGrantRound

      return {
        pollAddress,
        newTallyCommitment,
        newResultsRootSalt,
        newSpentVoiceCreditSubtotalSalt,
        newPerVOSpentVoiceCreditsRootSalt
      }
    })


    const unencryptedCommands = maciPoll.commands.map((command) => {
      console.log(`ID: ${command.voteOptionIndex}: ${command.newVoteWeight} by voter:${command.stateIndex} with nonce:${command.nonce}`)
      return {
        voteOption: command.voteOptionIndex,
        nonce: Number(command.nonce),
        newVoteWeight: Number(command.newVoteWeight),
        voterID: command.stateIndex
      }
    }).reverse()

    const memo = {}
    const easyTally = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    const easyVOTally = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    for (const { voteOption, nonce, newVoteWeight, voterID } of unencryptedCommands) {


      //check if voter in memo
      if (memo[voterID]){
        // check if nonce is used
        if (memo[voterID]?.includes(nonce)){
          //if nonce exists do nothing
          
        }else{
          //if nonce doesnt exist update tally
          easyTally[voteOption] += newVoteWeight
          easyVOTally[voteOption] += newVoteWeight * newVoteWeight
          //and add to memo
          memo[voterID].push(nonce)
        }
      // if the voter not in memo  and add to memo as you go
      }else {
        // add the voter to memo
        memo[voterID]=[];
        // update tally
        easyTally[voteOption] += newVoteWeight
        easyVOTally[voteOption] += newVoteWeight * newVoteWeight
        //and add nonce to memo
        memo[voterID].push(nonce)
        
      }
    }

    console.log(easyTally)
    console.log(easyVOTally)

    const finalProcessMessagesCircuitInputs =
      processMessagesCircuitInputsByBatch[processMessagesCircuitInputsByBatch.length - 1]
    const finalTallyCircuitInputs = tallyVotesVerifierInputsByBatch[tallyVotesVerifierInputsByBatch.length - 1]

    const maciNewSbCommitment = finalProcessMessagesCircuitInputs.newSbCommitment

    const { newTallyCommitment } = finalTallyCircuitInputs
    const tallyResults: string[] = easyTally.map((x: any) => x.toString())
    const tallySalt = finalTallyCircuitInputs.newResultsRootSalt
    const voiceCreditsSpent = easyVOTally.reduce((previousValue, currentValue) => previousValue + currentValue, 0)
    const voiceCreditsSalt = finalTallyCircuitInputs.newSpentVoiceCreditSubtotalSalt
    const perVOSpentTally = easyVOTally.map((x: any) => x.toString())
    const perVOSpentSalt = finalTallyCircuitInputs.newPerVOSpentVoiceCreditsRootSalt
    const tallyFileData = {
      maci: qfi.address,
      pollId: 0,
      newTallyCommitment,
      results: {
        tally: tallyResults,
        salt: tallySalt
      },
      totalSpentVoiceCredits: {
        spent: voiceCreditsSpent,
        salt: voiceCreditsSalt
      },
      perVOSpentVoiceCredits: {
        tally: perVOSpentTally,
        salt: perVOSpentSalt
      }
    }
    console.log("/=========FINAL TALLY RESULTS==========/")
    console.log(tallyFileData)

    // const outputfile = path.resolve(outputDirPath, `tally-${startTime.toISOString().split('.')[0]}.json`)
    // console.log(`Saving Tally Results to ${outputfile}`);
    // await writeLocalJsonFile(outputfile, JSON.parse(JSON.stringify(tallyFileData, null, 2)))


    // TODO: calculate subsidy
    console.log
    const squareOfTally: number[] = tallyResults.map((voteTotal) => parseInt(voteTotal) ** 2)
    console.log(squareOfTally)
    const sumOfSquareOfTally = squareOfTally.reduce((previousValue, currentValue) => previousValue + currentValue, 0)
    console.log(sumOfSquareOfTally)
    const { confirmation: preFlightCheck2 } = await askForConfirmation(
      `Expected Matching pool is ${matchingPoolAmount} USDC, Are you ready to continue?`
    )

    // TODO: replace with subgraph
    const projectNameByStateId = (index) => jsonRecipientsRecords[index]?.projectName
    const projectAddressByStateId = (index) => jsonRecipientsRecords[index]?.ethereumAddress

    console.log(`\n Calculating QF subsidy results`)

    const totalVotes = tallyResults.reduce((previousValue, currentValue) => previousValue + parseInt(currentValue), 0)

    console.log({
      totalVotes,
      message: `totalVotes=${totalVotes}`,
    });
    let subsidyTotal = 0
    const voteResult = squareOfTally.map((squareOfTally, index) => {
      const decimals = 18n;
      // const floorDecimals = 3n;
      // if(decimals - floorDecimals < 0) throw new Error(`decimals - modDecimals < 0`);
      const base = BigInt(10) ** BigInt(decimals);
      // const floorBase = BigInt(10) ** BigInt(decimals - floorDecimals);
      const projectName = projectNameByStateId(index - 1);
      const projectAddress = projectAddressByStateId(index - 1);
      const votes = Number(tallyResults[index]);
      const tally = Number(perVOSpentTally[index]);
      // const votesPercent = parseInt(tallyResults[index]) / totalVotes;
      const rawAmount = BigNumber.from((BigInt(matchingPoolAmount) * base) * BigInt(votes) / BigInt(totalVotes))
                                // .div(floorBase).mul(floorBase);
      const reward = ethers.utils.formatUnits(rawAmount, decimals);
      // Math.floor(votesPercent * parseInt(matchingPoolAmount) * 1000000) / 1000000; // DAI
      const votesPercent = Math.round(votes * 10000 / totalVotes) / 100;
      
      
      if (squareOfTally > 0) {
        // const subsidyPercent = squareOfTally / sumOfSquareOfTally;
        
        console.log(
          `${projectName}@${projectAddress}:\t${reward} DAI\t(Tally=${tally} , Votes=${votes}), PercentOfVotes=${votesPercent}`
        )
        subsidyTotal += Number(reward);
        // subsidyTotal += subsidyPercent * parseInt(matchingPoolAmount)
        // return { address: projectAddressByStateId(index - 1), amount: subsidyPercent * parseInt(matchingPoolAmount) }
      }

      return { 
        projectName,
        projectAddress,
        reward,
        tally,
        votes,
        votesPercent,
      }
    }).filter((x) => !!x.projectName);

    const totalReward = voteResult.reduce((previousValue, currentValue) => previousValue + Number(currentValue.reward), 0)
    const totalTally = voteResult.reduce((previousValue, currentValue) => previousValue + currentValue.tally, 0)
    const totalVotes2 = voteResult.reduce((previousValue, currentValue) => previousValue + currentValue.votes, 0)
    if(totalVotes !== totalVotes2) throw new Error(`totalVotes=${totalVotes} !== totalVotes2=${totalVotes2}`);
    const voterNum = new Set(votes.map(item => item.encPubKey)).size;

    voteResult.push({
      totalReward,
      totalTally,
      totalVotes: totalVotes2,
      voterNum,
    } as any);

    console.log(chalk.bold(`\n Subsidy results calculated`))
    console.log(`Total: ${subsidyTotal}`)

    console.log("Tally Complete: Saving Result Logs")
    await writeLocalJsonFile(`${outputDirPath}/jsonRecipientsRecords.json`, JSON.parse(JSON.stringify(jsonRecipientsRecords, null, 2)))
    await writeLocalJsonFile(`${outputDirPath}/voteResult.json`, JSON.parse(JSON.stringify(voteResult, null, 2)))
    await writeLocalJsonFile(`${outputDirPath}/squareOfTally.json`, JSON.parse(JSON.stringify(squareOfTally, null, 2)))
    await writeLocalJsonFile(signUpsFilePath, JSON.parse(JSON.stringify(signUps, null, 2)))
    await writeLocalJsonFile(grantRoundsFilePath, JSON.parse(JSON.stringify(grantRounds, null, 2)))
    await writeLocalJsonFile(votesFilePath, JSON.parse(JSON.stringify(votes, null, 2)))
  } catch (err: any) {
    console.log(err)
    if (!err.transactionHash) console.log(`\n${logSymbols.error} Something went wrong: ${err}`)
    else
      console.log(
        `\n${logSymbols.error} Something went wrong with the transaction! More info here: ${chalk.bold(
          `${getNetworkExplorerUrl(network)}tx/${err.transactionHash}`
        )}`
      )
    process.exit(0)
  }
}

export default tally
