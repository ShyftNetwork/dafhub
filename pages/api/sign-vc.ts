import { agent } from '../../daf/setup'
import { ActionSignW3cVc, ActionTypes } from 'daf-w3c'

const signVC = async (iss, body): Promise<string> => {
  const vc = await agent.handleAction({
    type: ActionTypes.signCredentialJwt,
    data: {
      issuer: iss,
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential'],
      credentialSubject: body,
    },
  } as ActionSignW3cVc)
  console.log('vc._raw', vc, vc._raw)
  return vc._raw
}

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const data = await agent.identityManager.getIdentities()
    const credential = await signVC(data[0].did, req.body)

    res.status(200).json({ data: credential })
  }
}

export default handler
