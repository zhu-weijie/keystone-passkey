// public/js/register.js
window.addEventListener('load', () => {
    const form = document.getElementById('registration-form');

    form.addEventListener('submit', async (event) => {
        // Prevent the form from submitting normally
        event.preventDefault();

        const formData = new FormData(form);
        const email = formData.get('email');

        // 1. Fetch the registration challenge from the server
        const resp = await fetch('/register/public-key/challenge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });

        const credOptions = await resp.json();

        // 2. Decode the challenge and user ID from base64url to ArrayBuffers
        credOptions.challenge = base64url.decode(credOptions.challenge);
        credOptions.user.id = base64url.decode(credOptions.user.id);
        
        // Add additional required options for the WebAuthn API
        credOptions.pubKeyCredParams = [
            { type: "public-key", alg: -7 },  // ES256
            { type: "public-key", alg: -257 } // RS256
        ];
        credOptions.authenticatorSelection = {
            authenticatorAttachment: "platform", // or "cross-platform"
            userVerification: "required"
        };
        credOptions.rp = { name: "Keystone" };

        // 3. Call the WebAuthn API to create the new credential
        try {
            const newCredential = await navigator.credentials.create({ publicKey: credOptions });
            
            // For this issue, we will just log the successful result for verification.
            console.log('Credential created!', newCredential);
            
            // In a later issue, we will send this newCredential object to the server.
            
        } catch (err) {
            console.error('Error creating credential:', err);
            alert('Failed to create passkey. See console for details.');
        }
    });
});
