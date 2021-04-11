const { describe, it, expect, beforeEach } = require('@jest/globals');
const { keccakHash } = require('../util');
const Block  = require('./block');

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
    });


});