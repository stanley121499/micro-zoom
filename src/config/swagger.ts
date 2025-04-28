/**
 * Swagger configuration for API documentation
 */
import swaggerJsdoc from "swagger-jsdoc";

/**
 * Swagger definition options
 */
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Zoom Registration API",
      version: "1.0.0",
      description: "API for registering participants to Zoom meetings and webinars with support for multiple Zoom accounts",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        RegistrationRequest: {
          type: "object",
          required: ["email", "first_name", "last_name"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "Email address of the participant",
            },
            first_name: {
              type: "string",
              description: "First name of the participant",
            },
            last_name: {
              type: "string",
              description: "Last name of the participant",
            },
            address: {
              type: "string",
              description: "Address of the participant",
            },
            city: {
              type: "string",
              description: "City of the participant",
            },
            country: {
              type: "string",
              description: "Country of the participant",
            },
            zip: {
              type: "string",
              description: "Zip/postal code of the participant",
            },
            state: {
              type: "string",
              description: "State/province of the participant",
            },
            phone: {
              type: "string",
              description: "Phone number of the participant",
            },
            industry: {
              type: "string",
              description: "Industry of the participant",
            },
            org: {
              type: "string",
              description: "Organization of the participant",
            },
            job_title: {
              type: "string",
              description: "Job title of the participant",
            },
            custom_questions: {
              type: "array",
              description: "Custom questions and responses",
              items: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    description: "Title of the custom question",
                  },
                  value: {
                    type: "string",
                    description: "Response to the custom question",
                  },
                },
              },
            },
          },
        },
        BatchRegistrationRequest: {
          type: "object",
          required: ["registrants"],
          properties: {
            registrants: {
              type: "array",
              description: "Array of registrants to process in batch",
              items: {
                $ref: "#/components/schemas/RegistrationRequest",
              },
            },
          },
        },
        RegistrationResponse: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Registration ID",
            },
            meeting_id: {
              type: "string",
              description: "Meeting ID",
            },
            topic: {
              type: "string",
              description: "Meeting topic",
            },
            create_time: {
              type: "string",
              format: "date-time",
              description: "Registration creation time",
            },
            status: {
              type: "string",
              enum: ["approved", "pending", "denied"],
              description: "Registration status",
            },
            join_url: {
              type: "string",
              format: "uri",
              description: "Join URL for the meeting",
            },
            email: {
              type: "string",
              format: "email",
              description: "Participant email",
            },
            first_name: {
              type: "string",
              description: "Participant first name",
            },
            last_name: {
              type: "string",
              description: "Participant last name",
            },
          },
        },
        BatchRegistrationResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              description: "Indicates if any registrations were successful",
            },
            data: {
              type: "object",
              properties: {
                registrants: {
                  type: "array",
                  description: "Results for each registrant",
                  items: {
                    type: "object",
                    properties: {
                      result: {
                        type: "object",
                        nullable: true,
                        description: "Registration data if successful",
                        properties: {
                          id: {
                            type: "string",
                            description: "ID of the registrant",
                          },
                          meeting_id: {
                            type: "string",
                            description: "ID of the meeting or webinar",
                          },
                          topic: {
                            type: "string",
                            description: "Topic of the meeting or webinar",
                          },
                          join_url: {
                            type: "string",
                            description: "URL for joining the meeting or webinar",
                          },
                          email: {
                            type: "string",
                            description: "Email of the registrant",
                          },
                        },
                      },
                      error: {
                        type: "string",
                        description: "Error message if registration failed",
                      },
                      email: {
                        type: "string",
                        description: "Email of the registrant",
                      },
                    },
                  },
                },
                successful_count: {
                  type: "integer",
                  description: "Number of successful registrations",
                },
                failed_count: {
                  type: "integer",
                  description: "Number of failed registrations",
                },
              },
            },
            error: {
              type: "string",
              description: "Error message if the entire batch process failed",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              description: "Success status",
            },
            error: {
              type: "string",
              description: "Error message",
            },
          },
        },
        HealthResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              description: "Status of the API",
            },
            message: {
              type: "string",
              description: "Description of the API status",
            },
            timestamp: {
              type: "string",
              format: "date-time",
              description: "Current timestamp",
            },
          },
        },
        AccountParameter: {
          type: "object",
          properties: {
            account: {
              type: "string",
              description: "Name of the Zoom account to use (defaults to the configured default account)",
              example: "account2",
            },
          },
        },
      },
      parameters: {
        accountParameter: {
          name: "account",
          in: "query",
          description: "Name of the Zoom account to use (defaults to the configured default account)",
          required: false,
          schema: {
            type: "string",
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

/**
 * Generated Swagger specification
 */
const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec; 