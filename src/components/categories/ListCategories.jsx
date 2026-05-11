import { useFetch } from "../../hooks/useHttpRequest";
import { API_URL_CLIENT } from "../../lib/const";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ListCategories = ({ onClickCategory }) => {
    const navigate = useNavigate();
    const { data: categories } = useFetch(`${API_URL_CLIENT}/categories?limit=1000`);

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
            {categories?.data?.map((category, index) => (
                <a onClick={(e) => { handleClick(e, category) }} href={`/categories/${category.id}`} key={category.id} className="flex flex-col justify-between gap-2 px-2 py-4 border-b border-neutral-200 rounded-sm activable">
                    <div className="flex">
                        {category.name}
                    </div>
                    <div className="flex">
                        <div className="dangerous_txt flex text-xs text-neutral-400 w-2/3" dangerouslySetInnerHTML={{ __html: category.description }}></div>
                    </div>
                </a>
            ))}
        </div>
    )
}

export default ListCategories;