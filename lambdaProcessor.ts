import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";

/**
 * Interface representing an event in the telecom system.
 */
interface TelecomEvent {
  eventId: string; // Unique event identifier
  eventType: string; // Type of the event (e.g., "A" or "B")
  state: string; // Event state (e.g., "PENDING", "COMPLETED")
  version: number; // Used for optimistic locking (ensures consistency)
  timestamp: number; // Event timestamp
}

// Initialize DynamoDB clients for two AWS regions.
const clientRegion1 = new DynamoDBClient({ region: "us-east-1" });
const clientRegion2 = new DynamoDBClient({ region: "us-west-2" });

const dynamoDBRegion1 = DynamoDBDocumentClient.from(clientRegion1);
const dynamoDBRegion2 = DynamoDBDocumentClient.from(clientRegion2);

const TABLE_NAME = "GlobalTelecomSubscriptions";

/**
 * Utility function to introduce a delay.
 * @param ms - Number of milliseconds to wait.
 * @returns A promise that resolves after the specified delay.
 */
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Step 1: Insert an event (Event A) into DynamoDB.
 */
async function produceEventA(): Promise<void> {
  const event: TelecomEvent = {
    eventId: "1234",
    eventType: "A",
    state: "PENDING",
    version: 1,
    timestamp: Date.now(),
  };

  try {
    await dynamoDBRegion1.send(
      new PutCommand({ TableName: TABLE_NAME, Item: event })
    );
    console.log("Produced Event A:", event);
  } catch (error) {
    console.error("Error inserting Event A:", error);
  }
}

/**
 * Step 2: Simulates a Lambda function in Region 1 that processes Event A.
 * Reads the event and updates it to Event B.
 */
async function lambdaRegion1(): Promise<void> {
  await delay(5000); // Simulate a delay before processing.

  try {
    // Fetch event from Region 1
    const { Item: event } = await dynamoDBRegion1.send(
      new GetCommand({ TableName: TABLE_NAME, Key: { eventId: "1234" } })
    );

    if (!event) {
      console.log("No event found in Region 1.");
      return;
    }

    console.log("Region 1 processing event:", event);

    const updatedEvent: TelecomEvent = {
      eventId: event.eventId,
      eventType: "B",
      state: "COMPLETED",
      version: event.version + 1,
      timestamp: Date.now(),
    };

    await dynamoDBRegion1.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: updatedEvent,
        ConditionExpression: "version = :currentVersion",
        ExpressionAttributeValues: { ":currentVersion": event.version },
      })
    );

    console.log("Region 1 updated Event A → Event B.");
  } catch (error: any) {
    console.error("Conflict in Region 1:", error.message);
  }
}

/**
 * Step 3: Simulates a Lambda function in Region 2 that processes the event.
 * Reads the possibly stale data from Region 2 and updates it.
 */
async function lambdaRegion2(): Promise<void> {
  await delay(5000); // Simulate replication delay.

  try {
    // Fetch event from Region 2
    const { Item: event } = await dynamoDBRegion2.send(
      new GetCommand({ TableName: TABLE_NAME, Key: { eventId: "1234" } })
    );

    if (!event) {
      console.log("No event found in Region 2.");
      return;
    }

    console.log("Region 2 processing event:", event);

    const updatedEvent: TelecomEvent = {
      eventId: event.eventId,
      eventType: "B",
      state: "COMPLETED",
      version: event.version + 1,
      timestamp: Date.now(),
    };

    await dynamoDBRegion2.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: updatedEvent,
        ConditionExpression: "version = :currentVersion",
        ExpressionAttributeValues: { ":currentVersion": event.version },
      })
    );

    console.log("Region 2 updated Event A → Event B.");
  } catch (error: any) {
    console.error("Conflict in Region 2:", error.message);
  }
}

/**
 * Step 4: Simulate the entire event lifecycle.
 * - Inserts Event A.
 * - Triggers processing in both regions.
 */
(async function simulate() {
  await produceEventA(); // Insert Event A.
  await Promise.all([lambdaRegion1(), lambdaRegion2()]); // Process in both regions.
})();
