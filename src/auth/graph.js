import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';

// MSAL configuration object
const msalConfig = {
  auth: {
    clientId: 'f595b682-806f-4f31-ad89-32d80caf0221',
    authority: 'https://login.microsoftonline.com/common', // Adjust if needed
    redirectUri: 'https://localhost:3000/', // Ensure this matches your app settings
  },
  system: {
    allowNativeBroker: true,
  },
};

// Create an instance of PublicClientApplication
const msalInstance = new PublicClientApplication(msalConfig);

export async function getGraphyToken() {
  try {
    return  `EwCIA8l6BAAUbDba3x2OMJElkF7gJ4z/VbCPEz0AAUWjSESbLstK4ohMSLFclE+OvHzdtf9xYNZ2ErVeHZ6hfjiQmspjF5thiE8TzGNez0F1NL4kz4K8DMLE4f8zheNeo65HKeW+Bnoi5DmEIJdVXpXhrNue4FgmUqQiV0J8s6AX4FHgu4318y/9HjfRmq/60Gc6OFQsvRjTB3u59wUt5DtBj2PnnD3pSG8n17XRkUqWm4Dpn/eOY6ictTBVYrCqHfwALzlxuqxUxc6GKqWKg36ScmjXpo2RGE33sbvR1OTqaJt/ewC3cx6YT8e9vt3YNAOWJ2YWasGQTJmBoJZK/qhCIkfsnd0duDlZcYxqbDkU+jgkwzDV1V/r2t2WgIoQZgAAEE6l+fYkr2ASeNbgpjSQ5opQAgtDp9n5Dt+ak/debTPe6iX9Cwna3JRW6utr4VXEMJfDGHGbIvxMvkVQY5VOmxSb08aNSKrcOiwa3oBuRVGFfLQLn2gKSZlCpPWOkQB2AkJCU/IjW0HU15q4bkIfkDKVguByNKGhl2WkYFSZaluWTvcGmEc7WSO4OKtgcK64FtGLhOodvpO6QUegAF3d8kEaF3yzhVERvAtSv+2xbDoK++givtPAozeSXtGqeVfxTInkAlRoeiNbWHAD/SWRMhiJOsWWztCdib2u5HhKT1YQtEBAzkTrqnHA5cR1P3svIsEWqaBR6k4xIGQfNLLhhncK1E2o8/tR7nCnvUsYUg8g7pqgFoOXKTi9Gj0osHFDl6q4BeJACu6TkMDUINKKOT3vtERdadswm6f3SjOmZGJdMUgID/jX11j1qvkR/H3i9ILej1UOzDAG3nLpgQGuGKLNsZlBUnFWjH98DdjQrt6zyyGHyLobxIJMBrcGArO+fdEcYGta1Dz21crZV4U9jwBi0sw3Tx95vJWHKCfS6lnCcsUJwVie5TsgCuKfeV6nywpRo09ZH1WjgwZilEW/qQqw+ghVwZdBVqJbcNLvJlpV+y6Ll1koHrm27vD1XcXUURvOL6e6zjQh8GzqpL/Lh60NNU2uhhZFWrtlCjjfMjCN2mFQd0ET8SbiD6jQYg86EU/fwaJOkL7uytiWIM+BgHyg1OwKHdrjrPVqmHRjJqLtxugxLaRE8N3vm8y8W/7PTr6p+pRYVNfLvZ6VlZZfMKMoVO2C5ozQSytqubIogI1S/W6LAg==`
    // Handle redirect promise if there is a previous redirect
    await msalInstance.handleRedirectPromise();

    // Try to acquire token silently
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) {
      throw new Error('No accounts found');
    }

    const response = await msalInstance.acquireTokenSilent({
      scopes: ['Mail.Read'],
      account: accounts[0], // Use the first account found
    });

    console.log(response);

    return response.accessToken;
  } catch (error) {
    console.error('Error acquiring token silently:', error);

    if (error instanceof InteractionRequiredAuthError) {
      try {
        // If silent token acquisition fails, fallback to interactive method
        const response = await msalInstance.acquireTokenPopup({
          scopes: ['Mail.Read'],
        });

        console.log(response);

        return response.accessToken;
      } catch (popupError) {
        console.error('Error acquiring token through popup:', popupError);
        throw popupError;
      }
    } else {
      throw error;
    }
  }
}
