const dotenv = require('dotenv');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const result = dotenv.config();

if (result.error) {
  throw result.error;
}

const RINKEBY_API = `https://rinkeby.infura.io/v3/${process.env.RINKEBY_API_KEY}`;
const provider = new HDWalletProvider(process.env.PRIVATE_KEY, RINKEBY_API);
const web3 = new Web3(provider);

(async () => {
  const accounts = await web3.eth.getAccounts();

  /**
   * account: 0xcF01971DB0CAB2CBeE4A8C21BB7638aC1FA1c38c
   */
  console.log(`account: ${accounts[0]}`)

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ['Hi there'] })
    .send({ gas: '1000000', from: accounts[0] });

  /**
   * contract deployed to 0xFB1287aFe8cb16e3b56053c55411EFdC0eEE4ade
   */
  console.log(`contract deployed to ${result.options.address}`);

  // prevent hanging development
  provider.engine.stop();
})();