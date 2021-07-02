import Web3 from 'web3';
import Provider from '@truffle/hdwallet-provider';
const supplychain = require('../contracts/Supplychain.json');
const admin =require('../contracts/AdminUser.json');


const infuraKey = 'wss://rinkeby.infura.io/ws/v3/10cfdc60e2c841e4b03a5adf4abae931'

const supplychain_provider= new Provider('9ad55ba5bbefece176836f98bc15d15fdab54eecc7ba8f6e76d8e70fec27610c',infuraKey);
const web3s =new Web3(supplychain_provider)
 const supplychain_contract =  new web3s.eth.Contract(
    (supplychain.abi),'0xCf77731Cb0C5459a5237BEAF5Df65526BE2Ff12a');





export default(supplychain_contract);
