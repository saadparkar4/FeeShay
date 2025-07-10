// Test setup file
const mongoose = require("mongoose");

// Set test environment variables
process.env.NODE_ENV = "test";
process.env.MONGODB_URI = process.env.MONGODB_URI_TEST || "mongodb://localhost:27017/feeshay_test";
process.env.JWT_SECRET = "test-secret-key";

// Increase timeout for tests
jest.setTimeout(30000);

// Global test setup
beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

// Global test teardown
afterAll(async () => {
    // Close database connection
    await mongoose.connection.close();
});

// Clean up database between tests
beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});
