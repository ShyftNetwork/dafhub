import { agent } from '../../daf/setup'
import { ActionSignSdr, ActionTypes } from 'daf-selective-disclosure'

const signSdr = async (iss, threadId) => {
  return await agent.handleAction({
    type: ActionTypes.signSdr,
    data: {
      issuer: iss,
      tag: threadId,
      claims: [
        {
          reason: 'We will show this on your profile',
          essential: true,
          claimType: 'name',
        },
      ],
    },
  } as ActionSignSdr)
}

export default async (req, res) => {
  if (req.method === 'POST') {
    const data = await agent.identityManager.getIdentities()
    const sdr = await signSdr(data[0].did, req.body.threadId)

    if (sdr) {
      res.status(200).json({ data: sdr })
    }
  }
}
