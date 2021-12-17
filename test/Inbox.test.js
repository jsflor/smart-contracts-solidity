const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { abi, evm } = require('../compile');

const web3 = new Web3(ganache.provider());

let accounts;
let inboxContract;

const initialMessage = 'Hi there!';
const newMessage = 'bye';

beforeEach(async () => {
  try {
    // GET A LIST OF ALL ACCOUNTS
    accounts = await web3.eth.getAccounts();

    // USE ONE OF THOSE ACCOUNTS TO DEPLOY THE CONTRACT
    inboxContract = await new web3.eth.Contract(abi)
      .deploy({ data: evm.bytecode.object, arguments: [initialMessage] })
      .send({ from: accounts[0], gas: '1000000' });
  } catch (e) {
    console.log(e)
  }
});

describe('Inbox', () => {
  it('should have address', () => {
    assert.ok(inboxContract.options.address);
  });

  it('should have an initial message', async () => {
    const message = await inboxContract.methods.message().call();
    assert.strictEqual(message, initialMessage);
  });

  it('should change the message', async () => {
    await inboxContract.methods.setMessage(newMessage).send({ from: accounts[0] });

    const message = await inboxContract.methods.message().call();
    assert.strictEqual(message, newMessage);
  });
});