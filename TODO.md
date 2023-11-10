
1. teams list
 - update ./packages/cli/src/lib/constants.ts
 - update ./packages/app/src/data.ts
 - note: add project type `github`, `video`
 
2.
 - $contracts: npm run build
 - $cli: npm run auth --mnemonic
 - $cli: npm run contracts:deploy --network goerli
 - copy deployed contract addresses (packages/cli/output/deployedContracts/deployedContracts.json) to ./packages/cli/src/lib/constants.ts

3.
 - $cli: npm run genkeys --amount 10
 - copy public packages/cli/output/keys/maci/public_keys to ./packages/cli/src/lib/constants.ts
 - update packages/app/src/quickBallotConfig.tsx

4. prepare coordinator
  - coordinatorPrivkey
  - coordinatorPubkey
  > it is maci public/private key
  update 

5. 
 - after update `constant.ts` you need to rebuild `cli` package
 - edit during DAYS in `cli/commands/doTheThing.ts`
 - $cli: npm run build
 - $cli: npm run dothething --network goerli

6. 
  update packages/app/src/pages/Ballot.tsx
  change: `grantRoundAddress`
  change: `coordinatorKey`

7. calculate all votes 
 - $cli: 
  npm run tally --network goerli --coordinatorPrivkey "macisk.2c512a29f5ac0d8f6d706c83c4e6350835157fa9a1e73a3f095a4d12f3fd3df3" --matchingPoolAmount 2000 --qfiContractAddress 0xaabB37DA6233a503399227C5f8d1853c459579F7 --startBlock 9991406 --firstVoteBlock 9994266 --lastBlock 10019830


---------------------------------------
- network: goerli
- timeline: 10/25 ~ 11/10 , 10/24 add teams
- MACI amount: 100
- each Goerli: 0.05 ETH

- publish: 10/25 start, about vote 14 days


- deploy: own domain, server?

## TODO:
- Team informations
- update tally script and re calculate fund.

## Questions:
- front-end server 架在哪裡？
Ans: Fleek.co

- 專案建置流程
Ans: 
  1. cli: deploy contract
  2. 







## TODO:
- DNS configuration 
- 項目方資料的格式
- 評審點數 200，一般使用者 99