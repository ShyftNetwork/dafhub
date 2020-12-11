import fetch from '../libs/fetch'

async function useSignVC(subject: string, sdrCreds) {
  const obj = {
    id: subject,
    AgencyName: 'Passport office Toronto',
    ...sdrCreds
  };
  return await fetch('/api/sign-vc', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj),
  })
}

export default useSignVC
