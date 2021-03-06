import {actionCreatorsFor} from 'redux-crud';
import $ from 'jquery'
import cuid from 'cuid'
import * as meActions from 'gModules/me/actions.js'
import {rootUrl} from 'servers/guesstimate-api/constants.js'

let standardActionCreators = actionCreatorsFor('users');

const standards = () => {
  return {
    dataType: 'json',
    contentType: 'application/json'
  }
}

const formattedRequest = ({requestParams, state}) => {
  const params = Object.assign(standards(state), requestParams)
  return $.ajax(params)
}

export function fetch(params = {}) {
  return function(dispatch, getState) {
    const action = standardActionCreators.fetchStart();
    dispatch(action)

    let url = rootUrl + 'users'
    params.auth0_id ? url += `?auth0_id=${params.auth0_id}` : false

    const request = formattedRequest({
      state: getState(),
      requestParams: {
        url,
        method: 'GET',
      }
    })

    request.done(data => {
      const action = standardActionCreators.fetchSuccess(data)
      dispatch(action)

      if (params.auth0_id) {
        const me = data[0]
        dispatch(meActions.guesstimateMeLoaded(me))
      }
    })
  }
}

export function create(object) {
  return function(dispatch, getState) {

    const cid = cuid()
    object = Object.assign(object, {id: cid})
    const action = standardActionCreators.createStart(object);

    const request = formattedRequest({
      state: getState(),
      requestParams: {
        url: (rootUrl + 'users/'),
        data: JSON.stringify({user: object}),
        method: 'POST'
      }
    })

    request.done(data => {
      const action = standardActionCreators.createSuccess(data, cid)
      dispatch(action)
      dispatch(meActions.guesstimateMeLoaded(data))
    })
  }
}

