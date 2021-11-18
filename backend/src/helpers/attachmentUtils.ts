import * as AWS from 'aws-sdk'
// import { XavcSlowPal } from 'aws-sdk/clients/mediaconvert'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic

export const AttachmentUtils = {
  signUrl: async (id: string) => {
    const s3 = new XAWS.S3({
      signatureVersion: 'v4'
    })

    const url = s3.getSignedUrl('putObject', {
      Bucket: process.env.ATTACHMENT_S3_BUCKET,
      Key: id,
      Expires: parseInt(process.env.SIGNED_URL_EXPIRATION)
    })

    return url
  },
  deleteAttachment: async (id: string) => {
    const s3 = new XAWS.S3({
      signatureVersion: 'v4'
    })

    await s3
      .deleteObject({
        Bucket: process.env.ATTACHMENT_S3_BUCKET,
        Key: id
      })
      .promise()

    return true
  }
}
