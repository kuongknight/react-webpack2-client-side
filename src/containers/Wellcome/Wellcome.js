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
        <Link to={'/Notfound'}>To Notfound</Link>
        <button className="btn btn-default" type="submit">Button</button>
        <input className="btn btn-default" type="button" value="Input" />
        <input className="btn btn-default" type="submit" value="Submit" />
        <button type="button" className="btn btn-warning">Warning</button>
      </div>
    )
  }
}

export default Wellcome
