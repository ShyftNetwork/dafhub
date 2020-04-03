import { mutate } from 'swr'
import fetch from '../libs/fetch'

async function useSignSDR(tag: string) {
  return mutate(
    '/api/sign-sdr',
    await fetch('/api/sign-sdr', {
      method: 'POST',
      body: JSON.stringify({ tag }),
    }),
  )
}

export default useSignSDR
