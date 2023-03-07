
import { ethers } from 'ethers';
import abi from '../abi/abi.json'

export const setAccountData = () => {
  const contractAddress = '0x3D0972044431454FE7B9D1e6c3FB496717452a7e'
  const contractAbi = abi
  const { ethereum } = window;
  if (ethereum) { 
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, contractAbi, signer)
    return { provider: provider, signer: signer, contract: contract }
  } else {
    return { provider: "", signer: "", contract: "" }
  }
}
