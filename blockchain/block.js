const { GENESIS_DATA, MINE_RATE } = require('../config');
const { keccakHash } = require('../util');

const HASH_LENGTH = 64;
const MAX_HASH_VALUE = parseInt('f'.repeat(HASH_LENGTH), 16)
const MAX_NONCE_VALUE = 2**64

class Block {
    constructor( {blockHeaders}){ // Why use an object with a single field? Makes it neater
        this.blockHeaders = blockHeaders; // and will be labeled as a property later making it visible
    }

    static calculatedBlockTargetHash({lastBlock}){
        const value = (MAX_HASH_VALUE / lastBlock.blockHeaders.difficulty).toString(16)
        
        if (value.length > HASH_LENGTH){
            return 'f'.repeat(HASH_LENGTH)
        }

        return '0'.repeat(HASH_LENGTH - value.length) + value;
    }

    static adjustDifficulty({ lastBlock, timestamp }){
        let {difficulty} = lastBlock.blockHeaders;

        if ((timestamp - lastBlock.blockHeaders.timestamp) > MINE_RATE){
            return difficulty - 1;
        }

        if (difficulty <1){
            difficulty = 1
        }

        return difficulty + 1;

    }

    static mineBlock({lastBlock, beneficiary}) { 
        const target = Block.calculatedBlockTargetHash({ lastBlock });

        let timestamp, truncatedBlockHeaders, header, nonce, underTargetHash;

        do {
            timestamp = Date.now();
            truncatedBlockHeaders = {
                parentHash: keccakHash(lastBlock.blockHeaders),
                beneficiary,
                difficulty: Block.adjustDifficulty({lastBlock, timestamp}),
                number: lastBlock.blockHeaders.number + 1,
                timestamp
            };

            header = keccakHash(truncatedBlockHeaders);
            nonce = Math.floor(Math.random() * MAX_NONCE_VALUE);

            underTargetHash = keccakHash(header + nonce)

        } while(underTargetHash > target);
         
        return new this({blockHeaders: { ...truncatedBlockHeaders, nonce}});
    } 

    static genesis(){
        return new this(GENESIS_DATA); // Genesis data is object that has the blockheaders field
    }
}

module.exports = Block;
