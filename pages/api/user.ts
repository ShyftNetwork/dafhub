import { core, dataStore } from '../../daf/setup'

const getUser = async (did: string) => {
  return await dataStore.popularClaimForDid(did, 'name')
}

const handler = async (req, res) => {
  const name = await getUser(req.query.did)
  res.status(200).json({ data: { name, profileImage: '' } })
}

export default handler
