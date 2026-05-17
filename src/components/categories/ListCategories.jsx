import { useClientFetch } from "../../hooks/useHttpRequest";
import { API_URL_CLIENT } from "../../lib/const";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { CategorySkeletons } from "../skeleton/Skeletons.jsx";

const ListCategories = ({ onClickCategory }) => {
    const navigate = useNavigate();
    const { data: categories, loading: loadingCategories } = useClientFetch(`${API_URL_CLIENT}/categories?limit=1000`);

    const handleClick = (e, category) => {
        e.preventDefault();
        if (onClickCategory) {
            onClickCategory(category)
            return;
        }
        navigate(`/categories/${category.id}/products`);
    }

    return (
        <div className="grid grid-cols-1 flex-wrap gap-0 max-w-full overflow-hidden overflow-x-auto">
            {loadingCategories && <CategorySkeletons nb={3} />}
            {categories?.data?.map((category, index) => (
                <a onClick={(e) => { handleClick(e, category) }} href={`/categories/${category.id}`} key={category.id} className="flex gap-6  px-2 py-4 border-b border-neutral-200 rounded-sm activable">
                    {category.logo_url ?
                        <img src={category.logo_url} className="w-16 h-16 mask mask-squircle" />
                        :
                        <div className="w-16 h-16 mask mask-squircle bg-neutral-200" />
                    }
                    <div className="flex flex-col gap-2">

                        <div className="flex">
                            {category.name}
                        </div>
                        <div className="flex">
                            <div className="dangerous_txt flex text-xs text-neutral-400 w-2/3" dangerouslySetInnerHTML={{ __html: category.description }}></div>
                        </div>
                    </div>
                </a>
            ))}
        </div>
    )
}

export default ListCategories;