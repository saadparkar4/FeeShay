# Start Backend Server - Step by Step

## 1. Open Terminal and Navigate to Backend
```bash
cd /Users/Alii/Desktop/Full-Stack/FeeShay/Backend
```

## 2. Install Dependencies (if not done)
```bash
npm install
```

## 3. Start the Server
```bash
npm run dev
```

## 4. What You Should See
When the server starts successfully, you should see:
```
MongoDB connected: cluster0.h0vh2qk.mongodb.net successfully
Server is running on port 3000
```

## 5. Test the Server
In a new terminal window:
```bash
cd /Users/Alii/Desktop/Full-Stack/FeeShay/Backend
node test-server.js
```

## 6. If Server Fails to Start

### Error: "MongoDB connection failed"
- Check your internet connection (MongoDB Atlas needs internet)
- Verify .env file has correct DB_URL

### Error: "Port 3000 already in use"
- Kill the process using port 3000:
  ```bash
  lsof -ti:3000 | xargs kill -9
  ```
- Or change the port in .env file

### Error: "Cannot find module"
- Run `npm install` again
- Delete node_modules and reinstall:
  ```bash
  rm -rf node_modules
  npm install
  ```

## 7. Test from Frontend
Once backend is running, in your React Native app:
1. Check the console for "API Base URL"
2. Try to register a new user
3. Check both frontend and backend consoles for logs

## 8. Quick Backend Check
Open your browser and go to:
- http://localhost:3000/health

You should see:
```json
{
  "success": true,
  "message": "FeeShay API is running",
  "timestamp": "2025-07-09T..."
}
```