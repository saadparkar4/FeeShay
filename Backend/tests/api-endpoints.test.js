const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// Import your app
const app = require("../src/app");

// Test data
const testData = {
    // User data
    client: {
        email: "client@test.com",
        password: "password123",
        role: "client",
        name: "Test Client",
    },
    freelancer: {
        email: "freelancer@test.com",
        password: "password123",
        role: "freelancer",
        name: "Test Freelancer",
    },

    // Job data
    job: {
        title: "Web Development Project",
        description: "Need a full-stack web application built with React and Node.js",
        category: "Tech",
        budget_min: 1000,
        budget_max: 5000,
        deadline: "2024-12-31",
        skills_required: ["React", "Node.js", "MongoDB"],
    },

    // Service data
    service: {
        title: "Professional Web Development",
        description: "Full-stack web development services with modern technologies",
        category: "Tech",
        price: 2500,
        delivery_time_days: 14,
        skills: ["React", "Node.js", "MongoDB", "TypeScript"],
    },

    // Proposal data
    proposal: {
        cover_letter: "I have extensive experience in web development and would love to work on this project.",
        bid_amount: 3000,
        delivery_time_days: 10,
        milestones: [
            {
                title: "Design Phase",
                description: "Create wireframes and mockups",
                amount: 1000,
                due_date: "2024-11-15",
            },
            {
                title: "Development Phase",
                description: "Build the application",
                amount: 1500,
                due_date: "2024-11-30",
            },
            {
                title: "Testing & Deployment",
                description: "Test and deploy the application",
                amount: 500,
                due_date: "2024-12-05",
            },
        ],
    },

    // Review data
    review: {
        rating: 5,
        comment: "Excellent work! Very professional and delivered on time.",
        service_quality: 5,
        communication: 5,
        value_for_money: 5,
    },

    // Message data
    message: {
        content: "Hello! I'm interested in your project. Can we discuss the requirements?",
    },
};

let authTokens = {};
let createdIds = {};

