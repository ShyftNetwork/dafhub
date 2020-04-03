import { mutate } from 'swr'
import fetch from '../libs/fetch'

async function useCredentials(messageId: string) {
  return mutate(
    '/api/credentials',
    await fetch('/api/credentials', {
      method: 'POST',
      body: JSON.stringify({ messageId }),
    }),
  )
}

export default useCredentials
