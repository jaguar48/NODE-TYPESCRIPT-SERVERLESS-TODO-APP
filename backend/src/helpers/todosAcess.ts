import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

// const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export const TodosAccess = {
  async getTodos(userId: string): Promise<TodoItem[]> {
    logger.info('Getting all todos for user', { userId })
    let doc = new DocumentClient({ service: new AWS.DynamoDB() })
    AWSXRay.captureAWSClient((doc as any).service)
    const result = await doc
      .query({
        TableName: process.env.TODOS_TABLE,
        KeyConditionExpression: 'userId = :userId',
        // FilterExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()
    const items = result.Items
    return items as TodoItem[]
  },

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    let doc = new DocumentClient({ service: new AWS.DynamoDB() })
    AWSXRay.captureAWSClient((doc as any).service)
    const result = await doc
      .put({
        TableName: process.env.TODOS_TABLE,
        Item: todo
      })
      .promise()
    return result.Attributes as TodoItem
  },

  async updateTodo(
    userId: string,
    todoId: string,
    todoUpdate: TodoUpdate
  ): Promise<TodoItem> {
    let doc = new DocumentClient({ service: new AWS.DynamoDB() })
    AWSXRay.captureAWSClient((doc as any).service)
    const result = await doc
      .update({
        TableName: process.env.TODOS_TABLE,
        Key: {
          userId,
          todoId
        },
        UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeNames: {
          '#name': 'name'
        },
        ExpressionAttributeValues: {
          ':name': todoUpdate.name,
          ':dueDate': todoUpdate.dueDate,
          ':done': todoUpdate.done
        }
      })
      .promise()
    return result.Attributes as TodoItem
  },

  async deleteTodo(userId: string, todoId: string): Promise<string> {
    let doc = new DocumentClient({ service: new AWS.DynamoDB() })
    AWSXRay.captureAWSClient((doc as any).service)
    await doc
      .delete({
        TableName: process.env.TODOS_TABLE,
        Key: {
          userId,
          todoId
        }
      })
      .promise()
    return todoId as string
  }
}
