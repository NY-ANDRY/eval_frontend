import ListCategories from "../components/categories/ListCategories.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useClientFetch } from "../hooks/useHttpRequest.js";
import { API_URL_CLIENT } from "../lib/const.js";
import Product from "../components/products/Product.jsx";
import { ProductSkeletons } from "../components/skeleton/Skeletons.jsx";

const Home = () => {
  const navigate = useNavigate();
  const [selectedCtg, setSelectedCtg] = useState(null);
  const { data: selectedCtgProducts, loading } = useClientFetch(`${API_URL_CLIENT}/products?category_id=${selectedCtg}`);

  const hancleClickCategory = (category) => {
    // navigate(`/categories/${category.id}/products`);
    setSelectedCtg(category.id);
  }

  return (
    <div className="flex">
      <div className={`h-full w-xs`}>
        <ListCategories onClickCategory={hancleClickCategory} />
      </div>
      <div className="flex-1 flex flex-wrap gap-4 p-4 h-fit">
        {!loading && selectedCtgProducts?.data?.map((categoryProduct) => (
          <Product product={categoryProduct} />
        ))}

        {loading && <ProductSkeletons nb={8} />}
      </div>
    </div>
  );
};

export default Home;