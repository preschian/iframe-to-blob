import { ApiPromise, WsProvider } from '@polkadot/api'
import { wss } from '~/utils/rpc'

export default defineEventHandler(async (event) => {
  const chain = getRouterParam(event, 'chain')
  const collection = getRouterParam(event, 'collection')
  const tokenId = getRouterParam(event, 'tokenId')

  if (chain !== 'ahp' && chain !== 'ahk') {
    throw new Error('Invalid chain')
  }

  if (!collection) {
    throw new Error('Invalid collection')
  }

  const api = await ApiPromise.create({
    provider: new WsProvider(wss[chain]),
  })
  const list = await api.query.nfts.item.keys(collection)
  // @ts-ignore
  const ids = list.map((key) => key.toHuman()[1].replaceAll(',', '')).sort((a, b) => a - b)
  api.disconnect()

  // get index from ids
  const index = ids.findIndex((id) => id === tokenId) + 1

  return {
    chain,
    collection,
    tokenId,
    index,
  }
})
