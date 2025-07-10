// Run this in your React Native app's console to test connection
// Open developer menu (Cmd+D on iOS, Cmd+M on Android) and select "Debug Remote JS"

// Test 1: Direct fetch to health endpoint
console.log('=== Test 1: Testing direct connection to backend ===');
fetch('http://localhost:3000/health')
  .then(response => {
    console.log('Response status:', response.status);
    return response.json();
  })
  .then(data => console.log('✅ Success:', data))
  .catch(error => console.error('❌ Error:', error.message));

// Test 2: Try different localhost variations
console.log('\n=== Test 2: Testing different localhost variations ===');
const urls = [
  'http://localhost:3000/health',
  'http://127.0.0.1:3000/health',
  'http://10.0.2.2:3000/health',  // Android emulator
  'http://0.0.0.0:3000/health'
];

urls.forEach(url => {
  fetch(url)
    .then(r => r.json())
    .then(data => console.log(`✅ ${url} works!`))
    .catch(e => console.log(`❌ ${url} failed:`, e.message));
});

// Test 3: Check what platform we're on
console.log('\n=== Platform Info ===');
console.log('Platform OS:', Platform.OS);
console.log('Platform Version:', Platform.Version);

// If none work, you might need to use your computer's IP address
console.log('\n=== Next Steps ===');
console.log('If all localhost variations fail:');
console.log('1. Find your IP: ipconfig getifaddr en0');
console.log('2. Try: http://YOUR_IP:3000/health');
console.log('3. Make sure you\'re on the same WiFi network');