import { STORE_INJECT } from 'STORE/registry/middleware'

export function injectReducers(reducers) {
  return { [STORE_INJECT]: { reducers } }
}
