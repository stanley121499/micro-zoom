/**
 * Routes for Zoom API endpoints
 */
import { Router } from "express";
import zoomController from "../controllers/zoomController";

const router = Router();

/**
 * @swagger
 * /api/zoom/meetings/{meetingId}/register:
 *   post:
 *     summary: Register a participant for a Zoom meeting
 *     description: Register a new participant for a specific Zoom meeting using their personal information
 *     tags: [Meetings]
 *     parameters:
 *       - in: path
 *         name: meetingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The Zoom meeting ID
 *       - in: query
 *         name: account
 *         required: false
 *         schema:
 *           type: string
 *         description: Name of the Zoom account to use (defaults to the configured default account)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistrationRequest'
 *     responses:
 *       200:
 *         description: Participant successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistrationResponse'
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid Zoom credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/meetings/:meetingId/register", zoomController.registerForMeeting);

/**
 * @swagger
 * /api/zoom/webinars/{webinarId}/register:
 *   post:
 *     summary: Register a participant for a Zoom webinar
 *     description: Register a new participant for a specific Zoom webinar using their personal information
 *     tags: [Webinars]
 *     parameters:
 *       - in: path
 *         name: webinarId
 *         required: true
 *         schema:
 *           type: string
 *         description: The Zoom webinar ID
 *       - in: query
 *         name: account
 *         required: false
 *         schema:
 *           type: string
 *         description: Name of the Zoom account to use (defaults to the configured default account)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistrationRequest'
 *     responses:
 *       200:
 *         description: Participant successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistrationResponse'
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid Zoom credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/webinars/:webinarId/register", zoomController.registerForWebinar);

/**
 * @swagger
 * /api/zoom/meetings/{meetingId}/batch-register:
 *   post:
 *     summary: Register multiple participants for a Zoom meeting
 *     description: Register multiple participants at once for a specific Zoom meeting in a batch operation
 *     tags: [Meetings]
 *     parameters:
 *       - in: path
 *         name: meetingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The Zoom meeting ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - registrants
 *             properties:
 *               registrants:
 *                 type: array
 *                 description: List of participants to register
 *                 items:
 *                   $ref: '#/components/schemas/RegistrationRequest'
 *     responses:
 *       200:
 *         description: Batch registration processed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether any registrations were successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     registrants:
 *                       type: array
 *                       description: Results for each registrant
 *                       items:
 *                         type: object
 *                         properties:
 *                           result:
 *                             type: object
 *                             nullable: true
 *                             description: Registration data if successful
 *                           error:
 *                             type: string
 *                             description: Error message if failed
 *                           email:
 *                             type: string
 *                             description: Email of the registrant
 *                     successful_count:
 *                       type: integer
 *                       description: Number of successful registrations
 *                     failed_count:
 *                       type: integer
 *                       description: Number of failed registrations
 *       400:
 *         description: Bad request - missing or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid Zoom credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/meetings/:meetingId/batch-register", zoomController.batchRegisterForMeeting);

/**
 * @swagger
 * /api/zoom/webinars/{webinarId}/batch-register:
 *   post:
 *     summary: Register multiple participants for a Zoom webinar
 *     description: Register multiple participants at once for a specific Zoom webinar in a batch operation
 *     tags: [Webinars]
 *     parameters:
 *       - in: path
 *         name: webinarId
 *         required: true
 *         schema:
 *           type: string
 *         description: The Zoom webinar ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - registrants
 *             properties:
 *               registrants:
 *                 type: array
 *                 description: List of participants to register
 *                 items:
 *                   $ref: '#/components/schemas/RegistrationRequest'
 *     responses:
 *       200:
 *         description: Batch registration processed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether any registrations were successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     registrants:
 *                       type: array
 *                       description: Results for each registrant
 *                       items:
 *                         type: object
 *                         properties:
 *                           result:
 *                             type: object
 *                             nullable: true
 *                             description: Registration data if successful
 *                           error:
 *                             type: string
 *                             description: Error message if failed
 *                           email:
 *                             type: string
 *                             description: Email of the registrant
 *                     successful_count:
 *                       type: integer
 *                       description: Number of successful registrations
 *                     failed_count:
 *                       type: integer
 *                       description: Number of failed registrations
 *       400:
 *         description: Bad request - missing or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid Zoom credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/webinars/:webinarId/batch-register", zoomController.batchRegisterForWebinar);

export default router; 