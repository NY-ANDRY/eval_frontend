import { tr } from "motion/react-client";
import { Trash2Icon, PlusIcon, MinusIcon } from "lucide-react";
import { useClientCart } from "../../context/ClientCartContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Cart = () => {
    const { cartItems } = useClientCart();

    return (
        <div className="flex flex-col w-full">

            <table className="table table-sm">
                <thead>
                    <tr>
                        <th>product</th>
                        <th>qtt</th>
                        <th>pu</th>
                        <th>total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems?.data?.items?.map(((item, i) => (
                        <CartRow key={item.id} item={item} />
                    )))}
                </tbody>
            </table>

            <div className="flex flex-row-reverse">
                <div className="flex text-xl font-semibold">{cartItems?.data?.formatted_grand_total}</div>
            </div>

            <div className="flex flex-row-reverse py-4">
                <Link to={`/cart/${cartItems?.data?.id}/checkout`}>
                    <button className="btn btn-sm btn-primary px-8!">valider</button>
                </Link>
            </div>

        </div>
    )
}

export default Cart;

const CartRow = ({ item }) => {
    const { removeCartItem, updateQtt } = useClientCart();
    const [qtt, setQtt] = useState(null);

    const onDeleteRow = async (cartItem) => {
        removeCartItem(cartItem);
    }

    useEffect(() => {
        if (!item) {
            return;
        }
        setQtt(item.quantity);
    }, [item]);

    useEffect(() => {
        if (!item || qtt == null || qtt == item.quantity) {
            return;
        }

        updateQtt(item, qtt);
    }, [qtt]);

    return (
        <tr key={item.id}>
            <td>
                <div className="flex gap-2">
                    <img src={item?.product?.base_image?.small_image_url} className="w-24 rounded" />
                    <div className="flex flex-col gap-2 pt-0.5 pb-2">
                        <div className="flex text-base">
                            {item?.product?.name}
                        </div>
                        <div className="flex w-xs  leading-tight text-neutral-400" dangerouslySetInnerHTML={{ __html: item?.product?.short_description }}></div>
                    </div>
                </div>
            </td>
            <td>
                <div className="flex items-center gap-2">
                    <button onClick={() => setQtt(prev => Number(prev) - 1)}>
                        <MinusIcon className="w-4 h-4" />
                    </button>
                    <input onChange={(e) => { setQtt(e.target.value) }} value={qtt} className="w-16 text-center border-b border-neutral-200 rounded-none!" />
                    <button onClick={() => setQtt(prev => Number(prev) + 1)} >
                        <PlusIcon className="w-4 h-4" />
                    </button>
                </div>
            </td>
            <td>{item.formatted_base_price}</td>
            <td>{item.formatted_total}</td>
            <th>
                <div className="flex">
                    <button onClick={() => onDeleteRow(item)} className="flex items-center justify-center activable p-2">
                        <Trash2Icon className="text-red-400" />
                    </button>
                </div>
            </th>
        </tr>
    )
}