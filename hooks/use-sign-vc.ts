import fetch from '../libs/fetch'

async function useSignVC(subject: string) {
  const signingIdentities = await fetch('/agent/identityManagerGetIdentities', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  return await fetch('/agent/createVerifiableCredential', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      credential: {
        issuer: { id: signingIdentities[0].did },
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential'],
        issuanceDate: new Date().toISOString(),
        credentialSubject: {
          id: subject,
          kyc: 'Valid',
        },
      },
      proofFormat: 'jwt',
      save: true,
    }),
  })
}

export default useSignVC
