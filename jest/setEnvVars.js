/**
 * Setup file for Jest tests
 * Sets mock environment variables for testing
 */
process.env.PORT = "3000";
process.env.NODE_ENV = "test";
process.env.ZOOM_CLIENT_ID = "test_client_id";
process.env.ZOOM_CLIENT_SECRET = "test_client_secret";
process.env.ZOOM_ACCOUNT_ID = "test_account_id";
process.env.JWT_SECRET = "test_jwt_secret"; 