const { describe, it, expect, beforeEach } = require('@jest/globals');
const { keccakHash } = require('../util');
const Block  = require('./block');
const { HASH_LENGTH } = require('./block')

describe('Block', () => {
    describe('calculateBlockTargetHash()', () => {
        it('calculates the max hash when the last block difficulty is 1', () => {
            expect(
                Block.calculatedBlockTargetHash({ lastBlock: { blockHeaders: { difficulty: 1} } })
            ).toEqual('f'.repeat(64));
        });

        it('calculates a low has value when the last block difficulty is high', ()=> {
            expect(
                Block.calculatedBlockTargetHash({ lastBlock: { blockHeaders: {difficulty: 50000} } })
            <'1').toBe(true)
        })

    });

    describe('mineBlock()', () =>{
        let lastBlock, minedBlock;

        beforeEach(() => {
            lastBlock = Block.genesis();
            minedBlock = Block.mineBlock({lastBlock, beneficiary: 'beneficiary'})
        });
        it('Mines a block', ()=> {
            expect(
                minedBlock
            ).toBeInstanceOf(Block)
        });
        it('Mines a block that meets the overall proof of work requirment', () =>{
            const target = Block.calculatedBlockTargetHash({lastBlock});
            const {blockHeaders} = minedBlock;
            const { nonce} = blockHeaders;
            const truncatedBlockHeaders = {...blockHeaders};
            delete truncatedBlockHeaders.nonce;
            const header = keccakHash(truncatedBlockHeaders);
            const underTargetHash = keccakHash(header + nonce)

            expect(underTargetHash < target).toBe(true)
        });
    });

    describe('adjustDifficulty()', () =>{
        it('keeps the difficulty above 0', () =>{
            expect(
                Block.adjustDifficulty({
                    lastBlock: {blockHeaders: { difficulty: 0}},
                    timestamp: Date.now()
                })).toEqual(1);
        });
        it('increments difficulty up by 1 if mining was faster than 13 seconds', () =>{
            expect(
                Block.adjustDifficulty({
                    lastBlock: {blockHeaders: { difficulty: 1, timestamp: Date.now()}},
                    timestamp: Date.now()
                })).toEqual(2);
        });
        it('increments difficulty down by 1 if mining was longer than 13 seconds', () =>{
            expect(
                Block.adjustDifficulty({
                    lastBlock: {blockHeaders: { difficulty: 3, timestamp: 0}},
                    timestamp: Date.now()
                })).toEqual(2);
        });

        describe('validateBlock', () => {

            let block, lastBlock;

            beforeEach( () => {
                lastBlock = Block.genesis();
                block = Block.mineBlock({lastBlock, beneficiary: 'me'})
            })

            it('Resolves when block is genesis block', () => {
                expect(Block.validateBlock({block: Block.genesis(), })).resolves;
            })

            it('Resolves if block is valid', () => {
                expect(Block.validateBlock({lastBlock, block})).resolves;
            })

            it('rejects when the parentHash is invalid', () => {
                block.blockHeaders.parentHash = 'foo';

                expect(Block.validateBlock({lastBlock, block})).rejects;
            })

            it('rejects if the difficulty has changed by more than 1', () => {
                block.blockHeaders.difficulty = lastBlock.blockHeaders.difficulty + 3;

                expect(Block.validateBlock({lastBlock, block})).rejects;
            })

            it('rejects if the number increment is more than 1', () => {
                block.blockHeaders.number = lastBlock.blockHeaders.number + 2

                expect(Block.validateBlock({lastBlock, block})).rejects;
            })

            it('rejects when the proof of work requirment is not met', () => {
                const originalCalculateBlockTargetHash = Block.calculatedBlockTargetHash

                Block.calculatedBlockTargetHash = () => {
                    return '0'.repeat(HASH_LENGTH)
                }

                expect(Block.validateBlock({lastBlock, block})).rejects;

                Block.calculatedBlockTargetHash = originalCalculateBlockTargetHash
            });

        })

    });

});