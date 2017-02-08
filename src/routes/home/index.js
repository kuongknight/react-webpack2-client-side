import React from 'react'
import Layout from 'components/Layout'
import Wellcome from 'containers/Wellcome'

const title = 'Home'

export default {

  path: '/',

  action () {
    return {
      title,
      component: <Layout><Wellcome title={title} /></Layout>,
      status: 200
    }
  }

}
