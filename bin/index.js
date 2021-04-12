const Block = require('../blockchain/block')
const { keccakHash } = require('../util')


const BlockData= {
    blockHeaders: {

        parenthash: '1234',
        beneficiary: 'daniel',
        difficulty: 2,
        number: 0,
        timestamp: Date.now(),
        nonce: 0
    }};




const lastBlock = new Block(BlockData)
const block = Block.mineBlock({lastBlock, beneficiary: 'me'})
const genesisBlock = Block.genesis()

const secondParentHashCheck = keccakHash(lastBlock.blockHeaders)

const secondParentHash = block.blockHeaders.parentHash

console.log(lastBlock)
console.log(block)

p = Block.validateBlock({block: genesisBlock})


