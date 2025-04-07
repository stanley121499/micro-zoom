/**
 * Configuration module for application settings
 */
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

/**
 * Application configuration object
 */
const config = {
  /** Server port number */
  port: process.env.PORT || 3000,
  /** Current environment (development, production, test) */
  nodeEnv: process.env.NODE_ENV || "development",
  
  /** Zoom API credentials */
  zoom: {
    /** Zoom client ID */
    clientId: process.env.ZOOM_CLIENT_ID || "",
    /** Zoom client secret */
    clientSecret: process.env.ZOOM_CLIENT_SECRET || "",
    /** Zoom account ID */
    accountId: process.env.ZOOM_ACCOUNT_ID || "",
  },
  
  /** JWT configuration */
  jwt: {
    /** JWT secret for API authentication */
    secret: process.env.JWT_SECRET || "default_secret_don't_use_in_production",
  },

  /** Google Sheets configuration */
  googleSheets: {
    /** Google Sheets service account email */
    clientEmail: process.env.GOOGLE_SHEETS_CLIENT_EMAIL || "",
    /** Google Sheets service account private key */
    privateKey: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n") || "",
    /** Google Sheets spreadsheet ID */
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID || "",
  },
};

// Validate required environment variables are set
const validateConfig = () => {
  const requiredEnvVars = [
    "ZOOM_CLIENT_ID",
    "ZOOM_CLIENT_SECRET",
    "ZOOM_ACCOUNT_ID",
    "GOOGLE_SHEETS_CLIENT_EMAIL",
    "GOOGLE_SHEETS_PRIVATE_KEY",
    "GOOGLE_SHEETS_SPREADSHEET_ID",
  ];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.warn(`Warning: Environment variable ${envVar} is not set.`);
    }
  }
};

// Call validation function
validateConfig();

export default config; 