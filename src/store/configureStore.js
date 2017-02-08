import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from '../redux/reducers'
import createLogger from './logger'

export default function configureStore (initialState) {
  const middleware = []
  let enhancer

  if (__DEV__) {
    middleware.push(createLogger())
    let devToolsExtension = f => f
    if (process.env.BROWSER && window.devToolsExtension) {
      devToolsExtension = window.devToolsExtension()
    }

    enhancer = compose(
      applyMiddleware(...middleware),
      devToolsExtension,
    )
  } else {
    enhancer = applyMiddleware(...middleware)
  }

  const store = createStore(rootReducer, initialState, enhancer)

  if (__DEV__ && module.hot) {
    module.hot.accept('../redux/reducers', () =>
      store.replaceReducer(require('../redux/reducers').default),
    )
  }
  return store
}
