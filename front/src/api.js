import axios from 'axios';

export const fetchData = async (url, dataType, includeUhf) => {
  try {
    console.log('Fetching data with:', { url, dataType, includeUhf });
    const response = await axios.post(`http://localhost:5000/${dataType}`, {
      url,
      includeUhf,
    });
    console.log('API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};
