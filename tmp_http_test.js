const BASE_URL = 'http://localhost:5000/api';

async function run() {
  const user = { username: 'test_api_user_' + Date.now(), email: 'api' + Date.now() + '@user.com', password: 'password123' };
  
  console.log("1. Registering...");
  let res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  
  let cookie = res.headers.get('set-cookie');
  console.log("   Cookie:", cookie ? "GOT COOKIE" : "NO COOKIE");
  
  console.log("2. Updating SMTP...");
  let smtpRes = await fetch(`${BASE_URL}/updateSMTP`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify({ email: 'new_smtp@gmail.com', password: 'new_app_password' })
  });
  let upData = await smtpRes.json();
  console.log("   Update Result:", upData);
  
  console.log("3. Fetching SMTP...");
  let getRes = await fetch(`${BASE_URL}/getSMTP`, {
    method: 'GET',
    headers: { 'Cookie': cookie }
  });
  let getData = await getRes.json();
  console.log("   Get Result:", getData);
}

run().catch(console.error);
