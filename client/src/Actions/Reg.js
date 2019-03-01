import * as Status from './Status'
import * as request from '../Library/Request'

export const register = () => {
  return async (dispatch, getState) => {
    const { reg: {windsid, password, approvalKey} } = getState()
    if (windsid === '' || password === '' || approvalKey === '') {
      return dispatch(setErrorMessage('入力を確認してください'))
    }
    dispatch(loading(true))
    const send = {
      userid: windsid,
      passwd: password,
      key: approvalKey
    }
    request.post('https://auth.winds-n.com/adduser', send, (err, res) => {
      if (err) {
        dispatch(setErrorMessage('登録できませんでした'))
      } else {
        if (res.body.status) {
          console.log('Register OK')
          dispatch(Status.windsidUpdate(windsid))
          dispatch(Status.tokenUpdate(res.body.token))
          dispatch(Status.loginUpdate(true))
        } else {
          console.log('Register NG')
          dispatch(Status.windsidUpdate(false))
          dispatch(Status.tokenUpdate(false))
          dispatch(Status.loginUpdate(false))
          dispatch(setErrorMessage('登録できませんでした'))
        }
      }
      dispatch(changePassword(''))
      dispatch(loading(false))
    })
  }
}

export const loading = (loading) => ({
  type: 'REG_LOADING',
  payload: {
    loading: loading
  }
})

export const updateMode = () => {
  return async (dispatch, getState) => {
    dispatch(loading(true))
    setTimeout(() => {
      console.log('update')
      dispatch(loading(false))
      dispatch(setMode(true))
    }, 200)
  }
}

const setMode = (mode) => ({
  type: 'REG_SET_MODE',
  payload: { mode }
})

export const resetMode = () => ({
  type: 'REG_SET_MODE',
  payload: { mode: false }
})

export const changeWindsid = (windsid) => ({
  type: 'REG_INPUT_WINDSID',
  payload: {
    windsid
  }
})

export const changePassword = (password) => ({
  type: 'REG_INPUT_PASSWORD',
  payload: {
    password
  }
})

export const changeKey = (approvalKey) => ({
  type: 'REG_INPUT_KEY',
  payload: {
    approvalKey
  }
})

export const setErrorMessage = (str) => ({
  type: 'REG_ERROR',
  payload: {
    errorMessage: str
  }
})