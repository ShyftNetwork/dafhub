import { Box, Loader } from 'rimble-ui'
import { useContext, useEffect } from 'react'
import PageHead from '../components/PageHead'
import { agent } from '../daf/setup'

const Welcome = () => {
  return (
    <main>
      <PageHead title="Dafhub" description="Demo of daf + walletconnect" />
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        height={'100%'}
      >
        <Loader size="40px" />
      </Box>
    </main>
  )
}

export async function getServerSideProps(context) {
  const data = await agent.identityManagerGetIdentities()

  //** Move this monkey check to the server set up after converting to TS so it will check before running the app */
  if (data.length === 0) {
    console.log('Creating issuer identity')
    await agent.identityManagerCreateIdentity({ provider: 'did:ethr:rinkeby' })
  } else {
    console.log('Issuer identity already exists', data[0].did)
  }

  return {
    props: { issuer: 'OK' }, // will be passed to the page component as props
  }
}

export default Welcome
