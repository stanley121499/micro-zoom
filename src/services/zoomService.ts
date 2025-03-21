/**
 * Service for interacting with the Zoom API
 */
import axios from "axios";
import config from "../config/config";
import { 
  ZoomRegistrationRequest, 
  ZoomRegistrationResponse, 
  ZoomErrorResponse,
  ServiceResponse,
  ZoomBatchRegistrationRequest,
  ZoomBatchRegistrationResponse
} from "../interfaces/ZoomInterfaces";

/**
 * Zoom service class for API operations
 */
class ZoomService {
  /**
   * Base URL for Zoom API
   */
  private readonly baseUrl = "https://api.zoom.us/v2";
  
  /**
   * Generate access token for Zoom API authentication
   * @returns Access token for API authentication
   */
  private async getAccessToken(): Promise<string> {
    try {
      // Using Server-to-Server OAuth for authentication
      const response = await axios.post(
        "https://zoom.us/oauth/token",
        null,
        {
          params: {
            grant_type: "account_credentials",
            account_id: config.zoom.accountId,
          },
          headers: {
            Authorization: `Basic ${Buffer.from(config.zoom.clientId + ":" + config.zoom.clientSecret).toString("base64")}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      return response.data.access_token;
    } catch (error) {
      console.error("Error generating Zoom access token:", error);
      throw new Error("Failed to authenticate with Zoom API");
    }
  }
  
  /**
   * Register a participant for a Zoom meeting
   * @param meetingId - The Zoom meeting ID
   * @param registrationData - Participant registration information
   * @returns ServiceResponse with registration result
   */
  public async registerParticipant(
    meetingId: string, 
    registrationData: ZoomRegistrationRequest
  ): Promise<ServiceResponse<ZoomRegistrationResponse>> {
    try {
      // Get access token
      const accessToken = await this.getAccessToken();
      
      // Make request to Zoom API
      const response = await axios.post(
        `${this.baseUrl}/meetings/${meetingId}/registrants`,
        registrationData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      return {
        success: true,
        data: response.data as ZoomRegistrationResponse,
        statusCode: response.status,
      };
    } catch (error) {
      console.error("Error registering participant:", error);
      
      // Extract error information from Zoom API response
      let errorMessage = "Failed to register participant";
      let statusCode = 500;
      
      if (axios.isAxiosError(error) && error.response) {
        const zoomError = error.response.data as ZoomErrorResponse;
        errorMessage = zoomError.message || errorMessage;
        statusCode = error.response.status;
      }
      
      return {
        success: false,
        error: errorMessage,
        statusCode: statusCode,
      };
    }
  }
  
  /**
   * Register a participant for a Zoom webinar
   * @param webinarId - The Zoom webinar ID
   * @param registrationData - Participant registration information
   * @returns ServiceResponse with registration result
   */
  public async registerWebinarParticipant(
    webinarId: string, 
    registrationData: ZoomRegistrationRequest
  ): Promise<ServiceResponse<ZoomRegistrationResponse>> {
    try {
      // Get access token
      const accessToken = await this.getAccessToken();
      
      // Make request to Zoom API
      const response = await axios.post(
        `${this.baseUrl}/webinars/${webinarId}/registrants`,
        registrationData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      return {
        success: true,
        data: response.data as ZoomRegistrationResponse,
        statusCode: response.status,
      };
    } catch (error) {
      console.error("Error registering webinar participant:", error);
      
      // Extract error information from Zoom API response
      let errorMessage = "Failed to register webinar participant";
      let statusCode = 500;
      
      if (axios.isAxiosError(error) && error.response) {
        const zoomError = error.response.data as ZoomErrorResponse;
        errorMessage = zoomError.message || errorMessage;
        statusCode = error.response.status;
      }
      
      return {
        success: false,
        error: errorMessage,
        statusCode: statusCode,
      };
    }
  }

  /**
   * Register multiple participants for a Zoom meeting in a batch
   * @param meetingId - The Zoom meeting ID
   * @param batchData - Batch of participant registration information
   * @returns ServiceResponse with batch registration results
   */
  public async batchRegisterParticipants(
    meetingId: string,
    batchData: ZoomBatchRegistrationRequest
  ): Promise<ServiceResponse<ZoomBatchRegistrationResponse>> {
    try {
      // Validate the batch data
      if (!batchData.registrants || !Array.isArray(batchData.registrants) || batchData.registrants.length === 0) {
        return {
          success: false,
          error: "Batch registration requires at least one registrant",
          statusCode: 400,
        };
      }

      // Initialize result object
      const result: ZoomBatchRegistrationResponse = {
        registrants: [],
        successful_count: 0,
        failed_count: 0
      };

      // Register each participant individually
      for (const registrant of batchData.registrants) {
        try {
          // Register the participant
          const response = await this.registerParticipant(meetingId, registrant);
          
          if (response.success && response.data) {
            // Registration succeeded
            result.registrants.push({
              result: response.data,
              email: registrant.email
            });
            result.successful_count++;
          } else {
            // Registration failed
            result.registrants.push({
              result: null,
              error: response.error ?? "Unknown error",
              email: registrant.email
            });
            result.failed_count++;
          }
        } catch (error) {
          // Registration failed due to exception
          let errorMessage = "Failed to register participant";
          if (error instanceof Error) {
            errorMessage = error.message;
          }
          
          result.registrants.push({
            result: null,
            error: errorMessage,
            email: registrant.email
          });
          result.failed_count++;
        }
      }

      // Determine overall success based on if at least one registration was successful
      const isOverallSuccess = result.successful_count > 0;
      
      return {
        success: isOverallSuccess,
        data: result,
        statusCode: isOverallSuccess ? 200 : 400,
      };
    } catch (error) {
      console.error("Error during batch registration:", error);
      
      return {
        success: false,
        error: "Failed to process batch registration",
        statusCode: 500,
      };
    }
  }

  /**
   * Register multiple participants for a Zoom webinar in a batch
   * @param webinarId - The Zoom webinar ID
   * @param batchData - Batch of participant registration information
   * @returns ServiceResponse with batch registration results
   */
  public async batchRegisterWebinarParticipants(
    webinarId: string,
    batchData: ZoomBatchRegistrationRequest
  ): Promise<ServiceResponse<ZoomBatchRegistrationResponse>> {
    try {
      // Validate the batch data
      if (!batchData.registrants || !Array.isArray(batchData.registrants) || batchData.registrants.length === 0) {
        return {
          success: false,
          error: "Batch registration requires at least one registrant",
          statusCode: 400,
        };
      }

      // Initialize result object
      const result: ZoomBatchRegistrationResponse = {
        registrants: [],
        successful_count: 0,
        failed_count: 0
      };

      // Register each participant individually
      for (const registrant of batchData.registrants) {
        try {
          // Register the participant
          const response = await this.registerWebinarParticipant(webinarId, registrant);
          
          if (response.success && response.data) {
            // Registration succeeded
            result.registrants.push({
              result: response.data,
              email: registrant.email
            });
            result.successful_count++;
          } else {
            // Registration failed
            result.registrants.push({
              result: null,
              error: response.error ?? "Unknown error",
              email: registrant.email
            });
            result.failed_count++;
          }
        } catch (error) {
          // Registration failed due to exception
          let errorMessage = "Failed to register webinar participant";
          if (error instanceof Error) {
            errorMessage = error.message;
          }
          
          result.registrants.push({
            result: null,
            error: errorMessage,
            email: registrant.email
          });
          result.failed_count++;
        }
      }

      // Determine overall success based on if at least one registration was successful
      const isOverallSuccess = result.successful_count > 0;
      
      return {
        success: isOverallSuccess,
        data: result,
        statusCode: isOverallSuccess ? 200 : 400,
      };
    } catch (error) {
      console.error("Error during batch webinar registration:", error);
      
      return {
        success: false,
        error: "Failed to process batch webinar registration",
        statusCode: 500,
      };
    }
  }
}

export default new ZoomService(); 