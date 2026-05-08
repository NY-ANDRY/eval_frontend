import { useEffect } from "react";
import { useFetch } from "../../hooks/useHttpRequest";
import { API_URL } from "../../lib/const";
import { formatDateFr } from "../../lib/utils";
import { Trash2Icon } from "lucide-react";

const ViewProducts = ({ product }) => {
    const { data } = useFetch(API_URL + "/catalog/products");

    useEffect(() => {
        console.log(product);

    }, []);

    return (
        <div className="flex flex-col gap-2 p-2 rounded-sm border border-neutral-200 w-62">
            <div className="flex items-center justify-center max-w-full h-62">
                <img
                    src={product?.images?.length > 0 && product?.images[0].medium_image_url}
                    alt={product.meta_description}
                    className="max-w-full max-h-full rounded-xs"
                />
            </div>
            <div className="flex items-center font-light text-neutral-700">
                {product.sku}
            </div>
            <div className="flex gap-2">
                <button className="flex-1 btn btn-sm">Details</button>
                <button className="btn btn-sm border-none p-0!">
                    <div className="box-icon-red">
                        <Trash2Icon />
                    </div>
                </button>
            </div>
        </div>
    )
}

export default ViewProducts;