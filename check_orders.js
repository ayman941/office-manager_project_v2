import axios from 'axios';

async function main() {
  try {
    console.log('Logging in as employee2...');
    const loginRes = await axios.post('https://smart-office-backend-production.up.railway.app/api/token/', {
      username: 'employee2',
      password: 'Employee1234'
    });
    const token = loginRes.data.access;
    console.log('Token obtained.');

    console.log('Fetching order items...');
    const orderRes = await axios.get('https://smart-office-backend-production.up.railway.app/api/order-items/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Raw Orders Data:', JSON.stringify(orderRes.data, null, 2));
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

main();
