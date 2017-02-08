import React, { Component } from 'react'
import Link from 'components/Link'
import './Wellcome.scss'

class Wellcome extends Component {
  render () {
    return (
      <div className='App'>
        <div className='App-header'>
          <h2>Welcome to React</h2>
        </div>
        <p className='App-intro'>
          KuongKnight create project
        </p>
        <Link to={'/Notfound'}>To Notfound</Link>
      </div>
    )
  }
}

export default Wellcome
