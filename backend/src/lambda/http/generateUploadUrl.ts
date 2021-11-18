import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'

import { createAttachmentPresignedUrl } from '../../helpers/todos'
// import { getUserId } from '../utils'
const logger = createLogger('deleteTodos')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Generating upload url event',{...event})
    const todoId = event.pathParameters.todoId
    // let getUser =  getUserId('getUserId');

    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    let url; 
 
    try {
      url = await createAttachmentPresignedUrl(todoId)
    } catch(e) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: e.message,
          uploadUrl: url
        })
      }
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
