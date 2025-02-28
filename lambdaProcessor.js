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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
var lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
// Initialize DynamoDB clients for two AWS regions.
var clientRegion1 = new client_dynamodb_1.DynamoDBClient({ region: "us-east-1" });
var clientRegion2 = new client_dynamodb_1.DynamoDBClient({ region: "us-west-2" });
var dynamoDBRegion1 = lib_dynamodb_1.DynamoDBDocumentClient.from(clientRegion1);
var dynamoDBRegion2 = lib_dynamodb_1.DynamoDBDocumentClient.from(clientRegion2);
var TABLE_NAME = "GlobalTelecomSubscriptions";
/**
 * Utility function to introduce a delay.
 * @param ms - Number of milliseconds to wait.
 * @returns A promise that resolves after the specified delay.
 */
var delay = function (ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
/**
 * Step 1: Insert an event (Event A) into DynamoDB.
 */
function produceEventA() {
    return __awaiter(this, void 0, void 0, function () {
        var event, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event = {
                        eventId: "1234",
                        eventType: "A",
                        state: "PENDING",
                        version: 1,
                        timestamp: Date.now(),
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, dynamoDBRegion1.send(new lib_dynamodb_1.PutCommand({ TableName: TABLE_NAME, Item: event }))];
                case 2:
                    _a.sent();
                    console.log("Produced Event A:", event);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error inserting Event A:", error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Step 2: Simulates a Lambda function in Region 1 that processes Event A.
 * Reads the event and updates it to Event B.
 */
function lambdaRegion1() {
    return __awaiter(this, void 0, void 0, function () {
        var event_1, updatedEvent, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, delay(5000)];
                case 1:
                    _a.sent(); // Simulate a delay before processing.
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, dynamoDBRegion1.send(new lib_dynamodb_1.GetCommand({ TableName: TABLE_NAME, Key: { eventId: "1234" } }))];
                case 3:
                    event_1 = (_a.sent()).Item;
                    if (!event_1) {
                        console.log("No event found in Region 1.");
                        return [2 /*return*/];
                    }
                    console.log("Region 1 processing event:", event_1);
                    updatedEvent = {
                        eventId: event_1.eventId,
                        eventType: "B",
                        state: "COMPLETED",
                        version: event_1.version + 1,
                        timestamp: Date.now(),
                    };
                    return [4 /*yield*/, dynamoDBRegion1.send(new lib_dynamodb_1.PutCommand({
                            TableName: TABLE_NAME,
                            Item: updatedEvent,
                            ConditionExpression: "version = :currentVersion",
                            ExpressionAttributeValues: { ":currentVersion": event_1.version },
                        }))];
                case 4:
                    _a.sent();
                    console.log("Region 1 updated Event A → Event B.");
                    return [3 /*break*/, 6];
                case 5:
                    error_2 = _a.sent();
                    console.error("Conflict in Region 1:", error_2.message);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 * Step 3: Simulates a Lambda function in Region 2 that processes the event.
 * Reads the possibly stale data from Region 2 and updates it.
 */
function lambdaRegion2() {
    return __awaiter(this, void 0, void 0, function () {
        var event_2, updatedEvent, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, delay(5000)];
                case 1:
                    _a.sent(); // Simulate replication delay.
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, dynamoDBRegion2.send(new lib_dynamodb_1.GetCommand({ TableName: TABLE_NAME, Key: { eventId: "1234" } }))];
                case 3:
                    event_2 = (_a.sent()).Item;
                    if (!event_2) {
                        console.log("No event found in Region 2.");
                        return [2 /*return*/];
                    }
                    console.log("Region 2 processing event:", event_2);
                    updatedEvent = {
                        eventId: event_2.eventId,
                        eventType: "B",
                        state: "COMPLETED",
                        version: event_2.version + 1,
                        timestamp: Date.now(),
                    };
                    return [4 /*yield*/, dynamoDBRegion2.send(new lib_dynamodb_1.PutCommand({
                            TableName: TABLE_NAME,
                            Item: updatedEvent,
                            ConditionExpression: "version = :currentVersion",
                            ExpressionAttributeValues: { ":currentVersion": event_2.version },
                        }))];
                case 4:
                    _a.sent();
                    console.log("Region 2 updated Event A → Event B.");
                    return [3 /*break*/, 6];
                case 5:
                    error_3 = _a.sent();
                    console.error("Conflict in Region 2:", error_3.message);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 * Step 4: Simulate the entire event lifecycle.
 * - Inserts Event A.
 * - Triggers processing in both regions.
 */
(function simulate() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, produceEventA()];
                case 1:
                    _a.sent(); // Insert Event A.
                    return [4 /*yield*/, Promise.all([lambdaRegion1(), lambdaRegion2()])];
                case 2:
                    _a.sent(); // Process in both regions.
                    return [2 /*return*/];
            }
        });
    });
})();
