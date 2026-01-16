import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider);

const handleMetaMaskLogin = async () => {
    const accounts = await web3.eth.requestAccounts();
    const walletAddress = accounts[0];

    // Step 1: Request nonce
    const response = await fetch('/auth/metamask/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress }),
    });
    const { nonce } = await response.json();

    // Step 2: Sign the nonce
    const signature = await web3.eth.personal.sign(`Nonce: ${nonce}`, walletAddress);

    // Step 3: Verify signature
    const verifyResponse = await fetch('/auth/metamask/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress, signature }),
    });
    const { token, user } = await verifyResponse.json();

    // Save token to localStorage
    localStorage.setItem('token', token);

    // Redirect to role selection page
    if (!user.role) {
        window.location.href = '/select-role';
    } else {
        window.location.href = '/home';
    }
};