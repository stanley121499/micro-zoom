/**
 * Interfaces for Zoom API integration
 */

/**
 * Zoom account configuration interface
 */
export interface ZoomAccountConfig {
  /** The name of the Zoom account */
  name: string;
  /** The client ID for the Zoom account */
  clientId: string;
  /** The client secret for the Zoom account */
  clientSecret: string;
  /** The account ID for the Zoom account */
  accountId: string;
}

/**
 * Person registration request interface
 */
export interface ZoomRegistrationRequest {
  /** The email address of the registrant */
  email: string;
  /** The first name of the registrant */
  first_name: string;
  /** The last name of the registrant */
  last_name: string;
  /** The address of the registrant (optional) */
  address?: string;
  /** The city of the registrant (optional) */
  city?: string;
  /** The country of the registrant (optional) */
  country?: string;
  /** The zip/postal code of the registrant (optional) */
  zip?: string;
  /** The state/province of the registrant (optional) */
  state?: string;
  /** The phone number of the registrant (optional) */
  phone?: string;
  /** The industry of the registrant (optional) */
  industry?: string;
  /** The organization of the registrant (optional) */
  org?: string;
  /** The job title of the registrant (optional) */
  job_title?: string;
  /** Custom questions and responses (optional) */
  custom_questions?: {
    /** Title of the custom question */
    title: string;
    /** Response to the custom question */
    value: string;
  }[];
}

/**
 * Batch registration request interface
 */
export interface ZoomBatchRegistrationRequest {
  /** Array of registrant data */
  registrants: ZoomRegistrationRequest[];
}

/**
 * Zoom registration response interface
 */
export interface ZoomRegistrationResponse {
  /** The ID of the registrant */
  id: string;
  /** The meeting or webinar ID */
  meeting_id: string;
  /** The topic of the meeting or webinar */
  topic: string;
  /** The time when registration occurred */
  create_time: string;
  /** The status of the registration */
  status: "approved" | "pending" | "denied";
  /** The join URL for the registrant */
  join_url?: string;
  /** The email address of the registrant */
  email: string;
  /** The first name of the registrant */
  first_name: string;
  /** The last name of the registrant */
  last_name: string;
}

/**
 * Batch registration response interface
 */
export interface ZoomBatchRegistrationResponse {
  /** Array of registration results */
  registrants: {
    /** The result for a specific registrant */
    result: ZoomRegistrationResponse | null;
    /** Error message if registration failed */
    error?: string;
    /** Email address to identify the registrant in case of error */
    email: string;
  }[];
  /** Count of successful registrations */
  successful_count: number;
  /** Count of failed registrations */
  failed_count: number;
}

/**
 * Error response from Zoom API
 */
export interface ZoomErrorResponse {
  /** The error code returned by Zoom */
  code: number;
  /** The error message returned by Zoom */
  message: string;
}

/**
 * Service response interface
 */
export interface ServiceResponse<T> {
  /** Success status of the request */
  success: boolean;
  /** Response data if successful */
  data?: T;
  /** Error message if unsuccessful */
  error?: string;
  /** Status code for the response */
  statusCode: number;
} 