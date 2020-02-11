import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {
    const data = JSON.parse(event.body);

    if (data.isPublic) {
        const params = {
            TableName: process.env.groupsTableName,
            FilterExpression: "isPublic = :isPublic",
            ExpressionAttributeValues: {
                ":isPublic": data.isPublic
            }
        };
        try {
            const result = await dynamoDbLib.call("scan", params);
            // Return the matching list of items in response body
            return success(result.Items);
        } catch (e) {
            console.log(e);
            return failure({ status: false });
        }
    } else {
        const params = {
            TableName: process.env.groupsTableName,
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
              ":userId": event.requestContext.identity.cognitoIdentityId
            }
        };
        try {
            const result = await dynamoDbLib.call("query", params);
            // Return the matching list of items in response body
            return success(result.Items);
        } catch (e) {
            console.log(e);
            return failure({ status: false });
        }
    }
}