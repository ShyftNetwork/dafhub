import { Claim } from 'daf-core'

const getUser = async (did: string) => {
  const claim = await Claim.findOne({
    where: {
      subject: did,
      type: 'name',
    },
    order: {
      issuanceDate: 'DESC',
    },
  })
  return claim && claim.value
}

const handler = async (req, res) => {
  try {
    const name = await getUser(req.query.did)

    if (name) {
      res.status(200).json({ data: { name, profileImage: '' } })
    } else {
      res.status(200).json({ data: { name: 'Guest', profileImage: '' } })
    }
  } catch (err) {
    res.status(200).json({ data: { name: 'Guest', profileImage: '' } })
  }
}

export default handler
