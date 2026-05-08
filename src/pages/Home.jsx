import ListProducts from "../components/products/ListProducts";
import { useNotification } from "../context/NotificationContext";

const Home = () => {
  const { notify } = useNotification();

  const handleTest = () => {
    notify("abc", 2);
  }

  return (
    <div className="flex flex-col p-4">

      <div className="flex h-72">Abc</div>
      <button onClick={handleTest} >test</button>
      <ListProducts />

    </div>
  );
};

export default Home;