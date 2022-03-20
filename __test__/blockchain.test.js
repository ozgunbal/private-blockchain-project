const SHA256 = require('crypto-js/sha256');
const bitcoinMessage = require('bitcoinjs-message');
const BlockClass = require('../src/block');
const BlockChain = require('../src/blockchain.js');

test('_addBlock method should fulfill requirements', async () => {
    const blockchain = new BlockChain.Blockchain();
    const block = new BlockClass.Block({data: 'test data'});
    const genesisBlock = blockchain.chain[0];

    // must return a Promise
    const promise = blockchain._addBlock(block);
    expect(promise instanceof Promise).toBe(true)

    const result = await promise;
    expect(result).toMatchObject(block)

    // height must be checked to assign the previousBlockHash
    expect(block.previousBlockHash).toBe(genesisBlock.hash);
    // Assign the timestamp & the correct height
    expect(block.height).toBe(1);
    expect(block.time).toBeDefined();
    // Create the block hash and push the block into the chain array
    expect(block.hash).toBeDefined();
    expect(blockchain.chain).toHaveLength(2);
    expect(blockchain.height).toBe(1);
})

test('requestMessageOwnershipVerification method should return promise', async () => {
    const testAddress = 'mv9pABcLPPnDyf3pMqdC7eZuMbG6ZELVED'
    const blockchain = new BlockChain.Blockchain();

    const promise = blockchain.requestMessageOwnershipVerification(testAddress);
    expect(promise instanceof Promise).toBe(true)

    const [adress, timeStamp, registry] = (await promise).split(':');
    expect(adress).toBe(testAddress);
    expect(timeStamp).toHaveLength(10);
    expect(timeStamp).toMatch(/[0-9]*/);
    expect(registry).toBe('starRegistry');
})

test('getBlockHeight method should return right block', async () => {
    const blockchain = new BlockChain.Blockchain();
    const genesisBlockHash = blockchain.chain[0].hash;

    const promise = blockchain.getBlockByHash(genesisBlockHash);
    expect(promise instanceof Promise).toBe(true)

    const block = await promise;
    expect(block).toMatchObject(blockchain.chain[0])

    // returns null for not found
    const notFound = await blockchain.getBlockByHash('wrong_adress');
    expect(notFound).toBeNull()
})
