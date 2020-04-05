import fetch from '../libs/fetch'

async function useCredentials(message: string) {
  return await fetch('/api/credentials', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  })
}

export default useCredentials
