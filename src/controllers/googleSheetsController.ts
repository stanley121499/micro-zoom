import { Request, Response } from "express";
import { GoogleSheetsService } from "../services/googleSheetsService";

/**
 * Interface for the request body when adding a row
 */
interface AddRowRequest {
  sheetName: string;
  values: string[];
}

/**
 * Controller class for handling Google Sheets operations
 */
export class GoogleSheetsController {
  private sheetsService: GoogleSheetsService;

  /**
   * Creates a new instance of GoogleSheetsController
   * @param sheetsService - Instance of GoogleSheetsService
   */
  constructor(sheetsService: GoogleSheetsService) {
    this.sheetsService = sheetsService;
  }

  /**
   * Handles the request to add a row to a Google Sheet
   * @param req - Express request object
   * @param res - Express response object
   */
  public async addRow(req: Request, res: Response): Promise<void> {
    try {
      const { sheetName, values } = req.body as AddRowRequest;

      if (!sheetName || !values || !Array.isArray(values)) {
        res.status(400).json({
          error: "Invalid request. sheetName and values array are required.",
        });
        return;
      }

      await this.sheetsService.addRow(sheetName, values);
      res.status(200).json({ message: "Row added successfully" });
    } catch (error) {
      console.error("Error in addRow controller:", error);
      res.status(500).json({ error: "Failed to add row to Google Sheet" });
    }
  }
} 