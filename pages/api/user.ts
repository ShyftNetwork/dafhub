import { Claim } from 'daf-core'
import Moment from 'moment'

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
    let documentType, firstName, lastName, middleName, dateOfBirth, expiryDate, nationality, birthPlace, documentNumber = '';
    documentType = await getUser(req.query.did, 'documentType')
    firstName = await getUser(req.query.did, 'firstName')
    lastName = await getUser(req.query.did, 'lastName')
    middleName = await getUser(req.query.did, 'middleName')
    dateOfBirth = await getUser(req.query.did, 'dateOfBirth')
    expiryDate = await getUser(req.query.did, 'expiryDate')
    nationality = await getUser(req.query.did, 'nationality')
    birthPlace = await getUser(req.query.did, 'birthPlace')
    documentNumber = await getUser(req.query.did, 'documentNumber')

    dateOfBirth = Moment(dateOfBirth).format('MMM DD YYYY')
    expiryDate = Moment(expiryDate).format('MMM DD YYYY')

    // if (name && address && country) {
       res.status(200).json({ data: { documentType, firstName, middleName, lastName, dateOfBirth, expiryDate, nationality, birthPlace, documentNumber, profileImage: '' } })
    // } else {
    //  res.status(200).json({ data: { name: 'Guest', address: 'NA', country: 'NA', profileImage: '' } })
    // }
  } catch (err) {
    res.status(200).json({ data: { name: 'Guest', profileImage: '' } })
  }
}

export default handler
