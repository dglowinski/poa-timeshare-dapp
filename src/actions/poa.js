import { POA_SET_META_DATA } from 'constants/actionTypes'

const _setMetaData = metaData => ({ type: POA_SET_META_DATA, metaData })
//const _showError = error => ({ type: SHOW_ERROR, error })

const getMetaData = () => dispatch => {
  console.log('dispatch')
  dispatch(_setMetaData('META'))
}

export default {
  getMetaData
}
