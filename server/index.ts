import express from 'express'
import next from 'next'
import { serverAgent } from '../daf/setup'
import { AgentRouter } from 'daf-express'

const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const agentRouter = AgentRouter({
  getAgentForRequest: async req => serverAgent,
  exposedMethods: [
    'resolveDid',
    'identityManagerGetProviders',
    'identityManagerGetIdentities',
    'identityManagerGetIdentity',
    'identityManagerCreateIdentity',
    'handleMessage',
    'dataStoreORMGetMessages',
    'dataStoreSaveMessage',
    'createVerifiableCredential',
    'createVerifiablePresentation',
    'createSelectiveDisclosureRequest',
    'getVerifiableCredentialsForSdr',
    'dataStoreORMGetVerifiableCredentials',
    'dataStoreORMGetVerifiableCredentialsByClaims',
  ],
})

app.prepare().then(() => {
  const server = express()

  server.use('/agent', agentRouter)

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})
