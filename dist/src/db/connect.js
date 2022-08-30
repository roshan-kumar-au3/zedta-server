"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// import config from "config";
const logger_1 = __importDefault(require("../logger"));
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        const dbUri = "mongodb+srv://root:vD7leskFWpJLYMp8@offline-firebase.h0knj.mongodb.net/zedta-nft?retryWrites=true&w=majority";
        try {
            yield mongoose_1.default
                .connect(dbUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
            });
            logger_1.default.info("Database connected");
        }
        catch (error) {
            logger_1.default.error("db error", error);
            process.exit(1);
        }
    });
}
exports.default = connect;
//# sourceMappingURL=connect.js.map