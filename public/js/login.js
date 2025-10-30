// public/js/login.js
window.addEventListener('load', async () => {
    // Check if the browser supports WebAuthn's Conditional UI
    const isCMA = await window.PublicKeyCredential.isConditionalMediationAvailable();

    if (!isCMA) {
        console.log('Conditional Mediation is not available.');
        return;
    }

    try {
        // 1. Fetch the login challenge from the server
        const resp = await fetch('/login/public-key/challenge', {
            method: 'POST'
        });

        const credOptions = await resp.json();

        // 2. Decode the challenge from base64url
        credOptions.challenge = base64url.decode(credOptions.challenge);

        // 3. Call the WebAuthn API to get an assertion
        const assertedCredential = await navigator.credentials.get({
            publicKey: credOptions,
            mediation: 'conditional' // This enables the Conditional UI
        });

        // For this issue, we will just log the successful result for verification.
        console.log('Credential assertion obtained!', assertedCredential);

        // In the next issue, we will send this assertedCredential to the server.

    } catch (err) {
        console.error('Error getting credential assertion:', err);
    }
});