describe("FeeShay API Endpoints", () => {
    beforeAll(async () => {
        // Connect to test database
        await mongoose.connect(process.env.MONGODB_URI_TEST || "mongodb://localhost:27017/feeshay_test");
    });

    afterAll(async () => {
        // Clean up and disconnect
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // Clear collections before each test
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
        }
    });

    describe("Health Check", () => {
        it("should return health status", async () => {
            const response = await request(app).get("/health").expect(200);

            expect(response.body).toHaveProperty("success", true);
            expect(response.body).toHaveProperty("message", "FeeShay API is running");
            expect(response.body).toHaveProperty("timestamp");
        });
    });

    describe("Authentication Endpoints", () => {
        describe("POST /api/v1/auth/register", () => {
            it("should register a new client", async () => {
                const response = await request(app).post("/api/v1/auth/register").send(testData.client).expect(201);

                expect(response.body.success).toBe(true);
                expect(response.body.data).toHaveProperty("token");
                expect(response.body.data).toHaveProperty("user");
                expect(response.body.data.user.email).toBe(testData.client.email);
                expect(response.body.data.user.role).toBe("client");

                authTokens.client = response.body.data.token;
            });

            it("should register a new freelancer", async () => {
                const response = await request(app).post("/api/v1/auth/register").send(testData.freelancer).expect(201);

                expect(response.body.success).toBe(true);
                expect(response.body.data).toHaveProperty("token");
                expect(response.body.data).toHaveProperty("user");
                expect(response.body.data.user.email).toBe(testData.freelancer.email);
                expect(response.body.data.user.role).toBe("freelancer");

                authTokens.freelancer = response.body.data.token;
            });

            it("should reject registration with invalid data", async () => {
                const response = await request(app)
                    .post("/api/v1/auth/register")
                    .send({
                        email: "invalid-email",
                        password: "123",
                        role: "invalid-role",
                    })
                    .expect(400);

                expect(response.body.success).toBe(false);
                expect(response.body).toHaveProperty("error");
            });
        });

        describe("POST /api/v1/auth/login", () => {
            it("should login with valid credentials", async () => {
                const response = await request(app)
                    .post("/api/v1/auth/login")
                    .send({
                        email: testData.client.email,
                        password: testData.client.password,
                    })
                    .expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data).toHaveProperty("token");
                expect(response.body.data).toHaveProperty("user");
            });

            it("should reject login with invalid credentials", async () => {
                const response = await request(app)
                    .post("/api/v1/auth/login")
                    .send({
                        email: testData.client.email,
                        password: "wrongpassword",
                    })
                    .expect(401);

                expect(response.body.success).toBe(false);
                expect(response.body).toHaveProperty("error");
            });
        });

        describe("GET /api/v1/auth/profile", () => {
            it("should get user profile with valid token", async () => {
                const response = await request(app).get("/api/v1/auth/profile").set("Authorization", `Bearer ${authTokens.client}`).expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data).toHaveProperty("user");
                expect(response.body.data).toHaveProperty("profile");
            });

            it("should reject request without token", async () => {
                const response = await request(app).get("/api/v1/auth/profile").expect(401);

                expect(response.body.success).toBe(false);
                expect(response.body).toHaveProperty("error");
            });
        });

        describe("PUT /api/v1/auth/profile", () => {
            it("should update user profile", async () => {
                const updateData = {
                    name: "Updated Client Name",
                    bio: "Updated bio",
                    location: "New York",
                    phone: "+1234567890",
                    website: "https://example.com",
                };

                const response = await request(app).put("/api/v1/auth/profile").set("Authorization", `Bearer ${authTokens.client}`).send(updateData).expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data.profile.name).toBe(updateData.name);
            });
        });

        describe("PUT /api/v1/auth/change-password", () => {
            it("should change user password", async () => {
                const passwordData = {
                    currentPassword: testData.client.password,
                    newPassword: "newpassword123",
                };

                const response = await request(app).put("/api/v1/auth/change-password").set("Authorization", `Bearer ${authTokens.client}`).send(passwordData).expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body).toHaveProperty("message");
            });
        });
    });

    describe("Jobs Endpoints", () => {
        describe("GET /api/v1/jobs", () => {
            it("should get all jobs with pagination", async () => {
                const response = await request(app).get("/api/v1/jobs?page=1&limit=10").expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data).toHaveProperty("data");
                expect(response.body.data).toHaveProperty("total");
                expect(response.body.data).toHaveProperty("page");
                expect(response.body.data).toHaveProperty("limit");
            });

            it("should filter jobs by category", async () => {
                const response = await request(app).get("/api/v1/jobs?category=Tech").expect(200);

                expect(response.body.success).toBe(true);
            });

            it("should search jobs by title", async () => {
                const response = await request(app).get("/api/v1/jobs?search=web development").expect(200);

                expect(response.body.success).toBe(true);
            });
        });

        describe("GET /api/v1/jobs/categories", () => {
            it("should get all job categories", async () => {
                const response = await request(app).get("/api/v1/jobs/categories").expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data).toBeInstanceOf(Array);
            });
        });

        describe("GET /api/v1/jobs/:id", () => {
            it("should get job by ID", async () => {
                // First create a job
                const createResponse = await request(app).post("/api/v1/jobs").set("Authorization", `Bearer ${authTokens.client}`).send(testData.job).expect(201);

                const jobId = createResponse.body.data._id;

                const response = await request(app).get(`/api/v1/jobs/${jobId}`).expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data._id).toBe(jobId);
                expect(response.body.data.title).toBe(testData.job.title);
            });

            it("should return 404 for non-existent job", async () => {
                const fakeId = new mongoose.Types.ObjectId();
                const response = await request(app).get(`/api/v1/jobs/${fakeId}`).expect(404);

                expect(response.body.success).toBe(false);
            });
        });

        describe("POST /api/v1/jobs", () => {
            it("should create a new job (client only)", async () => {
                const response = await request(app).post("/api/v1/jobs").set("Authorization", `Bearer ${authTokens.client}`).send(testData.job).expect(201);

                expect(response.body.success).toBe(true);
                expect(response.body.data.title).toBe(testData.job.title);
                expect(response.body.data.category).toBe(testData.job.category);
                expect(response.body.data.client).toBeDefined();

                createdIds.job = response.body.data._id;
            });

            it("should reject job creation by freelancer", async () => {
                const response = await request(app).post("/api/v1/jobs").set("Authorization", `Bearer ${authTokens.freelancer}`).send(testData.job).expect(403);

                expect(response.body.success).toBe(false);
            });
        });

        describe("PUT /api/v1/jobs/:id", () => {
            it("should update job by owner", async () => {
                const updateData = {
                    title: "Updated Web Development Project",
                    description: "Updated description",
                    budget_max: 6000,
                };

                const response = await request(app).put(`/api/v1/jobs/${createdIds.job}`).set("Authorization", `Bearer ${authTokens.client}`).send(updateData).expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data.title).toBe(updateData.title);
            });

            it("should reject update by non-owner", async () => {
                const updateData = { title: "Unauthorized Update" };

                const response = await request(app).put(`/api/v1/jobs/${createdIds.job}`).set("Authorization", `Bearer ${authTokens.freelancer}`).send(updateData).expect(403);

                expect(response.body.success).toBe(false);
            });
        });

        describe("DELETE /api/v1/jobs/:id", () => {
            it("should delete job by owner", async () => {
                const response = await request(app).delete(`/api/v1/jobs/${createdIds.job}`).set("Authorization", `Bearer ${authTokens.client}`).expect(200);

                expect(response.body.success).toBe(true);
            });
        });

        describe("GET /api/v1/jobs/my/jobs", () => {
            it("should get user's own jobs (client only)", async () => {
                const response = await request(app).get("/api/v1/jobs/my/jobs").set("Authorization", `Bearer ${authTokens.client}`).expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data).toHaveProperty("data");
            });
        });
    });

    describe("Services Endpoints", () => {
        describe("GET /api/v1/services", () => {
            it("should get all services with pagination", async () => {
                const response = await request(app).get("/api/v1/services?page=1&limit=10").expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data).toHaveProperty("data");
                expect(response.body.data).toHaveProperty("total");
            });

            it("should filter services by category", async () => {
                const response = await request(app).get("/api/v1/services?category=Tech").expect(200);

                expect(response.body.success).toBe(true);
            });
        });

        describe("GET /api/v1/services/:id", () => {
            it("should get service by ID", async () => {
                // First create a service
                const createResponse = await request(app).post("/api/v1/services").set("Authorization", `Bearer ${authTokens.freelancer}`).send(testData.service).expect(201);

                const serviceId = createResponse.body.data._id;

                const response = await request(app).get(`/api/v1/services/${serviceId}`).expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data._id).toBe(serviceId);
            });
        });

        describe("POST /api/v1/services", () => {
            it("should create a new service (freelancer only)", async () => {
                const response = await request(app).post("/api/v1/services").set("Authorization", `Bearer ${authTokens.freelancer}`).send(testData.service).expect(201);

                expect(response.body.success).toBe(true);
                expect(response.body.data.title).toBe(testData.service.title);
                expect(response.body.data.freelancer).toBeDefined();

                createdIds.service = response.body.data._id;
            });

            it("should reject service creation by client", async () => {
                const response = await request(app).post("/api/v1/services").set("Authorization", `Bearer ${authTokens.client}`).send(testData.service).expect(403);

                expect(response.body.success).toBe(false);
            });
        });

        describe("PUT /api/v1/services/:id", () => {
            it("should update service by owner", async () => {
                const updateData = {
                    title: "Updated Professional Web Development",
                    price: 3000,
                };

                const response = await request(app)
                    .put(`/api/v1/services/${createdIds.service}`)
                    .set("Authorization", `Bearer ${authTokens.freelancer}`)
                    .send(updateData)
                    .expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data.title).toBe(updateData.title);
            });
        });

        describe("DELETE /api/v1/services/:id", () => {
            it("should delete service by owner", async () => {
                const response = await request(app).delete(`/api/v1/services/${createdIds.service}`).set("Authorization", `Bearer ${authTokens.freelancer}`).expect(200);

                expect(response.body.success).toBe(true);
            });
        });

        describe("GET /api/v1/services/my/services", () => {
            it("should get user's own services (freelancer only)", async () => {
                const response = await request(app).get("/api/v1/services/my/services").set("Authorization", `Bearer ${authTokens.freelancer}`).expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data).toHaveProperty("data");
            });
        });
    });

    describe("Proposals Endpoints", () => {
        let jobId, serviceId;

        beforeEach(async () => {
            // Create a job and service for proposal tests
            const jobResponse = await request(app).post("/api/v1/jobs").set("Authorization", `Bearer ${authTokens.client}`).send(testData.job);

            jobId = jobResponse.body.data._id;

            const serviceResponse = await request(app).post("/api/v1/services").set("Authorization", `Bearer ${authTokens.freelancer}`).send(testData.service);

            serviceId = serviceResponse.body.data._id;
        });

        describe("GET /api/v1/proposals", () => {
            it("should get all proposals with pagination", async () => {
                const response = await request(app).get("/api/v1/proposals?page=1&limit=10").expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data).toHaveProperty("data");
            });
        });

        describe("POST /api/v1/proposals", () => {
            it("should create a new proposal (freelancer only)", async () => {
                const proposalData = {
                    ...testData.proposal,
                    job: jobId,
                    service: serviceId,
                };

                const response = await request(app).post("/api/v1/proposals").set("Authorization", `Bearer ${authTokens.freelancer}`).send(proposalData).expect(201);

                expect(response.body.success).toBe(true);
                expect(response.body.data.job).toBe(jobId);
                expect(response.body.data.freelancer).toBeDefined();

                createdIds.proposal = response.body.data._id;
            });

            it("should reject proposal creation by client", async () => {
                const proposalData = {
                    ...testData.proposal,
                    job: jobId,
                    service: serviceId,
                };

                const response = await request(app).post("/api/v1/proposals").set("Authorization", `Bearer ${authTokens.client}`).send(proposalData).expect(403);

                expect(response.body.success).toBe(false);
            });
        });

        describe("GET /api/v1/proposals/:id", () => {
            it("should get proposal by ID", async () => {
                const response = await request(app).get(`/api/v1/proposals/${createdIds.proposal}`).expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data._id).toBe(createdIds.proposal);
            });
        });

        describe("PUT /api/v1/proposals/:id", () => {
            it("should update proposal by owner", async () => {
                const updateData = {
                    cover_letter: "Updated cover letter",
                    bid_amount: 3500,
                };

                const response = await request(app)
                    .put(`/api/v1/proposals/${createdIds.proposal}`)
                    .set("Authorization", `Bearer ${authTokens.freelancer}`)
                    .send(updateData)
                    .expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data.cover_letter).toBe(updateData.cover_letter);
            });
        });

        describe("DELETE /api/v1/proposals/:id", () => {
            it("should delete proposal by owner", async () => {
                const response = await request(app).delete(`/api/v1/proposals/${createdIds.proposal}`).set("Authorization", `Bearer ${authTokens.freelancer}`).expect(200);

                expect(response.body.success).toBe(true);
            });
        });

        describe("GET /api/v1/proposals/my/proposals", () => {
            it("should get user's own proposals (freelancer only)", async () => {
                const response = await request(app).get("/api/v1/proposals/my/proposals").set("Authorization", `Bearer ${authTokens.freelancer}`).expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data).toHaveProperty("data");
            });
        });

        describe("GET /api/v1/proposals/job/:jobId", () => {
            it("should get proposals for a specific job (client only)", async () => {
                const response = await request(app).get(`/api/v1/proposals/job/${jobId}`).set("Authorization", `Bearer ${authTokens.client}`).expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data).toHaveProperty("data");
            });
        });

        describe("PUT /api/v1/proposals/:id/status", () => {
            it("should update proposal status (client only)", async () => {
                const statusData = {
                    status: "accepted",
                };

                const response = await request(app)
                    .put(`/api/v1/proposals/${createdIds.proposal}/status`)
                    .set("Authorization", `Bearer ${authTokens.client}`)
                    .send(statusData)
                    .expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data.status).toBe("accepted");
            });
        });
    });

    describe("Messages Endpoints", () => {
        let chatId;

        beforeEach(async () => {
            // Create a chat between client and freelancer
            const response = await request(app)
                .post("/api/v1/messages/chats")
                .set("Authorization", `Bearer ${authTokens.client}`)
                .send({
                    userId: (await request(app).get("/api/v1/auth/profile").set("Authorization", `Bearer ${authTokens.freelancer}`)).body.data.user._id,
                });

            chatId = response.body.data._id;
        });

        describe("POST /api/v1/messages/chats", () => {
            it("should create a new chat", async () => {
                const response = await request(app)
                    .post("/api/v1/messages/chats")
                    .set("Authorization", `Bearer ${authTokens.client}`)
                    .send({
                        userId: (await request(app).get("/api/v1/auth/profile").set("Authorization", `Bearer ${authTokens.freelancer}`)).body.data.user._id,
                    })
                    .expect(201);

                expect(response.body.success).toBe(true);
                expect(response.body.data).toHaveProperty("participants");
            });
        });

        describe("GET /api/v1/messages/chats", () => {
            it("should get user's chats", async () => {
                const response = await request(app).get("/api/v1/messages/chats").set("Authorization", `Bearer ${authTokens.client}`).expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data).toHaveProperty("data");
            });
        });

        describe("GET /api/v1/messages/chats/:chatId/messages", () => {
            it("should get messages in a chat", async () => {
                const response = await request(app).get(`/api/v1/messages/chats/${chatId}/messages`).set("Authorization", `Bearer ${authTokens.client}`).expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data).toHaveProperty("data");
            });
        });

        describe("POST /api/v1/messages/chats/:chatId/messages", () => {
            it("should send a message in a chat", async () => {
                const response = await request(app)
                    .post(`/api/v1/messages/chats/${chatId}/messages`)
                    .set("Authorization", `Bearer ${authTokens.client}`)
                    .send(testData.message)
                    .expect(201);

                expect(response.body.success).toBe(true);
                expect(response.body.data.content).toBe(testData.message.content);
                expect(response.body.data.sender).toBeDefined();
            });
        });

        describe("PUT /api/v1/messages/chats/:chatId/read", () => {
            it("should mark messages as read", async () => {
                const response = await request(app).put(`/api/v1/messages/chats/${chatId}/read`).set("Authorization", `Bearer ${authTokens.client}`).expect(200);

                expect(response.body.success).toBe(true);
            });
        });

        describe("GET /api/v1/messages/unread-count", () => {
            it("should get unread message count", async () => {
                const response = await request(app).get("/api/v1/messages/unread-count").set("Authorization", `Bearer ${authTokens.client}`).expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data).toHaveProperty("unreadCount");
            });
        });

        describe("DELETE /api/v1/messages/messages/:messageId", () => {
            it("should delete a message", async () => {
                // First send a message
                const messageResponse = await request(app)
                    .post(`/api/v1/messages/chats/${chatId}/messages`)
                    .set("Authorization", `Bearer ${authTokens.client}`)
                    .send(testData.message);

                const messageId = messageResponse.body.data._id;

                const response = await request(app).delete(`/api/v1/messages/messages/${messageId}`).set("Authorization", `Bearer ${authTokens.client}`).expect(200);

                expect(response.body.success).toBe(true);
            });
        });
    });

    describe("Reviews Endpoints", () => {
        let serviceId, jobId;

        beforeEach(async () => {
            // Create a service and job for review tests
            const serviceResponse = await request(app).post("/api/v1/services").set("Authorization", `Bearer ${authTokens.freelancer}`).send(testData.service);

            serviceId = serviceResponse.body.data._id;

            const jobResponse = await request(app).post("/api/v1/jobs").set("Authorization", `Bearer ${authTokens.client}`).send(testData.job);

            jobId = jobResponse.body.data._id;
        });

        describe("GET /api/v1/reviews", () => {
            it("should get all reviews with pagination", async () => {
                const response = await request(app).get("/api/v1/reviews?page=1&limit=10").expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data).toHaveProperty("data");
            });
        });

        describe("GET /api/v1/reviews/:id", () => {
            it("should get review by ID", async () => {
                // First create a review
                const createResponse = await request(app)
                    .post("/api/v1/reviews")
                    .set("Authorization", `Bearer ${authTokens.client}`)
                    .send({
                        ...testData.review,
                        service: serviceId,
                    });

                const reviewId = createResponse.body.data._id;

                const response = await request(app).get(`/api/v1/reviews/${reviewId}`).expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data._id).toBe(reviewId);
            });
        });

        describe("GET /api/v1/reviews/user/:userId", () => {
            it("should get reviews for a specific user", async () => {
                const userId = (await request(app).get("/api/v1/auth/profile").set("Authorization", `Bearer ${authTokens.freelancer}`)).body.data.user._id;

                const response = await request(app).get(`/api/v1/reviews/user/${userId}`).expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data).toHaveProperty("data");
            });
        });

        describe("POST /api/v1/reviews", () => {
            it("should create a new review", async () => {
                const reviewData = {
                    ...testData.review,
                    service: serviceId,
                };

                const response = await request(app).post("/api/v1/reviews").set("Authorization", `Bearer ${authTokens.client}`).send(reviewData).expect(201);

                expect(response.body.success).toBe(true);
                expect(response.body.data.rating).toBe(testData.review.rating);
                expect(response.body.data.reviewer).toBeDefined();

                createdIds.review = response.body.data._id;
            });

            it("should reject review with invalid rating", async () => {
                const invalidReview = {
                    ...testData.review,
                    rating: 6, // Invalid rating
                    service: serviceId,
                };

                const response = await request(app).post("/api/v1/reviews").set("Authorization", `Bearer ${authTokens.client}`).send(invalidReview).expect(400);

                expect(response.body.success).toBe(false);
            });
        });

        describe("PUT /api/v1/reviews/:id", () => {
            it("should update review by owner", async () => {
                const updateData = {
                    rating: 4,
                    comment: "Updated review comment",
                };

                const response = await request(app).put(`/api/v1/reviews/${createdIds.review}`).set("Authorization", `Bearer ${authTokens.client}`).send(updateData).expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data.rating).toBe(updateData.rating);
            });
        });

        describe("DELETE /api/v1/reviews/:id", () => {
            it("should delete review by owner", async () => {
                const response = await request(app).delete(`/api/v1/reviews/${createdIds.review}`).set("Authorization", `Bearer ${authTokens.client}`).expect(200);

                expect(response.body.success).toBe(true);
            });
        });
    });

    describe("Error Handling", () => {
        it("should handle invalid MongoDB ObjectId", async () => {
            const response = await request(app).get("/api/v1/jobs/invalid-id").expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty("error");
        });

        it("should handle non-existent routes", async () => {
            const response = await request(app).get("/api/v1/nonexistent").expect(404);

            expect(response.body.success).toBe(false);
        });

        it("should handle validation errors", async () => {
            const response = await request(app)
                .post("/api/v1/jobs")
                .set("Authorization", `Bearer ${authTokens.client}`)
                .send({}) // Empty data
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty("error");
        });
    });
});
