const axios = require('axios');
const qs = require('qs');

const tenantId = '82bb8d4c-fc51-4bf3-bd68-28e2673a82d3';
const clientId = 'f595b682-806f-4f31-ad89-32d80caf0221';
const clientSecret = 'aI48Q~Ax7UrKZUvo3MzOxc~oU3cIIt5dF1mpVan6';
const scope = 'https://graph.microsoft.com/.default';

async function getAccessToken() {
    const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

    const data = {
        client_id: clientId,
        scope: scope,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
    };

    try {
        const response = await axios.post(url, qs.stringify(data), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error);
        throw error;
    }
}

getAccessToken().then(token => {
    console.log('Access Token:', token);
}).catch(error => {
    console.error('Error:', error);
});
