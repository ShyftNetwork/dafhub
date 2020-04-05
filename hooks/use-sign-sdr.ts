import fetch from '../libs/fetch'

async function useSignSDR(threadId: string) {
  return await fetch('/api/sign-sdr', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ threadId }),
  })
}

export default useSignSDR
