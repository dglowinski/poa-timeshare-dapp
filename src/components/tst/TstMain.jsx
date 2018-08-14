import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import tstActions from 'actions/tst'
import PropertyCard from 'components/common/PropertyCard'
import TokenLayout from 'components/common/TokenLayout'
import TstOperations from 'components/tst/TstOperations'

class TstMain extends React.Component {
  state = {}

  componentDidMount() {
    const { getTokenDetails } = this.props

    getTokenDetails()
  }

  render() {
    const {
      metaData: { photoUrl, description }
    } = this.props

    return (
      <TokenLayout
        meta={<PropertyCard image={photoUrl} description={description} />}
        actions={<TstOperations />}
      />
    )
  }
}

TstMain.propTypes = {
  metaData: PropTypes.object,
  getTokenDetails: PropTypes.func.isRequired
}

TstMain.defaultProps = {
  metaData: {}
}

const mapStateToProps = state => {
  return {
    metaData: state.tst.tokenDetails.metaData
  }
}

const mapDispatchToProps = dispatch => {
  let { getTokenDetails } = bindActionCreators(tstActions, dispatch)

  return {
    getTokenDetails
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TstMain)
