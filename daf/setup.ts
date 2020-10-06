import {
  Agent,
  createAgent,
  IIdentityManager,
  IResolver,
  IKeyManager,
  IDataStore,
  IMessageHandler,
} from 'daf-core'
import { MessageHandler } from 'daf-message-handler'
import { KeyManager } from 'daf-key-manager'
import { IdentityManager } from 'daf-identity-manager'
import { DafResolver } from 'daf-resolver'
import { JwtMessageHandler } from 'daf-did-jwt'
import { CredentialIssuer, ICredentialIssuer, W3cMessageHandler } from 'daf-w3c'
import { EthrIdentityProvider } from 'daf-ethr-did'
import { WebIdentityProvider } from 'daf-web-did'
import { DIDComm, DIDCommMessageHandler, IDIDComm } from 'daf-did-comm'
import {
  SelectiveDisclosure,
  ISelectiveDisclosure,
  SdrMessageHandler,
} from 'daf-selective-disclosure'
import { KeyManagementSystem, SecretBox } from 'daf-libsodium'
import {
  Entities,
  KeyStore,
  IdentityStore,
  IDataStoreORM,
  DataStore,
  DataStoreORM,
} from 'daf-typeorm'
import { createConnection, getConnection, Connection } from 'typeorm'

const DATABASE_URL = process.env.DATABASE_URL || null
const commonConfig = {
  synchronize: true,
  logging: false,
  entities: Entities,
}
const serverConfig = {
  type: 'postgres',
  url: DATABASE_URL,
  ...commonConfig,
}
const localConfig = {
  type: 'sqlite',
  database: './database.sqlite',
  ...commonConfig,
}
const config = DATABASE_URL ? serverConfig : localConfig

const getOrCreateDbConnection = async (): Promise<Connection> => {
  try {
    return getConnection()
  } catch (e) {
    // @ts-ignore -> It's looking for a driver for expo?
    return createConnection(config)
  }
}

const dbConnection = getOrCreateDbConnection()
const infuraProjectId = '5ffc47f65c4042ce847ef66a3fa70d4c'
const secretKey =
  '29739248cad1bd1a0fc4d9b75cd4d2990de535baf5caadfdf8d8f86664aa830c'

const plugins = [
  new KeyManager({
    store: new KeyStore(dbConnection, new SecretBox(secretKey)),
    kms: {
      local: new KeyManagementSystem(),
    },
  }),
  new IdentityManager({
    store: new IdentityStore(dbConnection),
    defaultProvider: 'did:ethr:rinkeby',
    providers: {
      'did:ethr:rinkeby': new EthrIdentityProvider({
        defaultKms: 'local',
        network: 'rinkeby',
        rpcUrl: 'https://rinkeby.infura.io/v3/' + infuraProjectId,
      }),
      'did:web': new WebIdentityProvider({
        defaultKms: 'local',
      }),
    },
  }),
  new DafResolver({ infuraProjectId }),
  new DataStore(dbConnection),
  new DataStoreORM(dbConnection),
  new MessageHandler({
    messageHandlers: [
      new DIDCommMessageHandler(),
      new JwtMessageHandler(),
      new W3cMessageHandler(),
      new SdrMessageHandler(),
    ],
  }),
  new DIDComm(),
  new CredentialIssuer(),
  new SelectiveDisclosure(),
]

export const serverAgent = new Agent({
  context: {
    // authenticatedDid: 'did:example:3456'
  },
  plugins,
})

export const agent = createAgent<
  IIdentityManager &
    IKeyManager &
    IDataStore &
    IDataStoreORM &
    IResolver &
    IMessageHandler &
    IDIDComm &
    ICredentialIssuer &
    ISelectiveDisclosure
>({
  plugins,
})
