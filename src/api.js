// src/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_JUDGE0_API_URL;
const API_KEY = process.env.REACT_APP_JUDGE0_API_KEY;

// console.log('API_URL:', API_URL);
// console.log('API_KEY:', API_KEY);

// Create a new submission
export const createSubmission = async (sourceCode) => {
    console.log("api for submission called");
    try {
      const response = await axios.post(`${API_URL}/submissions`, {
      language_id: 63, // For JavaScript, which is 63 in Judge0
      source_code: btoa(sourceCode), // Encode source code in base64
      stdin: '', // Optional input for the code
    }, {
      params: {
        base64_encoded: 'true',
        wait: 'false',
        fields: '*'
      },
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating submission:', error);
    throw error;
  }
};

// Get a submission result
export const getSubmissionResult = async (token) => {
    console.log("api for submission result has been called");
    try {
    const response = await axios.get(`${API_URL}/submissions/${token}`, {
      params: {
        base64_encoded: 'true',
        fields: '*'
      },
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching submission result:', error);
    throw error;
  }
};
