import { Claim } from 'daf-core'

const getUser = async (did: string, params: string) => {
  const claim = await Claim.findOne({
    where: {
      subject: did,
      type: params,
    },
    order: {
      issuanceDate: 'DESC',
    },
  })
  return claim && claim.value
}

const handler = async (req, res) => {
  try {
    const documentType = await getUser(req.query.did, 'documentType')

    // if (name && address && country) {
       res.status(200).json({ data: { documentType, profileImage: '' } })
    // } else {
    //  res.status(200).json({ data: { name: 'Guest', address: 'NA', country: 'NA', profileImage: '' } })
    // }
  } catch (err) {
    res.status(200).json({ data: { name: 'Guest', profileImage: '' } })
  }
}

export default handler
