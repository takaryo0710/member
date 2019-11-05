import { replace } from 'react-router-redux'
import * as request from '../Library/Request'
import * as lib from '../Library/Library'
import { showToast } from './Toast'

const prefix = 'MANAGER_'

export const getManager = () => {
  return async (dispatch, getState) => {
    if (!window.localStorage.token) return false
    if (getState().manager.acquired) return false
    dispatch(loading(true))
    const path = lib.getApiPath() + '/manager/'
    request.post(path, {}, (err, res) => {
      if (err) {
        return false
      } else {
        dispatch(update(res.body))
        dispatch(acquired(true))
      }
      dispatch(loading(false))
    })
  }
}

export const update = (data) => ({
  type: prefix + 'UPDATE',
  payload: { data }
})

export const acquired = (acquired) => ({
  type: prefix + 'ACQUIRED',
  payload: { acquired }
})

export const loading = (loading) => ({
  type: prefix + 'LOADING',
  payload: { loading }
})

// Selection Components
export const getSelectionPhase = () => {
  return async (dispatch, getState) => {
    if (!window.localStorage.token) return false
    dispatch(loadingSelectionPhase(true))
    const path = lib.getSurveyPath() + '/api/selection/phase'
    const send = {
      session: lib.getSession()
    }
    request.post(path, send, (err, res) => {
      if (err) {
        dispatch(setSelectionPhase(false))
      } else {
        dispatch(setSelectionPhase(res.body.phase))
      }
      dispatch(loadingSelectionPhase(false))
    })
  }
}

const loadingSelectionPhase = (loadingSelectionPhase) => ({
  type: prefix + 'LOADING_SELECTION_PHASE',
  payload: { loadingSelectionPhase }
})

const setSelectionPhase = (selectionPhase) => ({
  type: prefix + 'SET_SELECTION_PHASE',
  payload: { selectionPhase }
})

// Selection List
export const getSelectionList = () => {
  return async (dispatch, getState) => {
    if (!window.localStorage.token) return false
    dispatch(loadingSelectionList(true))
    const path = lib.getSurveyPath() + '/api/selection/list'
    const send = {
      session: lib.getSession()
    }
    request.post(path, send, (err, res) => {
      dispatch(loadingSelectionList(false))
      if (err) {
        dispatch(setSelectionList(false))
      } else {
        dispatch(setSelectionList(res.body.list))
      }
    })
  }
}

const loadingSelectionList = (loadingSelectionList) => ({
  type: prefix + 'LOADING_SELECTION_LIST',
  payload: { loadingSelectionList }
})

const setSelectionList = (selectionList) => ({
  type: prefix + 'SET_SELECTION_LIST',
  payload: { selectionList }
})

// Selection Like
export const getSelectionLike = () => {
  return async (dispatch, getState) => {
    if (!window.localStorage.token) return false
    dispatch(loadingSelectionLike(true))
    const path = lib.getSurveyPath() + '/api/selection/like/get'
    const send = {
      session: lib.getSession()
    }
    request.post(path, send, (err, res) => {
      if (err) {
        dispatch(setSelectionLike(false))
      } else {
        console.log(res.body.like)
        dispatch(setSelectionLike(res.body.like))
      }
      dispatch(loadingSelectionLike(false))
    })
  }
}

const loadingSelectionLike = (loadingSelectionLike) => ({
  type: prefix + 'LOADING_SELECTION_LIKE',
  payload: { loadingSelectionLike }
})

const setSelectionLike = (selectionLike) => ({
  type: prefix + 'SET_SELECTION_LIKE',
  payload: { selectionLike }
})

export const sendSelectionLike = (selectionid) => {
  return async (dispatch, getState) => {
    if (!window.localStorage.token) return false
    if ('removed' in getState().manager.selectionDetail) return false
    dispatch(loadingSelectionSendLike(true))
    console.log('sendLike: ', selectionid)
    const path = lib.getSurveyPath() + '/api/selection/like/add'
    const send = {
      session: lib.getSession(),
      selectionid,
      likeUserid: getState().status.user._id,
      userid: getState().status.user.userid,
    }
    request.post(path, send, (err, res) => {
      if (err) {
        dispatch(setSelectionLike(false))
      } else {
        if (res.body.status) dispatch(getSelectionLike())
      }
      dispatch(loadingSelectionSendLike(false))
    })
  }
}

