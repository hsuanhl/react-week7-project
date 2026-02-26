import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router'
import routes from './routes/index.jsx'
import { store } from './store.js'
import { Provider } from 'react-redux'
import './assets/css/style.css'

const router = createHashRouter(routes);

createRoot(document.getElementById('root')).render(
  <Provider store={store} >
    <RouterProvider router={router} />
  </Provider>
)
