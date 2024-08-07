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
    return  `EwCIA8l6BAAUbDba3x2OMJElkF7gJ4z/VbCPEz0AASjjutI4qjQ/xUA80FMui/AZ1wH1Ci29IixHVp2hMk3bTOhtTVZQyx/on73O2Si1/vVZu1k2Cd5sio4NTnDAk672I7Pi/ZO4cmRRwWeGuKddLvXLr9VR43RoDo40CNfEJHobmFcRLwgRfF00MiBgH0QFgca4Q6r8L3F0a/r7m3VaTvmXTArF1RoyJyg9jxao3Rg910fwSvQhf9q4ZeE8scs8oBwMvoj6Rsf3T0GfInUwKPCrW2R6j2xGKJbynwhWYcVuDhCtxnbHeHfwLUz0BXuELl5NLL/hBpRmLEyfIani1vupN5uU2ay6RM1kz/KVEIfHqp9PvxmNKYMG5VXt1QsQZgAAEHT4OdZctOoAHIrmRhwrv1FQAkpcwjskRc/9QwKK6BN7LzownPs622WCBsMLfxr8DXdY+9wA96GHe9dkauo+HPPo/GLaNkxq99yQ7kvzF2ESaVChohTrIWVAsGWbwrfMAFnDHQQ/kyPgO1q4ifYl+OATEbBHiJjzIPPfJ+9Wt8RlQmTG7WzSCDxkwCuxNG2luO/0cGx6evDa9RquW5B5yQD/jYiGrPUk4JDkPfDMDhR1Q31VJKsCB6AtTEfuts6yJMtX6c7WmsnMZOf1bsaS1olSJf21gWrF4B2/7HiYjJOkjKQS6h/H299lZVbioci5fGUzSmeZSPdJGMSj8QSDiRaeCLDZl9jTZSKwwu7xzb1rzBVOGUxqklQ2B6cRd86inHLZUf0pgrqwiMzaFsKSdnM8tOXENdFGyhewwtRRcaKW5XKL/F5fDWXuJwT4k6C3pWwTD+w8h1j07uyR0XmN3GAmhVzb0WYZ6knJjYdyPP1JGZEqDCtQhJwGdShkyAotl2DQnaVcTpsCOUbXn94/0wWb5wDgLuIrc0Af1szjHxkI9gpoB3Bp6ElCsl+oEVLL3sDFJveEWR0xERmYBB3z54zVgyyj15fzYaSARHmBIOSEzFnOJoU30DKL0K7nHw/yuDVmmPJVYpf5U/CzzT/SQPIuP9yGKHP+HvNp9s5+MVhRqxhd7Y9rlIVtJHnNJXGmW36xz+th9pXvU/JKAUvnpbR+iz9iAShQ5493kjemqcoIRoJLDfZtPtZizs8RqsybjYdmUJBfjc8daKOy2NqfR33syIIvfGPeNVWMAV8QDvNuAEeLAg==`
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
