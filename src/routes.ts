import { Express, Request, Response } from "express";
import {
  createPostHandler,
  updatePostHandler,
  getPostHandler,
  deletePostHandler,
} from "./controller/post.controller";
import { createUserHandler } from "./controller/user.controller";
import {
  createUserSessionHandler,
  invalidateUserSessionHandler,
  getUserSessionsHandler,
} from "./controller/session.controller";
import { validateRequest, requiresUser } from "./middleware";
import {
  createUserSchema,
  createUserSessionSchema,
} from "./schema/user.schema";
import {
  createPostSchema,
  updatePostSchema,
  deletePostSchema,
} from "./schema/post.schema";
import uploadFile from "./middleware/multer";
import { getCourseHandler, upload } from "./controller/excel.controller";

export default function (app: Express) {
    /**
   * @openapi
   * /healthcheck:
   *  get:
   *     tags:
   *     - Healthcheck
   *     description: Responds if the app is up and running
   *     responses:
   *       200:
   *         description: App is up and running
   */
  app.get("/healthcheck", (req: Request, res: Response) => res.status(200).send("App is up and running"));

  /**
   * @openapi
   * '/api/users':
   *  post:
   *     tags:
   *     - User
   *     summary: Register a user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/CreateUserInput'
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/CreateUserResponse'
   *      409:
   *        description: Conflict
   *      400:
   *        description: Bad request
   */
  app.post("/api/users", validateRequest(createUserSchema), createUserHandler);

  // Login
  app.post(
    "/api/sessions",
    validateRequest(createUserSessionSchema),
    createUserSessionHandler
  );

  // Get the user's sessions
  app.get("/api/sessions", requiresUser, getUserSessionsHandler);

  // Logout
  app.delete("/api/sessions", requiresUser, invalidateUserSessionHandler);

  // Create a post
  // app.post(
  //   "/api/posts",
  //   [requiresUser, validateRequest(createPostSchema)],
  //   createPostHandler
  // );

  // // Update a post
  // app.put(
  //   "/api/posts/:postId",
  //   [requiresUser, validateRequest(updatePostSchema)],
  //   updatePostHandler
  // );

  // // Get a post
  // app.get("/api/posts/:postId", getPostHandler);

  // // Delete a post
  // app.delete(
  //   "/api/posts/:postId",
  //   [requiresUser, validateRequest(deletePostSchema)],
  //   deletePostHandler
  // );
  
  // upload excel file
  app.post("/api/excel/upload", requiresUser, uploadFile.array("file", 2), upload);

  app.get("/api/course", requiresUser, getCourseHandler)
}
