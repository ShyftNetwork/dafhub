import { mutate } from 'swr'
import fetch from '../libs/fetch'

async function useNewMessage(message: string) {
  return mutate(
    '/api/message',
    await fetch('/api/message', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
  )
}

export default useNewMessage
