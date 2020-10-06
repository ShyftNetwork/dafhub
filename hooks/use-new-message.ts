import fetch from '../libs/fetch'

async function useNewMessage(raw: string) {
  return await fetch('/agent/handleMessage', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw, save: true }),
  })
}

export default useNewMessage
