import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import poaActions from 'actions/poa'
import PropertyCard from 'components/PropertyCard'
import PoaLayout from 'components/poa/PoaLayout'
import PoaActions from 'components/poa/PoaActions'

const mapStateToProps = state => {
  return {
    metaData: state.poa.metaData,
    web3Initialized: state.web3.web3Instance
  }
}

const mapDispatchToProps = dispatch => {
  let { getMetaData } = bindActionCreators(poaActions, dispatch)
  
  return {
    getMetaData
  }
}


class PoaMain extends React.Component {
  state = {}

  componentDidMount() {
    const { getMetaData } = this.props

    getMetaData()
  }

  render() {
    const { metaData } = this.props

    return (    
      <PoaLayout 
        meta={<PropertyCard image={metaData.photoUrl} description={metaData.description} />} 
        actions={<PoaActions />}
      />
    )
  }
}

PoaMain.propTypes = {
  metaData: PropTypes.object,
  getMetaData: PropTypes.func.isRequired,
}

PoaMain.defaultProps = {
  metaData: {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PoaMain)
