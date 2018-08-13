import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import poaActions from 'actions/poa'
import PropertyCard from 'components/common/PropertyCard'
import PoaLayout from 'components/poa/PoaLayout'
import PoaOperations from 'components/poa/PoaOperations'

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


class PoaMain extends React.Component {
  state = {}

  componentDidMount() {
    const { getTokenDetails } = this.props

    getTokenDetails()
  }

  render() {
    const { metaData: {photoUrl, description} } = this.props

    return (    
      <PoaLayout 
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PoaMain)
