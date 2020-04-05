import fetch from '../libs/fetch'

async function useLoggedInUser(did: string) {
  return await fetch('/api/user?did=' + did)
}

export default useLoggedInUser
