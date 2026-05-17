import { useNotification } from "../context/NotificationContext.jsx";
import ListCategories from "../components/categories/ListCategories.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useClientFetch } from "../hooks/useHttpRequest.js";
import { API_URL_CLIENT } from "../lib/const.js";
import Product from "../components/products/Product.jsx";
import { ProductSkeletons } from "../components/skeleton/Skeletons.jsx";

const Home = () => {
  const navigate = useNavigate();
  const { notify } = useNotification();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { data: selectedCategoryProducts, loading: loadingSelectedCategoryProduct } = useClientFetch(`${API_URL_CLIENT}/products?category_id=${selectedCategory}`);

  const hancleClickCategory = (category) => {
    // navigate(`/categories/${category.id}/products`);
    setSelectedCategory(category.id);
  }

  return (
    <div className="flex">
      <div className={`h-full w-xs`}>
        <ListCategories onClickCategory={hancleClickCategory} />
      </div>
      <div className="flex-1 flex flex-wrap gap-4 p-4 h-fit">
        {!loadingSelectedCategoryProduct && selectedCategoryProducts?.data?.map((categoryProduct) => (
          <Product product={categoryProduct} />
        ))}

        {loadingSelectedCategoryProduct && <ProductSkeletons nb={8} />}
      </div>
    </div>
  );
};

export default Home;