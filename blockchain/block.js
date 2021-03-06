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
            return difficulty = 1
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

    static vaildateBlock({ lastBlock, block }){
        return new Promise();
    }

    static validateBlock({ lastBlock, block}){
        return new Promise( (resolve, reject) => {
            if (keccakHash(block) === keccakHash(Block.genesis())){
                return resolve();
            }

            if (keccakHash(lastBlock.blockHeaders) != block.blockHeaders.parentHash){
                return reject(
                    new Error("The parent hash must be a hash of the last block's headers")
                );
            }

            if (block.blockHeaders.number != lastBlock.blockHeaders.number + 1){
                return reject(new Error('THe block must increment the number by 1'));
            }

            if ( Math.abs(block.blockHeaders.difficulty - lastBlock.blockHeaders.difficulty) > 1){
                return reject(new Error('The difficulty must only adjust by 1'));
            }

            const target = Block.calculatedBlockTargetHash({lastBlock});
            const { blockHeaders } = block;
            const { nonce } = blockHeaders;
            const truncatedBlockHeaders = {...blockHeaders};
            delete truncatedBlockHeaders.nonce;
            const header = keccakHash(truncatedBlockHeaders);
            const underTargetHash = keccakHash(header + nonce)

            if (underTargetHash > target){
                return reject(new Error('The underTarget hash was greater than the target, does not meet proof of work requirment'))
            }

            return resolve();
        });
    }
}

module.exports = Block;

