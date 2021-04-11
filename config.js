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

module.exports = {
    GENESIS_DATA
}; // exporting GENESIS_DATA as property in object to make it more extensbile for later