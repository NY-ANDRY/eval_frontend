import { useNotification } from "../context/NotificationContext";
import ListCategories from "../components/categories/ListCategories";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const { notify } = useNotification();

  const hancleClickCategory = (category) => {
    navigate(`/categories/${category.id}/products`);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-7xl">
      <ListCategories onClickCategory={hancleClickCategory} />
      </div>
    </div>
  );
};

export default Home;