import Login from "../components/auth/Login";
import CategoryProducts from "../pages/categories/CategoryProducts";
import ReadFileExample from "../pages/examples/ReadFileExample";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Cart from "../components/cart/Cart";
import ProductDetails from "../pages/products/ProductDetails";

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