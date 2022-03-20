const SHA256 = require('crypto-js/sha256');
const BlockClass = require('../src/block');


test('validate method should return true/false Promise', async () => {
   
    const block = new BlockClass.Block({data: 'test data'});
    block.hash = SHA256(block.body).toString()

    const promise = block.validate();
    expect(promise instanceof Promise).toBe(true)

    const result = await promise;
    expect(result).toBe(true)

    block.hash = 'wrong hash';
    const wrongResult = await block.validate();
    expect(wrongResult).toBe(false)
})

test('getBData method should return human readable data except genesis block', async () => {
    const genesisBlock = new BlockClass.Block({data: 'Genesis block'});
    genesisBlock.hash = SHA256(genesisBlock.body).toString();

    const secondBlock = new BlockClass.Block({data: 'Second block'});
    secondBlock.previousBlockHash = genesisBlock.hash;

    const bDataPromise = secondBlock.getBData();
    expect(bDataPromise instanceof Promise).toBe(true)

    const bData = await bDataPromise;
    expect(bData).toMatchObject({data: 'Second block'});

    let genesisBData
    try {
        genesisBData = await genesisBlock.getBData()
    } catch (error) {
        expect(error).toBe('Cannot access genesis block\'s data');
    }
})