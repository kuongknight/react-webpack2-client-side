export default {

  path: '/',
  children: [
    require('./home').default,
    require('./notFound').default
  ],
  async action ({ next }) {
    const route = await next()
    route.title = `${route.title || 'Untitled Page'} - www.factis.com`
    route.description = route.description || ''

    return route
  }
}
