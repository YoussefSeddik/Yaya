import { createBrowserRouter } from "react-router";
import Home          from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Categories    from "./pages/Categories";
import Cart          from "./pages/Cart";
import Wishlist      from "./pages/Wishlist";
import Checkout      from "./pages/Checkout";
import Account       from "./pages/Account";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound      from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/product/:id",
    Component: ProductDetail,
  },
  {
    path: "/categories",
    Component: Categories,
  },
  {
    path: "/cart",
    Component: Cart,
  },
  {
    path: "/wishlist",
    Component: Wishlist,
  },
  {
    path: "/checkout",
    Component: Checkout,
  },
  {
    path: "/account",
    Component: Account,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
