import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../helpers/todos'
import { createLogger } from '../../utils/logger'
import { cors } from 'middy/middlewares'

const logger = createLogger('createTodo')

 
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Create ToDo event:  ', {...event})

    const newTodo: CreateTodoRequest = JSON.parse(event.body)

    let getUser =  getUserId(event);
    const item = await createTodo(newTodo, getUser)
    return item.todoId
    ? { 
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          item
        })
      }
    : {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          item
        })
      }
}
)

handler.use(
cors({
  credentials: true
})
)

