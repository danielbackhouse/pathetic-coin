const { GENESIS_DATA } = require('../config')

class Block {
    constructor( {blockHeaders}){ // Why use an object with a single field? Makes it neater
        this.blockHeaders = blockHeaders; // and will be labeled as a property later making it visible
    }

    // Static key word means that method can be accessed with anyone who has access to the
    // class without creating an instance of the class.
    //  Useful when a method doesnt need data specific to an object create from that classs
    static mineBlock({lastBlock}) { // what does very first block use as first block? 
                                    // genesis block of hard coded value (genesis block values
                                    // come from config)
    } 

    static genesis(){
        return new Block(GENESIS_DATA); // Genesis data is object that has the blockheaders field
    }
}

module.exports = Block;
