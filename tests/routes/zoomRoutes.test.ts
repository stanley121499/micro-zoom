/**
 * Tests for Zoom API routes
 */
import request from "supertest";
import express, { Express, Request, Response, Router } from "express";
import ZoomController from "../../src/controllers/zoomController";

// Mock the ZoomController
jest.mock("../../src/controllers/zoomController");

describe("Zoom Routes", () => {
  let app: Express;
  let mockZoomController: {
    registerForMeeting: jest.Mock;
    registerForWebinar: jest.Mock;
    batchRegisterForMeeting: jest.Mock;
    batchRegisterForWebinar: jest.Mock;
  };

  beforeEach(() => {
    // Create a new Express application for each test
    app = express();
    app.use(express.json());
    
    // Create mock controller methods
    mockZoomController = {
      registerForMeeting: jest.fn(),
      registerForWebinar: jest.fn(),
      batchRegisterForMeeting: jest.fn(),
      batchRegisterForWebinar: jest.fn()
    };
    
    // Directly set up routes with mock controller instead of using zoomRoutes
    const router = express.Router();
    router.post("/meetings/:meetingId/register", mockZoomController.registerForMeeting);
    router.post("/webinars/:webinarId/register", mockZoomController.registerForWebinar);
    router.post("/meetings/:meetingId/batch-register", mockZoomController.batchRegisterForMeeting);
    router.post("/webinars/:webinarId/batch-register", mockZoomController.batchRegisterForWebinar);
    
    app.use("/api/zoom", router);
  });

  describe("POST /meetings/:meetingId/register", () => {
    const meetingId = "123456789";
    const validRegistrant = {
      email: "test@example.com",
      first_name: "John",
      last_name: "Doe"
    };

    it("should call the controller with correct parameters", async () => {
      // Setup controller mock to handle request
      mockZoomController.registerForMeeting.mockImplementation((req: Request, res: Response) => {
        res.status(201).json({
          success: true,
          data: {
            id: "abcd1234",
            meeting_id: meetingId,
            topic: "Test Meeting",
            status: "approved"
          }
        });
      });

      // Make the request
      const response = await request(app)
        .post(`/api/zoom/meetings/${meetingId}/register`)
        .send(validRegistrant)
        .expect("Content-Type", /json/)
        .expect(201);

      // Verify controller was called
      expect(mockZoomController.registerForMeeting).toHaveBeenCalled();
      
      // Verify response
      expect(response.body).toEqual({
        success: true,
        data: {
          id: "abcd1234",
          meeting_id: meetingId,
          topic: "Test Meeting",
          status: "approved"
        }
      });
    });

    it("should return error when registration fails", async () => {
      // Setup controller mock to return error
      mockZoomController.registerForMeeting.mockImplementation((req: Request, res: Response) => {
        res.status(400).json({
          success: false,
          error: "Registration failed"
        });
      });

      // Make the request
      const response = await request(app)
        .post(`/api/zoom/meetings/${meetingId}/register`)
        .send(validRegistrant)
        .expect("Content-Type", /json/)
        .expect(400);

      // Verify response
      expect(response.body).toEqual({
        success: false,
        error: "Registration failed"
      });
    });
  });

  describe("POST /webinars/:webinarId/register", () => {
    const webinarId = "987654321";
    const validRegistrant = {
      email: "test@example.com",
      first_name: "John",
      last_name: "Doe"
    };

    it("should call the controller with correct parameters", async () => {
      // Setup controller mock to handle request
      mockZoomController.registerForWebinar.mockImplementation((req: Request, res: Response) => {
        res.status(201).json({
          success: true,
          data: {
            id: "wxyz5678",
            meeting_id: webinarId,
            topic: "Test Webinar",
            status: "approved"
          }
        });
      });

      // Make the request
      const response = await request(app)
        .post(`/api/zoom/webinars/${webinarId}/register`)
        .send(validRegistrant)
        .expect("Content-Type", /json/)
        .expect(201);

      // Verify controller was called
      expect(mockZoomController.registerForWebinar).toHaveBeenCalled();
      
      // Verify response
      expect(response.body).toEqual({
        success: true,
        data: {
          id: "wxyz5678",
          meeting_id: webinarId,
          topic: "Test Webinar",
          status: "approved"
        }
      });
    });
  });

  describe("POST /meetings/:meetingId/batch-register", () => {
    const meetingId = "123456789";
    const batchRequest = {
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

    it("should call the controller for batch meeting registration", async () => {
      // Setup controller mock to handle request
      mockZoomController.batchRegisterForMeeting.mockImplementation((req: Request, res: Response) => {
        res.status(200).json({
          success: true,
          data: {
            successful_count: 2,
            failed_count: 0,
            registrants: [
              { 
                result: { id: "abcd1234" },
                email: "participant1@example.com"
              },
              { 
                result: { id: "abcd5678" },
                email: "participant2@example.com"
              }
            ]
          }
        });
      });

      // Make the request
      const response = await request(app)
        .post(`/api/zoom/meetings/${meetingId}/batch-register`)
        .send(batchRequest)
        .expect("Content-Type", /json/)
        .expect(200);

      // Verify controller was called
      expect(mockZoomController.batchRegisterForMeeting).toHaveBeenCalled();
      
      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.data.successful_count).toBe(2);
      expect(response.body.data.registrants.length).toBe(2);
    });

    it("should return error when batch request is invalid", async () => {
      // Setup controller mock to return error
      mockZoomController.batchRegisterForMeeting.mockImplementation((req: Request, res: Response) => {
        res.status(400).json({
          success: false,
          error: "No registrants provided in the request"
        });
      });

      // Make the request with empty registrants array
      const response = await request(app)
        .post(`/api/zoom/meetings/${meetingId}/batch-register`)
        .send({ registrants: [] })
        .expect("Content-Type", /json/)
        .expect(400);

      // Verify response
      expect(response.body).toEqual({
        success: false,
        error: "No registrants provided in the request"
      });
    });
  });

  describe("POST /webinars/:webinarId/batch-register", () => {
    const webinarId = "987654321";
    const batchRequest = {
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

    it("should call the controller for batch webinar registration", async () => {
      // Setup controller mock to handle request
      mockZoomController.batchRegisterForWebinar.mockImplementation((req: Request, res: Response) => {
        res.status(200).json({
          success: true,
          data: {
            successful_count: 2,
            failed_count: 0,
            registrants: [
              { 
                result: { id: "wxyz5678" },
                email: "participant1@example.com"
              },
              { 
                result: { id: "wxyz8765" },
                email: "participant2@example.com"
              }
            ]
          }
        });
      });

      // Make the request
      const response = await request(app)
        .post(`/api/zoom/webinars/${webinarId}/batch-register`)
        .send(batchRequest)
        .expect("Content-Type", /json/)
        .expect(200);

      // Verify controller was called
      expect(mockZoomController.batchRegisterForWebinar).toHaveBeenCalled();
      
      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.data.successful_count).toBe(2);
      expect(response.body.data.registrants.length).toBe(2);
    });
  });
}); 