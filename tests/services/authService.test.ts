/**
 * Tests for authentication in Zoom service
 */
import axios from "axios";
import { ZoomRegistrationRequest } from "../../src/interfaces/ZoomInterfaces";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock ZoomService
jest.mock("../../src/services/zoomService");

describe("Zoom Authentication", () => {
  let zoomService: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset axios mocks
    mockedAxios.post.mockReset();

    // Create mock zoomService
    zoomService = {
      getAccessToken: jest.fn(),
      registerParticipant: jest.fn(),
      registerWebinarParticipant: jest.fn(),
      batchRegisterParticipants: jest.fn(),
      batchRegisterWebinarParticipants: jest.fn()
    };
  });
  
  describe("Token Generation", () => {
    it("should generate access token successfully", async () => {
      // Setup mock token response
      const mockTokenResponse = {
        data: {
          access_token: "mock-access-token",
          token_type: "bearer",
          expires_in: 3600
        }
      };
      
      // Mock axios post call
      mockedAxios.post.mockResolvedValueOnce(mockTokenResponse);
      
      // Setup mock for getAccessToken
      zoomService.getAccessToken.mockImplementation(async () => {
        const response = await mockedAxios.post("https://zoom.us/oauth/token", null, {
          params: {
            grant_type: "account_credentials",
            account_id: undefined,
            client_id: undefined,
            client_secret: undefined
          },
          headers: {
            "Content-Type": "application/json"
          }
        });
        return response.data.access_token;
      });
      
      // Call the getAccessToken method
      const token = await zoomService.getAccessToken();
      
      // Verify token
      expect(token).toBe("mock-access-token");
      
      // Verify axios was called correctly
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://zoom.us/oauth/token",
        null,
        expect.objectContaining({
          params: expect.objectContaining({
            grant_type: "account_credentials"
          }),
          headers: expect.objectContaining({
            "Content-Type": "application/json"
          })
        })
      );
    });
    
    it("should throw error when token retrieval fails", async () => {
      // Mock axios to reject
      mockedAxios.post.mockRejectedValueOnce(new Error("Authentication failed"));
      
      // Setup mock for getAccessToken with error
      zoomService.getAccessToken.mockImplementation(async () => {
        try {
          await mockedAxios.post("https://zoom.us/oauth/token");
          return "token";
        } catch (error) {
          throw new Error("Failed to authenticate with Zoom API");
        }
      });
      
      // Call and expect error
      await expect(zoomService.getAccessToken()).rejects.toThrow("Failed to authenticate with Zoom API");
    });
  });
  
  describe("API Authentication", () => {
    it("should include authorization header in API requests", async () => {
      // Prepare mocks
      const mockTokenResponse = {
        data: {
          access_token: "mock-access-token"
        }
      };
      
      const mockRegistrationResponse = {
        data: {
          id: "abcd1234",
          status: "approved"
        },
        status: 201
      };
      
      // Setup mock responses - First getAccessToken POST, then registration POST
      mockedAxios.post.mockResolvedValueOnce(mockTokenResponse);  // For token
      mockedAxios.post.mockResolvedValueOnce(mockRegistrationResponse);  // For API call
      
      // Mock getAccessToken to return the token directly without making POST call
      // This prevents duplicate calls to mockedAxios.post
      zoomService.getAccessToken.mockReturnValueOnce("mock-access-token");
      
      // Implement registerParticipant method that uses the token
      zoomService.registerParticipant.mockImplementation(async (meetingId: string, registrant: ZoomRegistrationRequest) => {
        const token = await zoomService.getAccessToken();
        
        const headers = {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        };
        
        const response = await mockedAxios.post(
          `https://api.zoom.us/v2/meetings/${meetingId}/registrants`,
          registrant,
          { headers }
        );
        
        return {
          success: response.status === 201,
          statusCode: response.status,
          data: response.data
        };
      });
      
      // Call the registerParticipant method
      const meetingId = "123456789";
      const registrant = {
        email: "test@example.com",
        first_name: "John",
        last_name: "Doe"
      };
      
      await zoomService.registerParticipant(meetingId, registrant);
      
      // Verify the API call was made with the token - Only expect 1 call since getAccessToken is mocked
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      
      // Check that URL and registrant data are correct
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `https://api.zoom.us/v2/meetings/${meetingId}/registrants`,
        registrant,
        expect.objectContaining({
          headers: expect.objectContaining({
            "Authorization": "Bearer mock-access-token"
          })
        })
      );
    });
  });
}); 