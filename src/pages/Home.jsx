import ListProducts from "../components/products/ListProducts";
import { useNotification } from "../context/NotificationContext";
import { removeAllProducts } from "../services/ProductsService";

const Home = () => {
  const { notify } = useNotification();

  const handleTest = () => {
    // notify("abc");
    removeAllProducts(notify);
  }

  return (
    <div className="flex flex-col p-4">

      <div className="flex h-72">
        abc
      </div>
      <button onClick={handleTest} >test</button>
      <ListProducts />

    </div>
  );
};

export default Home;