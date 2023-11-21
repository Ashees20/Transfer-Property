document.addEventListener('DOMContentLoaded', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);

        // Use the 'disconnect' event instead of 'close'
        window.ethereum.on('disconnect', (error) => {
            console.error('MetaMask disconnected:', error);
        });

        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
            console.error('User denied account access:', error);
        }
    } else {
        console.error('Web3 not found. Please install a wallet like MetaMask.');
    }

    loadAccount();

    document.getElementById('allotProperty').style.display = 'none';
    document.getElementById('transferProperty').style.display = 'none';
});

async function loadAccount() {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    document.getElementById('account').innerText = 'Your Account: ' + account;

    // Show/hide sections based on whether the user is the owner
    const isOwner = await checkOwnership(account);
    if (isOwner) {
        document.getElementById('allotProperty').style.display = 'block';
        document.getElementById('transferProperty').style.display = 'block';
    }
}

async function checkOwnership(account) {
    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    const owner = await contract.methods.DA().call();
    return owner.toLowerCase() === account.toLowerCase();
}

async function allotProperty() {
    const ownerAddress = document.getElementById('ownerAddress').value;
    const propertyName = document.getElementById('propertyName').value;

    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    try {
        await contract.methods.allotProperty(ownerAddress, propertyName).send({ from: (await web3.eth.getAccounts())[0] });
        console.log('Property allotted successfully');
    } catch (error) {
        console.error('Error allotting property:', error);
    }

    loadAccount();
}

async function transferProperty() {
    const toAddress = document.getElementById('toAddress').value;
    const transferPropertyName = document.getElementById('transferPropertyName').value;

    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    try {
        await contract.methods.transferProperty(toAddress, transferPropertyName).send({ from: (await web3.eth.getAccounts())[0] });
        console.log('Property transferred successfully');
    } catch (error) {
        console.error('Error transferring property:', error);
    }

    loadAccount();
}

// Replace CONTRACT_ABI and CONTRACT_ADDRESS with the actual ABI and address of your deployed contract
const CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "_verifiedOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "_totalNoOfPropertyCurrently",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "_nameOfProperty",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "_msg",
            "type": "string"
          }
        ],
        "name": "PropertyAlloted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "_from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "_to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "_propertyName",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "_msg",
            "type": "string"
          }
        ],
        "name": "PropertyTransferred",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "DA",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "propertiesOwner",
        "outputs": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "isSold",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [],
        "name": "totalNoOfProperty",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_ownerAddress",
            "type": "address"
          }
        ],
        "name": "getPropertyCountOfAnyAddress",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_verifiedOwner",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "_propertyName",
            "type": "string"
          }
        ],
        "name": "allotProperty",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_checkOwnerAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "_propertyName",
            "type": "string"
          }
        ],
        "name": "isOwner",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "a1",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "a2",
            "type": "string"
          }
        ],
        "name": "stringsEqual",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "pure",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_to",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "_propertyName",
            "type": "string"
          }
        ],
        "name": "transferProperty",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      }
]; // Replace with your contract ABI
const CONTRACT_ADDRESS = '0x9F64e99438e330163862f1A0d4854eBa0b642F60'; // Replace with your contract address