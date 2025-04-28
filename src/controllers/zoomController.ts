/**
 * Controller for Zoom registration API endpoints
 */
import { Request, Response } from "express";
import zoomService from "../services/zoomService";
import { ZoomRegistrationRequest, ZoomBatchRegistrationRequest } from "../interfaces/ZoomInterfaces";

/**
 * Zoom controller for handling registration requests
 */
class ZoomController {
  /**
   * Register a participant for a Zoom meeting
   * @param req - Express request object
   * @param res - Express response object
   */
  public async registerForMeeting(req: Request, res: Response): Promise<void> {
    try {
      const meetingId = req.params.meetingId;
      const accountName = req.query.account as string | undefined;
      
      // Validate meeting ID
      if (!meetingId) {
        res.status(400).json({
          success: false,
          error: "Meeting ID is required",
        });
        return;
      }
      
      // Extract registration data from request body
      const registrationData: ZoomRegistrationRequest = req.body;
      
      // Validate required fields
      if (!registrationData.email || !registrationData.first_name || !registrationData.last_name) {
        res.status(400).json({
          success: false,
          error: "Email, first name, and last name are required fields",
        });
        return;
      }
      
      // Call service to register participant
      const result = await zoomService.registerParticipant(meetingId, registrationData, accountName);
      
      // Return response based on service result
      res.status(result.statusCode).json({
        success: result.success,
        data: result.data,
        error: result.error,
      });
    } catch (error) {
      console.error("Error in registerForMeeting controller:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
  
  /**
   * Register a participant for a Zoom webinar
   * @param req - Express request object
   * @param res - Express response object
   */
  public async registerForWebinar(req: Request, res: Response): Promise<void> {
    try {
      const webinarId = req.params.webinarId;
      const accountName = req.query.account as string | undefined;
      
      // Validate webinar ID
      if (!webinarId) {
        res.status(400).json({
          success: false,
          error: "Webinar ID is required",
        });
        return;
      }
      
      // Extract registration data from request body
      const registrationData: ZoomRegistrationRequest = req.body;
      
      // Validate required fields
      if (!registrationData.email || !registrationData.first_name || !registrationData.last_name) {
        res.status(400).json({
          success: false,
          error: "Email, first name, and last name are required fields",
        });
        return;
      }
      
      // Call service to register participant
      const result = await zoomService.registerWebinarParticipant(webinarId, registrationData, accountName);
      
      // Return response based on service result
      res.status(result.statusCode).json({
        success: result.success,
        data: result.data,
        error: result.error,
      });
    } catch (error) {
      console.error("Error in registerForWebinar controller:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  /**
   * Register multiple participants for a Zoom meeting in a batch
   * @param req - Express request object
   * @param res - Express response object
   */
  public async batchRegisterForMeeting(req: Request, res: Response): Promise<void> {
    try {
      const meetingId = req.params.meetingId;
      
      // Validate meeting ID
      if (!meetingId) {
        res.status(400).json({
          success: false,
          error: "Meeting ID is required",
        });
        return;
      }
      
      // Extract batch registration data from request body
      const batchData: ZoomBatchRegistrationRequest = req.body;
      
      // Validate batch data
      if (!batchData.registrants || !Array.isArray(batchData.registrants) || batchData.registrants.length === 0) {
        res.status(400).json({
          success: false,
          error: "Batch registration requires at least one registrant",
        });
        return;
      }

      // Validate required fields for each registrant
      for (let i = 0; i < batchData.registrants.length; i++) {
        const registrant = batchData.registrants[i];
        if (!registrant.email || !registrant.first_name || !registrant.last_name) {
          res.status(400).json({
            success: false,
            error: `Registrant at index ${i} is missing required fields (email, first_name, last_name)`,
          });
          return;
        }
      }
      
      // Call service to register participants in batch
      const result = await zoomService.batchRegisterParticipants(meetingId, batchData);
      
      // Return response based on service result
      res.status(result.statusCode).json({
        success: result.success,
        data: result.data,
        error: result.error,
      });
    } catch (error) {
      console.error("Error in batchRegisterForMeeting controller:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  /**
   * Register multiple participants for a Zoom webinar in a batch
   * @param req - Express request object
   * @param res - Express response object
   */
  public async batchRegisterForWebinar(req: Request, res: Response): Promise<void> {
    try {
      const webinarId = req.params.webinarId;
      
      // Validate webinar ID
      if (!webinarId) {
        res.status(400).json({
          success: false,
          error: "Webinar ID is required",
        });
        return;
      }
      
      // Extract batch registration data from request body
      const batchData: ZoomBatchRegistrationRequest = req.body;
      
      // Validate batch data
      if (!batchData.registrants || !Array.isArray(batchData.registrants) || batchData.registrants.length === 0) {
        res.status(400).json({
          success: false,
          error: "Batch registration requires at least one registrant",
        });
        return;
      }

      // Validate required fields for each registrant
      for (let i = 0; i < batchData.registrants.length; i++) {
        const registrant = batchData.registrants[i];
        if (!registrant.email || !registrant.first_name || !registrant.last_name) {
          res.status(400).json({
            success: false,
            error: `Registrant at index ${i} is missing required fields (email, first_name, last_name)`,
          });
          return;
        }
      }
      
      // Call service to register participants in batch
      const result = await zoomService.batchRegisterWebinarParticipants(webinarId, batchData);
      
      // Return response based on service result
      res.status(result.statusCode).json({
        success: result.success,
        data: result.data,
        error: result.error,
      });
    } catch (error) {
      console.error("Error in batchRegisterForWebinar controller:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
}

export default new ZoomController(); 