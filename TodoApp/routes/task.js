const express = require('express');

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getTaskById,
  searchTasks
} = require('../services/task');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Tasks
 *     description: User management
 * 
 *  */


/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - user
 *         - title
 *         - deadline
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the task
 *         user:
 *           type: string
 *           description: User ID who owns the task
 *         title:
 *           type: string
 *           description: Title of the task
 *           maxLength: 100
 *         description:
 *           type: string
 *           description: Description of the task
 *           maxLength: 500
 *         deadline:
 *           type: string
 *           format: date-time
 *           description: Deadline for the task
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           description: Priority of the task
 *         status:
 *           type: string
 *           enum: [pending, in progress, completed]
 *           description: Current status of the task
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Task creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Task last update timestamp
 *       example:
 *         id: "641b25f2e123456789abcdef"
 *         user: "641a1234e123456789abcdef"
 *         title: "Complete API documentation"
 *         description: "Finish writing the Swagger documentation for the API"
 *         deadline: "2024-11-30T23:59:59Z"
 *         priority: "high"
 *         status: "in progress"
 *         createdAt: "2024-11-25T12:00:00Z"
 *         updatedAt: "2024-11-26T12:00:00Z"
 */



/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     UnauthorizedError:
 *       description: Access token is missing or invalid
 *     InternalServerError:
 *       description: Internal server error
 */

/**
 * @swagger
 * components:
 *   responses:
 *     UnauthorizedError:
 *       description: Unauthorized. Access token is missing or invalid.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: Unauthorized
 *               message:
 *                 type: string
 *                 example: Access token is missing or invalid.
 *     ValidationError:
 *       description: Validation error. Missing or invalid fields.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: ValidationError
 *               message:
 *                 type: string
 *                 example: Invalid or missing required fields.
 *     InternalServerError:
 *       description: Internal server error.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: InternalServerError
 *               message:
 *                 type: string
 *                 example: An unexpected error occurred.
 */



/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []  # Use the defined security scheme
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the task
 *                 example: "Complete project documentation"
 *               description:
 *                 type: string
 *                 description: Detailed description of the task
 *                 example: "Write and submit the project documentation for the software project."
 *               deadline:
 *                 type: string
 *                 format: date
 *                 description: Deadline for the task
 *                 example: "2024-12-31"
 *               priority:
 *                 type: string
 *                 enum: ['low', 'medium', 'high']
 *                 description: Priority level of the task
 *                 example: "high"
 *               status:
 *                 type: string
 *                 enum: ['pending', 'in progress', 'completed']
 *                 description: Current status of the task
 *                 example: "pending"
 *     responses:
 *       '201':
 *         description: Successfully created task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Task created successfully!"
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */


router.post('/', createTask);



/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks for the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []  # Use the defined security scheme
 *     responses:
 *       '200':
 *         description: Successfully fetched tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Tasks fetched successfully."
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       '400':
 *         $ref: '#/components/responses/ValidationError'
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */

// Get all tasks for a user (protected route)
router.get('/', getTasks);



/**
 * @swagger
 * /tasks/{taskId}:
 *   put:
 *     summary: Update a task for the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []  # Use the defined security scheme
 *     parameters:
 *       - name: taskId
 *         in: path
 *         required: true
 *         description: The ID of the task to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the task
 *               description:
 *                 type: string
 *                 description: A detailed description of the task
 *               deadline:
 *                 type: string
 *                 format: date
 *                 description: The deadline for the task
 *               priority:
 *                 type: string
 *                 enum: ['low', 'medium', 'high']
 *                 description: The priority of the task
 *               status:
 *                 type: string
 *                 enum: ['pending', 'in progress', 'completed']
 *                 description: The current status of the task
 *     responses:
 *       '200':
 *         description: Successfully updated the task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Task updated successfully."
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       '400':
 *         $ref: '#/components/responses/ValidationError'
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */





// Update a task (protected route)
router.put('/:taskId', updateTask);


/**
 * @swagger
 * /tasks/{taskId}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the task to delete
 *     responses:
 *       '200':
 *         description: Task deleted successfully
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '403':
 *         description: You are not authorized to delete this task
 *       '404':
 *         description: Task not found
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */

// Delete a task (protected route)
router.delete('/:taskId', deleteTask);



/**
 * @swagger
 * /tasks/{taskId}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []  # Use the defined security scheme
 *     parameters:
 *       - name: taskId
 *         in: path
 *         required: true
 *         description: The ID of the task to fetch
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully fetched the task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Task fetched successfully."
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       '400':
 *         description: Invalid task ID provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid task ID"
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '404':
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Task not found"
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */

router.get('/:taskId', getTaskById);

/**
 * @swagger
 * /tasks/x/search:
 *   get:
 *     summary: Search tasks by title or description
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []  # Use the defined security scheme
 *     parameters:
 *       - name: query
 *         in: query
 *         required: true
 *         description: Search term to match in the title or description of tasks.
 *         schema:
 *           type: string
 *           example: "documentation"
 *     responses:
 *       '200':
 *         description: Successfully fetched tasks matching the search query
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Tasks fetched successfully."
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       '400':
 *         description: Search query is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Search query is required."
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '404':
 *         description: No tasks found matching the search query
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "No tasks found matching the search criteria."
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */

router.get('/x/search', searchTasks);
module.exports = router;
