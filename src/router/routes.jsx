import Login from "../components/auth/Login";
import CategoryProducts from "../pages/categories/CategoryProducts";
import ReadFileExample from "../pages/examples/ReadFileExample";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Cart from "../pages/cart/Cart";
import Checkout from "../pages/cart/Checkout";
import ProductDetails from "../pages/products/ProductDetails";
import Order from "../pages/orders/Order";

const routes = [
  {
    path: "/",
    component: Home,
    title: "Accueil",
  },
  {
    path: "/login",
    component: Login,
    title: "Login",
  },
  {
    path: "/categories/:id/products",
    component: CategoryProducts,
    title: "category products",
  },
  {
    path: "/products/:id",
    component: ProductDetails,
    title: "product",
  },
  {
    path: "/cart",
    component: Cart,
    title: "cart",
  },
  {
    path: "/cart/:id/checkout",
    component: Checkout,
    title: "cart checkout",
  },
  {
    path: "/order",
    component: Order,
    title: "cart",
  },
  {
    path: "/examples/csv",
    component: ReadFileExample,
    title: "Accueil",
  },
  {
    path: "*",
    component: NotFound,
    title: "Not Found",
  },
];

export default routes;

import Layout from "../components/layouts/Layout";
import BackOfficeLayout from "../components/layouts/BackOfficeLayout";

export const advancedRoute = [
  {
    path: "/backoffice",
    element: <BackOfficeLayout />,
    children: [
      {
        path: "dashboard",
        element: <></>
      }
    ],
  },
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "categories/:id/products",
        element: <CategoryProducts />,
      },
      {
        path: "products/:id",
        element: <ProductDetails />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "cart/:id/checkout",
        element: <Checkout />,
      },
      {
        path: "order",
        element: <Order />,
      },
      {
        path: "examples/csv",
        element: <ReadFileExample />,
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
