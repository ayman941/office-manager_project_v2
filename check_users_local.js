import axios from 'axios';

async function main() {
  const baseURL = 'https://smart-office-backend-production.up.railway.app/api';
  
  // 1. Log in as employee2
  let token = '';
  try {
    const loginRes = await axios.post(`${baseURL}/token/`, {
      username: 'employee2',
      password: 'Employee1234'
    });
    token = loginRes.data.access;
    console.log('Logged in as employee2.');
  } catch (err) {
    console.error('Login failed:', err.response?.data || err.message);
    return;
  }

  // 2. Fetch location by ID
  try {
    const res = await axios.get(`${baseURL}/locations/1/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('\n--- GET LOCATION 1 RESPONSE ---');
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('Failed to fetch location 1:', err.response?.data || err.message);
  }
}

main();
