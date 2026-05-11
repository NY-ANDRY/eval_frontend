import { useParams } from "react-router-dom";
import { useFetch } from "../../hooks/useHttpRequest";
import { API_URL_CLIENT } from "../../lib/const";
import { useEffect, useState } from "react";
import { img } from "motion/react-client";
import { useClientCart } from "../../context/ClientCartContext";
import { Trash2Icon, PlusIcon, MinusIcon, ShoppingCart } from "lucide-react";

const ProductDetails = ({ product }) => {
    const { id } = useParams();
    const { data: productData } = useFetch(`${API_URL_CLIENT}/products/${id}`);
    const { addProductToCart } = useClientCart();

    const { qtt, setQtt } = useState(0);

    const [curImage, setCurImage] = useState('');

    useEffect(() => {
        if (!productData) {
            return;
        }

        if (productData.data.images.length > 0) {   a
            setCurImage(productData.data.images[0].large_image_url);
        }

    }, [productData]);

    const handleAddToCart = () => {
        addProductToCart(product, qtt)
    }
    return (
        <div className="flex justify-between py-4">
            <div className="flex gap-2">
                <div className="flex flex-col gap-2">
                    {productData?.data?.images.map((image, i) => (
                        <img onClick={() => setCurImage(image.large_image_url)} src={image.small_image_url} key={image.id} className="rounded border border-neutral-400 cursor-pointer hover:" />
                    ))}
                </div>
                <div className="flex flex-col">
                    <img src={curImage} className="rounded-sm" />
                </div>
            </div>
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <PlusIcon onClick={() => { setQtt((prev) => Number(prev) - 1) }} />
                    <input value={qtt} type="number" className="input" />
                    <PlusIcon onClick={() => { setQtt((prev) => Number(prev) - 1) }} />
                </div>
            </div>
        </div>
    )
}

export default ProductDetails;