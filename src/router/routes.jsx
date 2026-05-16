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
import BackOfficeLayout from "../components/admin/layouts/Layout";
import AdminLogin from "../pages/backoffice/auth/Login";
import ProtectedRoute from "../components/admin/auth/ProtectedRoute";
import AdminOrder from "../pages/backoffice/order/Order";
import RemoveData from "../pages/backoffice/data/RemoveData";
import DataImport from "../pages/backoffice/data/Import";
import ImageImport from "../pages/backoffice/data/ImageImport.jsx";
import Wishlist from "../components/cart/Wishlist.jsx";
import Stock from "../pages/backoffice/stock/Stock.jsx";
import Stocks from "../pages/backoffice/stock/Stocks.jsx";

const routes = [
  {
    path: "backoffice",
    children: [
      {
        path: "auth",
        element: <AdminLogin />,
      },
      {
        path: "",
        element:
          <ProtectedRoute>
            <BackOfficeLayout />
          </ProtectedRoute>
        ,
        children: [
          {
            path: "",
            element: <>homeee</>
          },
          {
            path: "order",
            element: <AdminOrder />
          },
          {
            path: "data",
            element: <RemoveData />
          },
          {
            path: "import",
            element: <DataImport />
          },
          {
            path: "importImage",
            element: <ImageImport />
          },
          {
            path: "stock",
            element: <Stock />
          },
          {
            path: "stocks",
            element: <Stocks />
          },
          {
            path: "*",
            element: <NotFound />,
          },
        ],
      },
    ]
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
        path: "wishlist",
        element: <Wishlist />,
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

export default routes;