// src/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_JUDGE0_API_URL;
const API_KEY = process.env.REACT_APP_JUDGE0_API_KEY;

// console.log('API_URL:', API_URL);
// console.log('API_KEY:', API_KEY);

// Define language IDs for Judge0
const LANGUAGE_IDS = {
  'c': 50,             // C (GCC 7.4.0)
  'cpp': 54,           // C++ (GCC 9.2.0)
  'csharp': 51,        // C# (Mono 6.6.0.161)
  'clojure': 86,       // Clojure (1.10.1)
  'java': 91,          // Java (JDK 17.0.6)
  'javascript': 93,    // JavaScript (Node.js 18.15.0)
  'typescript': 94,    // TypeScript (5.0.3)
  'go': 95,            // Go (1.18.5)
  'php': 68,           // PHP (7.4.1)
  'python': 92,        // Python (3.11.2)
  'ruby': 72,          // Ruby (2.7.0)
  'sql': 82            // SQL (SQLite 3.27.2)
};

// Create a new submission
export const createSubmission = async (sourceCode, language) => {
    console.log("api for submission called");
    try {
      console.log(`Requested Language: ${language}`) ;
      const languageId = LANGUAGE_IDS[language] ; // Default to JavaScript if language not found
      if (!languageId) {
        throw new Error('Unsupported language');
      }
      console.log(`Language ID for ${language}: ${languageId}`);
      const response = await axios.post(`${API_URL}/submissions`, {
      language_id: languageId, // For JavaScript, which is 63 in Judge0
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
