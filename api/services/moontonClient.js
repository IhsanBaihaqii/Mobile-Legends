// api/services/moontonClient.js
// Axios client khusus untuk request ke Moonton API dengan header dinamis

import axios from 'axios';
import { DEFAULT_HEADERS } from '../config/headers.js';

export const callMoontonApi = async (url, payload, authToken) => {
  const headers = {
    ...DEFAULT_HEADERS,
    authorization: authToken
  };

  const response = await axios.post(url, payload, {
    headers,
    timeout: 15000
  });

  return response.data;
};
