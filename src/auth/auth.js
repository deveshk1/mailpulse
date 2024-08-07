const axios = require('axios');
const qs = require('qs');

const tenantId = '82bb8d4c-fc51-4bf3-bd68-28e2673a82d3';
const clientId = 'f595b682-806f-4f31-ad89-32d80caf0221';
const clientSecret = 'aI48Q~Ax7UrKZUvo3MzOxc~oU3cIIt5dF1mpVan6';
const scope = 'https://graph.microsoft.com/.default';

 const getAccessToken = async () => {
    try {
      const response = await axios.post(
        `https://login.microsoftonline.com/consumers/oauth2/v2.0/token`,
        querystring.stringify({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
          scope: scope
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
  
      const { access_token } = response.data;
      console.log('Access Token:', access_token);
      return access_token;
    } catch (error) {
      console.error('Error getting access token:', error.response ? error.response.data : error.message);
    }
  };
  
  getAccessToken();