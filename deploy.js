const dotenv = require('dotenv');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, evm } = require('./compile');

const result = dotenv.config();

if (result.error) {
  throw result.error;
}

/**
 * BLOCKCHAIN TESTNET NODE
 */
const RINKEBY_NODE = `https://rinkeby.infura.io/v3/${process.env.RINKEBY_API_KEY}`;
/**
 * PROVIDER
 */
const provider = new HDWalletProvider({ mnemonic: process.env.PRIVATE_KEY, providerOrUrl: RINKEBY_NODE });
/**
 * WEB 3
 */
const web3 = new Web3(provider);

(async () => {
  const accounts = await web3.eth.getAccounts();

  /**
   * account: 0xcF01971DB0CAB2CBeE4A8C21BB7638aC1FA1c38c
   */
  console.log(`account: ${accounts[0]}`)

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object, arguments: ['Hi there'] })
    .send({ gas: '1000000', from: accounts[0] });

  /**
   * contract deployed to 0xFB1287aFe8cb16e3b56053c55411EFdC0eEE4ade
   * new address: 0xDA4968D7a9a4eCeBfa47eD6Ef1F763b7459F86C5
   */
  console.log(`contract deployed to ${result.options.address}`);

  // prevent hanging development
  provider.engine.stop();
})();