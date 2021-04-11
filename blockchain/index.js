const { tsConstructSignatureDeclaration } = require('@babel/types');
const Block = require('./block')

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()] // Chain array will consist of a series of blocks (see block.js )
    }
}

module.exports = Blockchain;

