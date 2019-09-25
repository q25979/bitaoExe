const state = {
  isStart: false
}

const mutations = {
  // 更改外掛狀態
  updateStartStatus (state, status) {
    state.isStart = status
  }
}

const actions = {
  // 異步方法
  updateStartStatus (context, status) {
    context.commit('updateStartStatus', status)
  }
}

export default {
  state,
  mutations,
  actions
}
