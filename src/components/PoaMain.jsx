import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import poaActions from 'actions/poa'

const mapStateToProps = state => {
  console.log('state: ', state);
  return {
    metaData: state.poa.metaData
  }
}

const mapDispatchToProps = dispatch => {
  console.log('poaActions: ', poaActions);
  let { getMetaData } = bindActionCreators(poaActions, dispatch)
  
  return {
    getMetaData
  }
}

class PoaMain extends React.Component {
  state = {}

  componentDidMount() {
    const { metaData, getMetaData } = this.props

    !metaData && getMetaData()
  }

  render() {
    const { metaData } = this.props
    return <div>{metaData}</div>
  }
}

PoaMain.propTypes = {
  metaData: PropTypes.string,
  getMetaData: PropTypes.func.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PoaMain)
