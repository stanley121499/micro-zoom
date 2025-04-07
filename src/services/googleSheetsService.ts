import { google } from "googleapis";
import { JWT } from "google-auth-library";

/**
 * Interface for Google Sheets configuration
 */
interface GoogleSheetsConfig {
  clientEmail: string;
  privateKey: string;
  spreadsheetId: string;
}

/**
 * Service class for interacting with Google Sheets
 */
export class GoogleSheetsService {
  private sheets: any;
  private spreadsheetId: string;

  /**
   * Creates a new instance of GoogleSheetsService
   * @param config - Configuration object containing Google Sheets credentials
   */
  constructor(config: GoogleSheetsConfig) {
    const auth = new JWT({
      email: config.clientEmail,
      key: config.privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    this.sheets = google.sheets({ version: "v4", auth });
    this.spreadsheetId = config.spreadsheetId;
  }

  /**
   * Adds a row to the specified sheet
   * @param sheetName - Name of the sheet to add the row to
   * @param values - Array of values to add as a row
   * @returns Promise with the result of the operation
   */
  public async addRow(sheetName: string, values: string[]): Promise<void> {
    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:A`,
        valueInputOption: "RAW",
        requestBody: {
          values: [values],
        },
      });
    } catch (error) {
      console.error("Error adding row to Google Sheet:", error);
      throw new Error("Failed to add row to Google Sheet");
    }
  }
} 