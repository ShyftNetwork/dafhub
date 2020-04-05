import { core } from '../../daf/setup'
import * as SD from 'daf-selective-disclosure'

const signSdr = async (iss, threadId) => {
  return await core.handleAction({
    type: SD.ActionTypes.signSdr,
    did: iss,
    data: {
      tag: threadId,
      claims: [
        {
          reason: 'We will show this on your profile',
          essential: true,
          claimType: 'name',
        },
      ],
    },
  } as SD.ActionSignSdr)
}

export default async (req, res) => {
  if (req.method === 'POST') {
    const data = await core.identityManager.getIdentities()
    const sdr = await signSdr(data[0].did, req.body.threadId)

    if (sdr) {
      res.status(200).json({ data: sdr })
    }
  }
}
