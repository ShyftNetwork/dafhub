import { agent } from '../../daf/setup'

const acceptMessage = async (raw: string, type: string) => {
  const msg = await agent.handleMessage({
    raw: raw,
    metaData: [{ type }],
  })

  return msg.id
}

const handler = async (req, res) => {
  if (req.method === 'POST' && req.body) {
    const { body, type } = JSON.parse(req.body)
    try {
      const id = await acceptMessage(body, type)
      if (id) res.status(200).json({ data: id })
    } catch (err) {
      res.status(400).json({ error: err.context })
    }
  } else {
    res.status(400).json({ error: 'No message included' })
  }
}

export default handler
