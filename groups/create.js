import uuid from "uuid";
import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.groupsTableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      groupId: uuid.v1(),
      groupName: data.groupName,
      description: data.description,
      isPublic: data.isPublic,
      createdAt: Date.now()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}