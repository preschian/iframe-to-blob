import { ApiPromise, WsProvider } from '@polkadot/api'

const wss = {
  ahp: 'wss://polkadot-asset-hub-rpc.polkadot.io',
  ahk: 'wss://kusama-asset-hub-rpc.polkadot.io',
}

export default defineEventHandler(async (event) => {
  const chain = getRouterParam(event, 'chain')
  const collection = getRouterParam(event, 'collection')

  if (chain !== 'ahp' && chain !== 'ahk') {
    throw new Error('Invalid chain')
  }

  if (!collection) {
    throw new Error('Invalid collection')
  }

  const api = await ApiPromise.create({
    provider: new WsProvider(wss[chain]),
  })
  const query = await api.query.nfts.collectionMetadataOf(collection)
  const { data } = query.toHuman() as { data: string }
  api.disconnect()

  const cid = data.replace('ipfs://', '')
  const ipfs = `https://image.w.kodadot.xyz/ipfs/${cid}`
  const metadata = await fetch(ipfs)
  const json = await metadata.json()

  return json
})
