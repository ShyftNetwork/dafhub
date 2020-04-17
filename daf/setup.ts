import * as Daf from 'daf-core'
import * as DidJwt from 'daf-did-jwt'
import * as W3c from 'daf-w3c'
import * as SD from 'daf-selective-disclosure'
import * as TG from 'daf-trust-graph'
import * as URL from 'daf-url'
import * as DafEthrDid from 'daf-ethr-did'
import { KeyManagementSystem } from 'daf-libsodium'
import { DafResolver } from 'daf-resolver'
import * as DIDComm from 'daf-did-comm'
import { createConnection, Connection, getConnection } from 'typeorm'

const DATABASE_URL = process.env.DATABASE_URL || null
const commonConfig = {
  synchronize: true,
  logging: false,
  entities: [...Daf.Entities],
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
let didResolver = new DafResolver({ infuraProjectId })
const rinkebyIdentityProvider = new DafEthrDid.IdentityProvider({
  kms: new KeyManagementSystem(new Daf.KeyStore(dbConnection)),
  identityStore: new Daf.IdentityStore('rinkeby-ethr', dbConnection),
  network: 'rinkeby',
  rpcUrl: 'https://rinkeby.infura.io/v3/' + infuraProjectId,
})
const messageHandler = new URL.UrlMessageHandler()
messageHandler
  .setNext(new URL.UrlMessageHandler())
  .setNext(new DidJwt.JwtMessageHandler())
  .setNext(new W3c.W3cMessageHandler())
  .setNext(new SD.SdrMessageHandler())

const actionHandler = new DIDComm.DIDCommActionHandler()
actionHandler
  .setNext(new W3c.W3cActionHandler())
  .setNext(new SD.SdrActionHandler())

export const agent = new Daf.Agent({
  dbConnection,
  didResolver,
  identityProviders: [rinkebyIdentityProvider],
  actionHandler,
  messageHandler,
})
