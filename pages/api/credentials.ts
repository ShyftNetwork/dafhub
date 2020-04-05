import { core, dataStore } from '../../daf/setup'
import { Message } from 'daf-core'

const createMessage = async (message: string) => {
  const msg = await core.validateMessage(
    new Message({
      raw: message,
      meta: {
        type: 'walletConnect',
      },
    }),
  )
  await dataStore.saveMessage(msg)
  return msg
}

export default async (req, res) => {
  if (req.method === 'POST') {
    const msg = await createMessage(req.body.message)

    const { credentials } = msg.presentations[0]

    res.status(200).json({ data: credentials })
  }
}
