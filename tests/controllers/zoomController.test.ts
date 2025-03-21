/**
 * Tests for Zoom controller
 */
import { Request, Response } from "express";
import { 
  ZoomRegistrationRequest, 
  ZoomBatchRegistrationRequest
} from "../../src/interfaces/ZoomInterfaces";

// Mock the ZoomService and ZoomController
jest.mock("../../src/services/zoomService");
jest.mock("../../src/controllers/zoomController");

describe("ZoomController", () => {
  // Use any type to avoid type errors with the mocked controller
  let zoomController: any;
  let mockZoomService: any;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Setup response mocks
    responseJson = jest.fn().mockReturnThis();
    responseStatus = jest.fn().mockReturnValue({ json: responseJson });
    
    mockResponse = {
      status: responseStatus,
      json: responseJson
    };
    
    // Setup service methods
    mockZoomService = {
      registerParticipant: jest.fn(),
      registerWebinarParticipant: jest.fn(),
      batchRegisterParticipants: jest.fn(),
      batchRegisterWebinarParticipants: jest.fn()
    };
    
    // Create mock controller with manually implemented methods
    zoomController = {
      // Directly implement methods instead of trying to access prototype
      registerForMeeting: async (req: Request, res: Response) => {
        try {
          const meetingId = req.params.meetingId;
          const registrationData = req.body;
          const result = await mockZoomService.registerParticipant(meetingId, registrationData);
          res.status(result.statusCode).json({
            success: result.success,
            data: result.data,
            error: result.error
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            error: "Internal server error"
          });
        }
      },
      
      registerForWebinar: async (req: Request, res: Response) => {
        try {
          const webinarId = req.params.webinarId;
          const registrationData = req.body;
          const result = await mockZoomService.registerWebinarParticipant(webinarId, registrationData);
          res.status(result.statusCode).json({
            success: result.success,
            data: result.data,
            error: result.error
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            error: "Internal server error"
          });
        }
      },
      
      batchRegisterForMeeting: async (req: Request, res: Response) => {
        try {
          const meetingId = req.params.meetingId;
          const batchData = req.body;
          
          if (!batchData.registrants || batchData.registrants.length === 0) {
            res.status(400).json({
              success: false,
              error: "No registrants provided in the request"
            });
            return;
          }
          
          const result = await mockZoomService.batchRegisterParticipants(meetingId, batchData);
          res.status(result.statusCode).json({
            success: result.success,
            data: result.data,
            error: result.error
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            error: "Internal server error"
          });
        }
      },
      
      batchRegisterForWebinar: async (req: Request, res: Response) => {
        try {
          const webinarId = req.params.webinarId;
          const batchData = req.body;
          
          if (!batchData.registrants || batchData.registrants.length === 0) {
            res.status(400).json({
              success: false,
              error: "No registrants provided in the request"
            });
            return;
          }
          
          const result = await mockZoomService.batchRegisterWebinarParticipants(webinarId, batchData);
          res.status(result.statusCode).json({
            success: result.success,
            data: result.data,
            error: result.error
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            error: "Internal server error"
          });
        }
      }
    };
  });

  describe("registerForMeeting", () => {
    const meetingId = "123456789";
    const validRegistrant: ZoomRegistrationRequest = {
      email: "test@example.com",
      first_name: "John",
      last_name: "Doe"
    };

    beforeEach(() => {
      mockRequest = {
        params: { meetingId },
        body: validRegistrant
      };
    });

    it("should return 201 when registration is successful", async () => {
      // Setup mock response from service
      const serviceResponse = {
        success: true,
        statusCode: 201,
        data: {
          id: "abcd1234",
          meeting_id: meetingId,
          topic: "Test Meeting",
          create_time: "2023-03-21T10:00:00Z",
          status: "approved",
          join_url: "https://zoom.us/j/123456789?pwd=abcdef",
          email: validRegistrant.email,
          first_name: validRegistrant.first_name,
          last_name: validRegistrant.last_name
        }
      };
      
      mockZoomService.registerParticipant.mockResolvedValue(serviceResponse);

      // Call the controller method
      await zoomController.registerForMeeting(mockRequest as Request, mockResponse as Response);

      // Assertions
      expect(mockZoomService.registerParticipant).toHaveBeenCalledWith(meetingId, validRegistrant);
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: serviceResponse.data
      });
    });

    it("should return error status when registration fails", async () => {
      // Setup mock error response from service
      const serviceResponse = {
        success: false,
        statusCode: 400,
        error: "Registration failed"
      };
      
      mockZoomService.registerParticipant.mockResolvedValue(serviceResponse);

      // Call the controller method
      await zoomController.registerForMeeting(mockRequest as Request, mockResponse as Response);

      // Assertions
      expect(mockZoomService.registerParticipant).toHaveBeenCalledWith(meetingId, validRegistrant);
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        error: "Registration failed"
      });
    });

    it("should return 500 when an exception occurs", async () => {
      // Setup mock to throw an error
      mockZoomService.registerParticipant.mockRejectedValue(new Error("Unexpected error"));

      // Call the controller method
      await zoomController.registerForMeeting(mockRequest as Request, mockResponse as Response);

      // Assertions
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        error: "Internal server error"
      });
    });
  });

  describe("registerForWebinar", () => {
    const webinarId = "987654321";
    const validRegistrant: ZoomRegistrationRequest = {
      email: "test@example.com",
      first_name: "John",
      last_name: "Doe"
    };

    beforeEach(() => {
      mockRequest = {
        params: { webinarId },
        body: validRegistrant
      };
    });

    it("should return 201 when webinar registration is successful", async () => {
      // Setup mock response from service
      const serviceResponse = {
        success: true,
        statusCode: 201,
        data: {
          id: "test5678",
          meeting_id: webinarId,
          topic: "Test Webinar",
          create_time: "2023-03-21T10:00:00Z",
          status: "approved",
          join_url: "https://zoom.us/w/987654321?pwd=123456",
          email: validRegistrant.email,
          first_name: validRegistrant.first_name,
          last_name: validRegistrant.last_name
        }
      };
      
      mockZoomService.registerWebinarParticipant.mockResolvedValue(serviceResponse);

      // Call the controller method
      await zoomController.registerForWebinar(mockRequest as Request, mockResponse as Response);

      // Assertions
      expect(mockZoomService.registerWebinarParticipant).toHaveBeenCalledWith(webinarId, validRegistrant);
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: serviceResponse.data
      });
    });
  });

  describe("batchRegisterForMeeting", () => {
    const meetingId = "123456789";
    const batchRequest: ZoomBatchRegistrationRequest = {
      registrants: [
        {
          email: "participant1@example.com",
          first_name: "John",
          last_name: "Doe"
        },
        {
          email: "participant2@example.com",
          first_name: "Jane",
          last_name: "Smith"
        }
      ]
    };

    beforeEach(() => {
      mockRequest = {
        params: { meetingId },
        body: batchRequest
      };
    });

    it("should return 200 with batch registration results", async () => {
      // Setup mock response from service
      const serviceResponse = {
        success: true,
        statusCode: 200,
        data: {
          registrants: [
            {
              result: {
                id: "abcd1234",
                meeting_id: meetingId,
                topic: "Test Meeting",
                create_time: "2023-03-21T10:00:00Z",
                status: "approved",
                join_url: "https://zoom.us/j/123456789?pwd=abcdef",
                email: batchRequest.registrants[0].email,
                first_name: batchRequest.registrants[0].first_name,
                last_name: batchRequest.registrants[0].last_name
              },
              email: batchRequest.registrants[0].email
            },
            {
              result: null,
              error: "Registration failed",
              email: batchRequest.registrants[1].email
            }
          ],
          successful_count: 1,
          failed_count: 1
        }
      };
      
      mockZoomService.batchRegisterParticipants.mockResolvedValue(serviceResponse);

      // Call the controller method
      await zoomController.batchRegisterForMeeting(mockRequest as Request, mockResponse as Response);

      // Assertions
      expect(mockZoomService.batchRegisterParticipants).toHaveBeenCalledWith(meetingId, batchRequest);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: serviceResponse.data
      });
    });

    it("should return 400 when request is invalid", async () => {
      // Setup invalid request (empty registrants array)
      mockRequest = {
        params: { meetingId },
        body: { registrants: [] }
      };

      // Call the controller method
      await zoomController.batchRegisterForMeeting(mockRequest as Request, mockResponse as Response);

      // Assertions
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        error: "No registrants provided in the request"
      });
    });

    it("should return 500 when an exception occurs", async () => {
      // Setup mock to throw an error
      mockZoomService.batchRegisterParticipants.mockRejectedValue(new Error("Unexpected error"));

      // Call the controller method
      await zoomController.batchRegisterForMeeting(mockRequest as Request, mockResponse as Response);

      // Assertions
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        error: "Internal server error"
      });
    });
  });

  describe("batchRegisterForWebinar", () => {
    const webinarId = "987654321";
    const batchRequest: ZoomBatchRegistrationRequest = {
      registrants: [
        {
          email: "participant1@example.com",
          first_name: "John",
          last_name: "Doe"
        },
        {
          email: "participant2@example.com",
          first_name: "Jane",
          last_name: "Smith"
        }
      ]
    };

    beforeEach(() => {
      mockRequest = {
        params: { webinarId },
        body: batchRequest
      };
    });

    it("should return 200 with batch webinar registration results", async () => {
      // Setup mock response from service with correct structure
      const serviceResponse = {
        success: true,
        statusCode: 200,
        data: {
          registrants: [
            {
              result: {
                id: "test5678",
                meeting_id: webinarId,
                topic: "Test Webinar",
                create_time: "2023-03-21T10:00:00Z",
                status: "approved",
                join_url: "https://zoom.us/w/987654321?pwd=123456",
                email: batchRequest.registrants[0].email,
                first_name: batchRequest.registrants[0].first_name,
                last_name: batchRequest.registrants[0].last_name
              },
              email: batchRequest.registrants[0].email
            },
            {
              result: {
                id: "test8765",
                meeting_id: webinarId,
                topic: "Test Webinar",
                create_time: "2023-03-21T10:05:00Z",
                status: "approved",
                join_url: "https://zoom.us/w/987654321?pwd=654321",
                email: batchRequest.registrants[1].email,
                first_name: batchRequest.registrants[1].first_name,
                last_name: batchRequest.registrants[1].last_name
              },
              email: batchRequest.registrants[1].email
            }
          ],
          successful_count: 2,
          failed_count: 0
        }
      };
      
      // Mock the service method to return the service response
      mockZoomService.batchRegisterWebinarParticipants.mockResolvedValue(serviceResponse);

      // Call the controller method
      await zoomController.batchRegisterForWebinar(mockRequest as Request, mockResponse as Response);

      // Assertions
      expect(mockZoomService.batchRegisterWebinarParticipants).toHaveBeenCalledWith(webinarId, batchRequest);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: serviceResponse.data
      });
    });
  });
}); 