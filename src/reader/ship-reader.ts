import {
  createEosioShipReader,
  EosioReaderConfig,
} from '@blockmatic/eosio-ship-reader'
import { config } from '../config'
import { getInfo } from '../lib/eosio'
import { MappingsReader } from '../mappings'
import { createShipReaderDataHelper } from './reader-helper'

export const loadReader = async (mappingsReader: MappingsReader) => {
  // First we need to get the ABis for all whitelisted contracts
  const readerHelper = await createShipReaderDataHelper(mappingsReader)

  const readerConfig = config.reader
  const start_block_num =
    readerConfig.start_block || (await getInfo()).head_block_num

  const eosioReaderConfig: EosioReaderConfig = {
    ws_url: readerConfig.ws_url,
    rpc_url: readerConfig.rpc_url,
    ds_threads: readerConfig.ds_threads,
    ds_experimental: readerConfig.ds_experimental,
    ...readerHelper,
    request: {
      start_block_num,
      end_block_num: 0xffffffff,
      max_messages_in_flight: 50,
      have_positions: [],
      irreversible_only: false,
      fetch_block: true,
      fetch_traces: true,
      fetch_deltas: true,
      fetch_block_header: true,
    },
    auto_start: true,
  }

  return await createEosioShipReader(eosioReaderConfig)
}
