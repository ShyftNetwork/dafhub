import { useContext, useState } from 'react'
import { WalletConnectContext } from '../components/WalletConnectContext'
import {
  Box,
  Button,
  Heading,
  Text,
  Icon,
  Blockie,
  Modal,
  Card,
  Flex,
  Loader,
  Link,
} from 'rimble-ui'

const Header = ({ loggedIn }) => {
  const { killSession } = useContext(WalletConnectContext)
  return (
    <Box
      bg={'#2F2F2F'}
      pl={3}
      pr={4}
      height={65}
      display={'flex'}
      flexDirection={'row'}
      alignItems={'center'}
      justifyContent={'space-between'}
    >
      <Box flexDirection={'row'} display={'flex'} alignItems={'center'}>
        <Box
          bg={'#FFFFFF'}
          height={45}
          width={45}
          borderRadius={23}
          mr={2}
        ></Box>
        <Heading as={'h3'} color={'#FFFFFF'} mr={3}>
          Dafhub
        </Heading>
        {loggedIn && (
          <Box>
            <Button.Text style={{ outline: 'none' }} mainColor={'#FFFFFF'}>
              Dashboard
            </Button.Text>
            <Button.Text style={{ outline: 'none' }} mainColor={'#FFFFFF'}>
              Credentials
            </Button.Text>
          </Box>
        )}
      </Box>
      {loggedIn && (
        <Box flexDirection={'row'} display={'flex'} alignItems={'center'}>
          <Box
            mr={3}
            flexDirection={'row'}
            display={'flex'}
            alignItems={'center'}
          >
            <Blockie
              borderRadius={5}
              opts={{
                seed: 'foosss',
                color: '#dfe',
                bgcolor: '#a71',
                size: 7,
                scale: 5,
                spotcolor: '#000',
              }}
            />

            <Icon name={'ArrowDropDown'} color={'#FFFFFF'} />
          </Box>
          <Button.Text mainColor={'#FFFFFF'} onClick={killSession}>
            Log out
          </Button.Text>
        </Box>
      )}
    </Box>
  )
}

export default Header
