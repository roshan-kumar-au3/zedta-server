"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("./controller/user.controller");
const session_controller_1 = require("./controller/session.controller");
const middleware_1 = require("./middleware");
const user_schema_1 = require("./schema/user.schema");
const multer_1 = __importDefault(require("./middleware/multer"));
const excel_controller_1 = require("./controller/excel.controller");
function default_1(app) {
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
    app.get("/healthcheck", (req, res) => res.status(200).send("App is up and running"));
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
    app.post("/api/users", (0, middleware_1.validateRequest)(user_schema_1.createUserSchema), user_controller_1.createUserHandler);
    // Login
    app.post("/api/sessions", (0, middleware_1.validateRequest)(user_schema_1.createUserSessionSchema), session_controller_1.createUserSessionHandler);
    // Get the user's sessions
    app.get("/api/sessions", middleware_1.requiresUser, session_controller_1.getUserSessionsHandler);
    // Logout
    app.delete("/api/sessions", middleware_1.requiresUser, session_controller_1.invalidateUserSessionHandler);
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
    app.post("/api/excel/upload", middleware_1.requiresUser, multer_1.default.array("file", 2), excel_controller_1.upload);
    app.get("/api/course", middleware_1.requiresUser, excel_controller_1.getCourseHandler);
}
exports.default = default_1;
//# sourceMappingURL=routes.js.map