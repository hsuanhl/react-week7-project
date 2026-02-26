import Home from '../pages/Home';
import Layout from '../Layout';
import Products from '../pages/Products';
import Product from '../pages/Product';
import NotFound from '../pages/NotFound';
import About from '../pages/About';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Login from '../pages/Login';
import ProductList from '../pages/ProductList';
import AdminLayout from '../AdminLayout';

const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/products',
        element: <Products />,
      },
      {
        path: '/product/:id',
        element: <Product />,
      },
      {
        path: '/cart',
        element: <Cart />,
      },
      {
        path: '/checkout',
        element: <Checkout />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: 'productList',
        element: <ProductList />,
      },
    ],
  },

  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
