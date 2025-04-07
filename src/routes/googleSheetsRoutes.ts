import { Router } from "express";
import { GoogleSheetsController } from "../controllers/googleSheetsController";
import { GoogleSheetsService } from "../services/googleSheetsService";

/**
 * Creates and configures the Google Sheets routes
 * @param sheetsService - Instance of GoogleSheetsService
 * @returns Configured Express Router
 */
export const createGoogleSheetsRoutes = (sheetsService: GoogleSheetsService): Router => {
  const router = Router();
  const controller = new GoogleSheetsController(sheetsService);

  /**
   * @swagger
   * /api/sheets/row:
   *   post:
   *     summary: Add a row to a Google Sheet
   *     tags: [Google Sheets]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - sheetName
   *               - values
   *             properties:
   *               sheetName:
   *                 type: string
   *                 description: Name of the sheet to add the row to
   *               values:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: Array of values to add as a row
   *     responses:
   *       200:
   *         description: Row added successfully
   *       400:
   *         description: Invalid request parameters
   *       500:
   *         description: Server error
   */
  router.post("/row", (req, res) => controller.addRow(req, res));

  return router;
}; 