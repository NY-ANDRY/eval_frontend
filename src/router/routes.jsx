import Login from "../components/auth/Login";
import CategoryProducts from "../pages/categories/CategoryProducts";
import ReadFileExample from "../pages/examples/ReadFileExample";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Cart from "../pages/cart/Cart";
import Checkout from "../pages/cart/Checkout";
import ProductDetails from "../pages/products/ProductDetails";
import Order from "../pages/orders/Order";
import Layout from "../components/layouts/Layout";
import BackOfficeLayout from "../components/layouts/BackOfficeLayout";

const rounte = [
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

export default rounte;