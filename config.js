const GENESIS_DATA = {
    blockHeaders: { // Blockheader is a field, parent hash is a field of he blockheader field
        parentHash: '--genesis-parent-hash--',
        beneficiary: '--genesis-beneficiary',
        difficulty: 1,
        number: 0,
        timestamp: '--genesis-timestamp--',
        nonce: 0
    }
}

const MILLISECONDS = 1; // Javascirpt count its timestamping system in milseconds
const SECONDS = 1000 * MILLISECONDS
const MINE_RATE = 13 * SECONDS

module.exports = {
    GENESIS_DATA,
    MINE_RATE
}; // exporting GENESIS_DATA as property in object to make it more extensbile for later