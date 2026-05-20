import { Link, useParams } from "react-router-dom";
import { useClientFetch } from "../../hooks/useHttpRequest";
import { API_URL_CLIENT } from "../../lib/const";
import { useEffect, useState } from "react";
import { useClientCart } from "../../context/ClientCartContext";
import { PlusIcon, ArrowLeftIcon } from "lucide-react";
import { span } from "motion/react-client";

const ProductDetails = ({ }) => {
    const { id } = useParams();
    const { data: productData } = useClientFetch(`${API_URL_CLIENT}/products/${id}`);
    const { addProductToCart } = useClientCart();

    const [qtt, setQtt] = useState(0);
    const [curImage, setCurImage] = useState('');

    useEffect(() => {
        if (!productData) {
            return;
        }

        if (productData.data.images.length > 0) {
            setCurImage(productData.data.images[0].large_image_url);
        }

    }, [productData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        addProductToCart(productData.data.id, qtt)
    }

    const addQtt = () => {
        setQtt((prev) => Number(prev) + 1);
    }

    const rmQtt = () => {
        if (qtt <= 0) {
            return;
        }
        setQtt((prev) => Number(prev) - 1);
    }

    const changeQtt = (nb) => {
        if (qtt < 0) {
            return;
        }
        setQtt(nb);
    }

    const product = productData?.data;

    return (
        <div className="flex gap-12 py-6">

            <div className="flex gap-2">
                <div className="flex flex-col gap-2">
                    {product?.images.map((image, i) => (
                        <img onClick={() => setCurImage(image.large_image_url)} src={image.small_image_url} key={image.id} className="rounded border border-neutral-400 cursor-pointer hover:" />
                    ))}
                </div>
                <div className="flex flex-col">
                    {curImage ?
                        <img src={curImage} className="rounded-sm w-142 h-142" />
                        :
                        <div src={curImage} className="skeleton rounded-xl w-142 h-142" />
                    }
                </div>
            </div>

            <div className="flex flex-col gap-0 flex-1">
                <div className="flex justify-between">
                    <div className="flex flex-col text-2xl font-bold tracking-wide">
                        <span>
                            {product?.name}
                        </span>

                        <div className="flex items-center gap-2 text-xl text-neutral-400">
                            {product?.categories?.map((category) => (
                                <span>{category.name}</span>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-end justify-end gap-4">
                            <span className="text-neutral-400 font-thin text-xs">
                                stock
                            </span>
                            <span>
                                {product?.inventories[0]?.qty}
                            </span>
                        </div>
                        <div className="flex items-end justify-end gap-4">
                            <span className="text-neutral-400 font-thin text-xs">
                                disponible
                            </span>
                            <span>
                                {product?.inventory_indices[0]?.qty}
                            </span>
                        </div>
                    </div>

                </div>

                <div className="flex flex-col mt-8 mb-4">
                    <div className="flex text-4xl font-bold">
                        {product?.special_price ?
                            <>
                                <div className="flex">{product?.formatted_special_price}</div>
                                <div className="flex text-neutral-300">{product?.formatted_regular_price}</div>
                            </>
                            :
                            <>
                                <div className="flex">{product?.formatted_price}</div>
                            </>
                        }
                        {/* {product?.formatted_price} */}
                    </div>
                    <div className="flex text-neutral-400 mt-4">
                        {product?.description}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                    <div className="flex items-center gap-2">

                        <button onClick={rmQtt} type="button" className="btn w-10 h-10">
                            <PlusIcon className="w-3 h-3" />
                        </button>

                        <input onChange={(e) => changeQtt(e.target.value)} value={qtt} type="number" className="input w-1/3 text-center" />

                        <button onClick={addQtt} type="button" className="btn w-10 h-10">
                            <PlusIcon className="w-3 h-3" />
                        </button>
                    </div>

                    <button type="submit" className="btn btn-neutral w-85">valider</button>
                </form>

            </div>

        </div>
    )
}

export default ProductDetails;