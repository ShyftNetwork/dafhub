import { agent } from '../../daf/setup'

const acceptMessage = async (message: string) => {
  const msg = await agent.handleMessage({
    raw: message,
    metaData: [{ type: 'apiMessage' }],
  })

  return msg.id
}

const handler = async (req, res) => {
  if (req.method === 'POST' && req.body) {
    try {
      const id = await acceptMessage(req.body)
      if (id) res.status(200).json({ data: id })
    } catch (err) {
      res.status(400).json({ error: err.context })
    }
  } else {
    res.status(400).json({ error: 'No message included' })
  }
}

export default handler
