import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import poaActions from 'actions/poa'
import PropertyCard from 'components/common/PropertyCard'
import TokenLayout from 'components/common/TokenLayout'
import PoaOperations from 'components/poa/PoaOperations'

class PoaMain extends React.Component {
  state = {}

  componentDidMount() {
    const { getTokenDetails } = this.props

    getTokenDetails()
  }

  render() {
    const { metaData: {photoUrl, description} } = this.props

    return (    
      <TokenLayout 
        meta={<PropertyCard image={photoUrl} description={description} />} 
        actions={<PoaOperations />}
      />
    )
  }
}

PoaMain.propTypes = {
  metaData: PropTypes.object,
  getTokenDetails: PropTypes.func.isRequired,
}

PoaMain.defaultProps = {
  metaData: {}
};


const mapStateToProps = state => {
  return {
    metaData: state.poa.tokenDetails.metaData,
  }
}

const mapDispatchToProps = dispatch => {
  let { getTokenDetails } = bindActionCreators(poaActions, dispatch)
  
  return {
    getTokenDetails
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PoaMain)
