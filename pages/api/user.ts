import { core, dataStore } from '../../daf/setup'
import { Claim } from 'daf-core'

const getUser = async (did: string) => {
  const claims = await Claim.find({
    where: {
      subject: did,
      type: 'name',
    },
  })

  return claims && claims[0] && claims.reverse()[0].value
}

const handler = async (req, res) => {
  const name = await getUser(req.query.did)
  res.status(200).json({ data: { name: name ? name : '', profileImage: '' } })
}

export default handler
