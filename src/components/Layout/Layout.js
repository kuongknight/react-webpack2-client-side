import React, { PropTypes } from 'react'

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  }

  render () {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

export default Layout
