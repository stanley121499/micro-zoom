/**
 * Main application entry point
 */
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import config from "./config/config";
import swaggerSpec from "./config/swagger";
import zoomRoutes from "./routes/zoomRoutes";
import { createGoogleSheetsRoutes } from "./routes/googleSheetsRoutes";
import { GoogleSheetsService } from "./services/googleSheetsService";

/**
 * Express application instance
 */
const app = express();

/**
 * Middleware for parsing JSON request bodies
 */
app.use(express.json());

/**
 * CORS configuration
 */
const corsOptions = {
  origin: true, // This will reflect the request origin
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

/**
 * Middleware for enabling CORS with specific configuration
 */
app.use(cors(corsOptions));

/**
 * Swagger documentation setup
 */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * Initialize Google Sheets service
 */
const sheetsService = new GoogleSheetsService({
  clientEmail: config.googleSheets.clientEmail,
  privateKey: config.googleSheets.privateKey,
  spreadsheetId: config.googleSheets.spreadsheetId,
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check if the API service is running correctly
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is running properly
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    message: "Zoom registration microservice is running",
    timestamp: new Date().toISOString(),
  });
});

/**
 * API routes
 */
app.use("/api/zoom", zoomRoutes);
app.use("/api/sheets", createGoogleSheetsRoutes(sheetsService));

/**
 * Error handling middleware
 * Catches any errors that occur during request processing
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

/**
 * 404 handler for undefined routes
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

/**
 * Start the server
 */
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
}); 