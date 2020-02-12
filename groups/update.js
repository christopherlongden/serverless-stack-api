import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.groupsTableName,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      groupId: event.pathParameters.id
    },
    UpdateExpression: "SET groupName = :groupName, attachment = :attachment",
    ExpressionAttributeValues: {
      ":attachment": data.attachment || null,
      ":groupName": data.groupName || null
    },
    ReturnValues: "ALL_NEW"
  };

  try {
    await dynamoDbLib.call("update", params);
    return success({ status: true });
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}