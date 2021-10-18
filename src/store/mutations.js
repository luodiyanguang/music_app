import * as type from './mutation-type'

const mutation = {
  [type.SET_SIGNER](state, signer) {
    state.signer = signer
  },
}

export default mutation