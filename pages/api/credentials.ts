import { agent } from '../../daf/setup'

const createMessage = async (message: string) => {
  return await agent.handleMessage({
    raw: message,
    metaData: [{ type: 'walletConnect' }],
  })
}

export default async (req, res) => {
  if (req.method === 'POST') {
    const msg = await createMessage(req.body.message)

    const { credentials } = msg.presentations[0]

    res.status(200).json({ data: credentials })
  }
}
