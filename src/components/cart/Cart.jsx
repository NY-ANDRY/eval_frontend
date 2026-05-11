import { tr } from "motion/react-client";
import { useClientCart } from "../../context/ClientCartContext";

const Cart = () => {
    const { cartItems } = useClientCart();

    return (
        <div className="flex flex-col">

            <div className="flex"></div>
            <table className="table table-sm">
                <thead>
                    <tr>
                        <th>product</th>
                        <th>qtt</th>
                        <th>pu</th>
                        <th>total</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems?.data?.items?.map(((item, i) => (
                        <tr key={item.id}>
                            <td>
                                <div className="flex gap-2">
                                    <img src={item?.product?.base_image?.small_image_url} className="w-24 rounded" />
                                    <div className="flex flex-col gap-2 pt-0.5 pb-2">
                                        <div className="flex text-base">
                                            {item?.product?.name}
                                        </div>
                                        <div className="flex w-xs  leading-tight text-neutral-400" dangerouslySetInnerHTML={{__html:item?.product?.short_description }}></div>
                                    </div>
                                </div>
                            </td>
                            <td>{item.quantity}</td>
                            <td>{item.formatted_base_price}</td>
                            <td>{item.formatted_total}</td>
                        </tr>
                    )))}
                </tbody>
            </table>

            <div className="flex flex-row-reverse">
                <div className="flex">{cartItems?.data?.formatted_grand_total}</div>
            </div>

        </div>
    )
}

export default Cart;