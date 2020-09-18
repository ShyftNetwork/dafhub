import { agent } from '../../daf/setup'
import { ActionSignSdr, ActionTypes } from 'daf-selective-disclosure'

const dev = process.env.NODE_ENV !== 'production'
const protocol = dev ? 'http://' : 'https://'

const signSdr = async (iss, threadId, host) => {
  return await agent.handleAction({
    type: ActionTypes.signSdr,
    data: {
      issuer: iss,
      tag: threadId,
      replyTo: ['Dafhub'],
      replyUrl: protocol + host + '/api/message',
      claims: [
        {
          reason: 'We will show this on your profile',
          essential: true,
          claimType: 'documentType',
        },
        // {
        //   reason: 'You must have the correct access',
        //   essential: true,
        //   claimType: 'First Name',
        //   issuers: [{ did: iss, url: '' }],
        // },
      ],
    },
  } as ActionSignSdr)
}

export default async (req, res) => {
  if (req.method === 'POST') {
    const data = await agent.identityManager.getIdentities()
    const sdr = await signSdr(data[0].did, req.body.threadId, req.headers.host)

    if (sdr) {
      res.status(200).json({ data: sdr })
    }
  }
}
