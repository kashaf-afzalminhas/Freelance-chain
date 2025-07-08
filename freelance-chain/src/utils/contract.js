export const CONTRACT_ADDRESS = "0x19c5e8e78fc12F5381138A87ca30f87D08EE818e";

export const CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "admin",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "adminInitialized",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "contracts",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "client",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "freelancer",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "bidAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            },
            {
                "internalType": "enum JobContract.Status",
                "name": "status",
                "type": "uint8"
            },
            {
                "internalType": "string",
                "name": "workHash",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "contractId",
                "type": "uint256"
            }
        ],
        "name": "getContract",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "client",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "freelancer",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "bidAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deadline",
                        "type": "uint256"
                    },
                    {
                        "internalType": "enum JobContract.Status",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string",
                        "name": "workHash",
                        "type": "string"
                    }
                ],
                "internalType": "struct JobContract.Contract",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_admin",
                "type": "address"
            }
        ],
        "name": "initializeAdmin",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "contractId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "clientShareBasisPoints",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "freelancerShareBasisPoints",
                "type": "uint256"
            }
        ],
        "name": "resolveDispute",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "contractId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "clientAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "freelancerAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "platformFee",
                "type": "uint256"
            }
        ],
        "name": "DisputeResolved",
        "type": "event"
    }
]; 