const apiId = 'rwslcofva1'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-uenatzey.us.auth0.com', // Auth0 domain
  clientId: 'PbdhivaJNLxM5nPo6LQdQDENX0ji86td', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}