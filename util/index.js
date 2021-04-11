const keccak256 = require('js-sha3').keccak256;

const sortCharacters = (data) => {
    return JSON.stringify(data).split('').sort().join('');
}

const keccakHash = (data) => {
    const hash = keccak256.create();

    // Important to note here that we are sorting the characters so 
    // that the data we pass to the hash which the properties arent in the same order for the ojbectcan
    // be out of order but must just contain the same information
    // not ideal.
    hash.update(sortCharacters(data));

    return hash.hex()
}


module.exports = {
    sortCharacters,
    keccakHash
};