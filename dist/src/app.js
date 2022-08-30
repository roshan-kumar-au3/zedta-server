"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const logger_1 = __importDefault(require("./logger"));
const connect_1 = __importDefault(require("./db/connect"));
const routes_1 = __importDefault(require("./routes"));
const middleware_1 = require("./middleware");
const swagger_1 = __importDefault(require("./utils/swagger"));
const cors_1 = __importDefault(require("cors"));
const port = process.env.PORT || 1337;
const host = config_1.default.get("host");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(middleware_1.deserializeUser);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.listen(port, () => {
    logger_1.default.info(`Server listing at http://${host}:${port}`);
    (0, connect_1.default)();
    (0, routes_1.default)(app);
    (0, swagger_1.default)(app, port);
});
//# sourceMappingURL=app.js.map