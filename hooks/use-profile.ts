import fetch from '../libs/fetch'

async function useProfile(did: string) {
  const claims = await fetch(
    '/agent/dataStoreORMGetVerifiableCredentialsByClaims',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        where: [
          {
            column: 'subject',
            value: [did],
          },
          {
            column: 'type',
            value: ['name'],
          },
        ],
        order: [
          {
            column: 'issuanceDate',
            direction: 'DESC',
          },
        ],
      }),
    },
  )

  return (
    claims &&
    claims[0] && { name: claims[0].verifiableCredential.credentialSubject.name }
  )
}

export default useProfile
