import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodosForUser as getTodosForUser } from '../../helpers/todos'
import { getUserId } from '../utils'
import { TodoItem } from '../../models/TodoItem'

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    try {
      const todos = (await getTodosForUser(getUserId(event))) as TodoItem[]
      return todos
        ? {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
              items: todos
            })
          }
        : {
            statusCode: 404,
            body: JSON.stringify({
              error: 'Todo does not exist '
            }) 
          }
    } catch (e: any) {
      return {
        statusCode: 502,
        body: JSON.stringify({
          error: 'A fatal unexpected error occured: ' + e.message
        })
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
