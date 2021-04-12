const { tsConstructSignatureDeclaration } = require('@babel/types');
const { rejects } = require('assert');
const Block = require('./block')

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()] // Chain array will consist of a series of blocks (see block.js )
    }

    addBlock({block}){
        return new Promise((resolve, reject) => {
            Block.validateBlock({
                lastBlock: this.chain[this.chain.length-1],
                block
            }).then( () => {
                this.chain.push(block);

                return resolve();
            }).catch(error => reject(error));
        })

    }
}

module.exports = Blockchain;

const blockchain = new Blockchain()

//for (let i=0; i <1000; i++){
//    const lastBlock = blockchain.chain[blockchain.chain.length-1];
//    const block = Block.mineBlock({
//        lastBlock,
//        beneficiary: 'daniel'
 //   });
 //   blockchain.addBlock({ block });
//
//    console.log('block', block)
//}