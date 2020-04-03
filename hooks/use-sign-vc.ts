import fetch from '../libs/fetch'

async function useSignVC(subject: string) {
  return await fetch('/api/sign-vc', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subject }),
  })
}

export default useSignVC
