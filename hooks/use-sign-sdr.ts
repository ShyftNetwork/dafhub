import fetch from '../libs/fetch'

async function useSignSDR(threadId: string) {
  const signingIdentities = await fetch('/agent/identityManagerGetIdentities', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  return await fetch('/agent/createSelectiveDisclosureRequest', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        issuer: signingIdentities[0].did,
        tag: threadId,
        replyUrl: '',
        claims: [
          {
            reason: 'We will show this on your profile',
            essential: true,
            claimType: 'name',
          },
          {
            reason: 'You must have the right access',
            essential: true,
            claimType: 'kyc',
            issuers: [{ did: signingIdentities[0].did, url: '' }],
          },
        ],
      },
    }),
  })
}

export default useSignSDR