const loadingSelectionSendLike = (loadingSelectionSendLike) => ({
  type: prefix + 'LOADING_SELECTION_SEND_LIKE',
  payload: { loadingSelectionSendLike }
})

// Selection Post
export const getSelectionPost = (id) => {
  return async (dispatch, getState) => {
    if (!window.localStorage.token) return false
    dispatch(loadingSelectionPostDetail(true))
    const path = lib.getSurveyPath() + '/api/selection/detail'
    const send = {
      session: lib.getSession(),
      id
    }
    request.post(path, send, (err, res) => {
      dispatch(loadingSelectionPostDetail(false))
      if (err) {
        dispatch(setSelectionPost(false))
      } else {
        dispatch(setSelectionPost(res.body.selection.selection))
      }
    })
  }
}

const loadingSelectionPostDetail = (loadingSelectionPostDetail) => ({
  type: prefix + 'LOADING_SELECTION_POST_DETAIL',
  payload: { loadingSelectionPostDetail }
})

export const setSelectionPostid = (selectionPostid) => ({
  type: prefix + 'SET_SELECTION_POSTID',
  payload: { selectionPostid }
})

export const setSelectionPost = (selectionPost) => ({
  type: prefix + 'SET_SELECTION_POST',
  payload: { selectionPost }
})

export const sendPost = (removeRequest) => {
  return async (dispatch, getState) => {
    if (!window.localStorage.token) return false
    if (!getState().manager.selectionPost.title) {
      return dispatch(showToast('入力内容を確認してください'))
    }
    removeRequest ? dispatch(loadingSelectionRemovePost(true)) : dispatch(loadingSelectionPost(true))
    const path = lib.getSurveyPath() + '/api/selection/post'
    const send = {
      session: lib.getSession(),
      id: getState().manager.selectionPostid,
      postUserid: getState().status.user._id,
      selection: getState().manager.selectionPost,
      remove: removeRequest ? true : false
    }
    request.post(path, send, (err, res) => {
      removeRequest ? dispatch(loadingSelectionRemovePost(false)) : dispatch(loadingSelectionPost(false))
      if (err) {
        dispatch(showToast('サーバーエラー'))
      } else {
        if (res.body.status) {
          if (removeRequest && getState().manager.selectionPostid) {
            dispatch(showToast('削除しました'))
            dispatch(replace('/manager/selection'))
          } else if (getState().manager.selectionPostid) {
            dispatch(showToast('更新しました'))
            dispatch(replace('/manager/selection/detail/' + getState().manager.selectionPostid))
          } else {
            dispatch(showToast('投稿しました'))
            dispatch(replace('/manager/selection'))
          }
        } else {
          dispatch(showToast('サーバーエラー'))
        }
      }
    })
  }
}

const loadingSelectionPost = (loadingSelectionPost) => ({
  type: prefix + 'LOADING_SELECTION_POST',
  payload: { loadingSelectionPost }
})

const loadingSelectionRemovePost = (loadingSelectionRemovePost) => ({
  type: prefix + 'LOADING_SELECTION_REMOVE_POST',
  payload: { loadingSelectionRemovePost }
})

// Selection Detail
export const getSelectionDetail = (id) => {
  return async (dispatch, getState) => {
    if (!window.localStorage.token) return false
    dispatch(loadingSelectionDetail(true))
    dispatch(setSelectionDetailid(id))
    const path = lib.getSurveyPath() + '/api/selection/detail'
    const send = {
      session: lib.getSession(),
      id
    }
    request.post(path, send, (err, res) => {
      dispatch(loadingSelectionDetail(false))
      if (err) {
        dispatch(setSelectionDetail(false))
      } else {
        if (res.body.status) {
          dispatch(setSelectionDetail(res.body.selection.selection))
        } else {
          dispatch(setSelectionDetail({removed: true}))
        }
      }
    })
  }
}

const loadingSelectionDetail = (loadingSelectionDetail) => ({
  type: prefix + 'LOADING_SELECTION_DETAIL',
  payload: { loadingSelectionDetail }
})

const setSelectionDetailid = (selectionDetailid) => ({
  type: prefix + 'SET_SELECTION_DETAILID',
  payload: { selectionDetailid }
})

const setSelectionDetail = (selectionDetail) => ({
  type: prefix + 'SET_SELECTION_DETAIL',
  payload: { selectionDetail }
})