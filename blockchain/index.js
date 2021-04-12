const { tsConstructSignatureDeclaration } = require('@babel/types');
const Block = require('./block')

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()] // Chain array will consist of a series of blocks (see block.js )
    }

    addBlock({block}){
        this.chain.push(block);
    }
}

module.exports = Blockchain;

const blockchain = new Blockchain()

for (let i=0; i <1000; i++){
    const lastBlock = blockchain.chain[blockchain.chain.length-1];
    const block = Block.mineBlock({
        lastBlock,
        beneficiary: 'daniel'
    });
    blockchain.addBlock({ block });

    console.log('block', block)
}