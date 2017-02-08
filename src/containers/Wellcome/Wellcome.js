import React, { Component } from 'react'
import Link from 'components/Link'

class Wellcome extends Component {
  render () {
    const s = require('./Wellcome.scss')
    return (
      <div className={s.App}>
        <div className={s.header}>
          <h2>Welcome to React</h2>
        </div>
        <p className={s.intro}>
          KuongKnight create project
        </p>
        <Link to={'/Notfound'}>
          <button type="button" className="btn btn-warning">NotFound</button>
        </Link>
      </div>
    )
  }
}

export default Wellcome
