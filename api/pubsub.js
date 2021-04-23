//const {credentials} = require('/Users/danielbackhouse/Documents/GitHub/configs')

const PubNub = require('pubnub')

const credentials = {
    publishKey: "pub-c-994f59db-58f2-4649-a71e-716c12ddd4d9",
    subscribeKey: "sub-c-bf04a5be-9edd-11eb-bd5f-5e89266287f8",
    secretKey: "sec-c-MWNhYTQ5ZmUtYWMxZi00ZmM2LTg1NWQtZWE2ODE2MTBkYmM3",
};

const CHANNELS_MAP = {
    TEST: 'TEST',
    BLOCK: 'BLOCK'
}

class PubSub{
    constructor() {
        this.pubnub = new PubNub(credentials);
        this.subscribeToChannels();
        this.listen();
    }

    subscribeToChannels()  {
        this.pubnub.subscribe({
            channels: Object.values(CHANNELS_MAP)
        })
    }

    publish({ channel, message}){
        this.pubnub.publish( { channel, message } );
    }

    listen() {
        this.pubnub.addListener({
            message: (messageObject) => {
                console.log('messageObject', messageObject);
            }
        })
    }

}

module.exports = PubSub;

const pubsub = new PubSub();
pubsub.publish({
    channel: CHANNELS_MAP.TEST,
    message: 'foo'
})