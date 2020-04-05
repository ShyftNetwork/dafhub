import { core } from '../../daf/setup'
import * as w3C from 'daf-w3c'

const signVC = async (iss, sub): Promise<string> => {
  return await core.handleAction({
    type: 'action.sign.w3c.vc',
    did: iss,
    data: {
      sub: sub,
      vc: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential'],
        credentialSubject: {
          name: 'DafHub User',
        },
      },
    },
  } as w3C.ActionSignW3cVc)
}

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const data = await core.identityManager.getIdentities()
    const credential = await signVC(data[0].did, req.body.subject)

    res.status(200).json({ data: credential })
  }
}

export default handler
