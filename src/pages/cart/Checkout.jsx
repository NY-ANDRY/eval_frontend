import { useNavigate } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";
import { useClientFetch, useClientMutation } from "../../hooks/useHttpRequest";
import { API_URL_CLIENT } from "../../lib/const";
import { useEffect, useState } from "react";
import { useClientAuth } from "../../context/ClientAuthContext";

const Checkout = () => {

    const { notify } = useNotification();
    const navigate = useNavigate();
    const { user } = useClientAuth();

    const { data: countries } = useClientFetch(`${API_URL_CLIENT}/countries?limit=1000`);

    const { mutate: mutateSaveAddress } = useClientMutation(`${API_URL_CLIENT}/customer/checkout/save-address`);
    const { mutate: mutateSaveShipping } = useClientMutation(`${API_URL_CLIENT}/customer/checkout/save-shipping`);
    const { mutate: mutateSavePayment } = useClientMutation(`${API_URL_CLIENT}/customer/checkout/save-payment`);
    const { mutate: mutateSaveOrder } = useClientMutation(`${API_URL_CLIENT}/customer/checkout/save-order`);

    const [companyName, setCompanyName] = useState('Gistoba');
    const [prenom, setPrenom] = useState('');
    const [nomFamille, setNomFamille] = useState('');
    const [email, setEmail] = useState('');
    const [adresseRue, setAdresseRue] = useState('andoharanofotsy');
    const [pays, setPays] = useState('');
    const [etat, setEtat] = useState('malagasy');
    const [ville, setVille] = useState('antananarivo');
    const [codePostal, setCodePostal] = useState('ab cdefg');
    const [telephone, setTelephone] = useState('+261 34 01 007 02');

    const [shippingMethodList, setShippingMethodList] = useState([]);
    const [shippingMethod, setShippingMethod] = useState("free_free");

    const [paymentMethodList, setPaymentMethodList] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("cashondelivery");

    const saveAddress = async () => {
        const dataAddress = {
            "billing": {
                "address": [
                    adresseRue
                ],
                "save_as_address": false,
                "use_for_shipping": true,
                "first_name": nomFamille,
                "last_name": prenom,
                "email": email,
                "company_name": companyName,
                "city": ville,
                "state": etat,
                "country": pays,
                "postcode": 70072,
                "phone": 9871234560
            }
        };
        const addressResponse = await mutateSaveAddress(dataAddress);
        notify("address method saved");
        setShippingMethodList(addressResponse.data.rates);
    }

    const saveShipping = async () => {
        const dataShipping = {
            "shipping_method": "free_free"
        };
        const saveResponse = await mutateSaveShipping(dataShipping);
        notify("shipping method saved");
        setPaymentMethodList(saveResponse.data.methods);
    }

    const savePayment = async () => {
        const dataPayment = {
            "payment": {
                "method": "cashondelivery"
            }
        };
        notify("payment method saved");
        await mutateSavePayment(dataPayment);

    }

    const saveOrder = async () => {
        await mutateSaveOrder();
        notify("order saved");
    }

    const saveAll = async () => {
        await saveAddress();
        await saveShipping();
        await savePayment();
        await saveOrder();
    }

    useEffect(() => {
        if (user) {
            setEmail(user.email);
            setPrenom(user.first_name);
            setNomFamille(user.name);
        }
    }, [user]);

    useEffect(() => {
        if (countries != null && countries.data) {
            console.log("-----");

            setPays(countries.data[0].code)
        }

        console.log(countries);


    }, [countries])

    return (
        <div className="flex flex-col py-4 max-w-full p-2">
            <div className="flex py-4 gap-2 w-full">
                <div className="flex flex-col w-sm gap-2">
                    <div className="flex flex-col gap-2">

                        <input
                            type="text"
                            placeholder="company name"
                            className="input input-sm"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="prenom"
                            className="input input-sm"
                            value={prenom}
                            onChange={(e) => setPrenom(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="nom de famille"
                            className="input input-sm"
                            value={nomFamille}
                            onChange={(e) => setNomFamille(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="email"
                            className="input input-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="adresse rue"
                            className="input input-sm"
                            value={adresseRue}
                            onChange={(e) => setAdresseRue(e.target.value)}
                        />

                        <select onChange={(e) => setPays(e.target.value)} className="select select-sm">
                            {countries?.data?.map((country, i) => (
                                <option key={country.code} value={country?.code}>{country.name}</option>
                            ))}
                        </select>

                        <input
                            type="text"
                            placeholder="etat"
                            className="input input-sm"
                            value={etat}
                            onChange={(e) => setEtat(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="ville"
                            className="input input-sm"
                            value={ville}
                            onChange={(e) => setVille(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="code postal"
                            className="input input-sm"
                            value={codePostal}
                            onChange={(e) => setCodePostal(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="telephone"
                            className="input input-sm"
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                        />
                    </div>

                    <button onClick={saveAddress} className="btn btn-sm btn-primary w-xs">save adresse</button>
                </div>

                <div className="flex flex-col">

                    <select onChange={(e) => setShippingMethod(e.target.value)} className="select select-sm">
                        {shippingMethodList?.map((methodd, i) => (

                            <option
                                key={methodd?.rates?.length > 0 && methodd?.rates[0].method}
                                value={methodd?.rates?.length > 0 && methodd?.rates[0].method}
                            >
                                {methodd?.rates?.length > 0 && methodd?.rates[0].method}
                            </option>

                        ))}
                    </select>

                    <button onClick={saveShipping} className="btn btn-sm btn-primary w-xs">save methode d'expedition</button>
                </div>


                <div className="flex flex-col">

                    <select onChange={(e) => setPaymentMethod(e.target.value)} className="select select-sm">
                        {paymentMethodList?.map((methodd, i) => (

                            <option
                                key={methodd?.method}
                                value={methodd?.method}
                            >
                                {methodd?.method}
                            </option>

                        ))}
                    </select>

                    <button onClick={savePayment} className="btn btn-sm btn-primary w-xs">save method de payement</button>
                </div>

                <div className="flex flex-col">
                    <button onClick={saveOrder} className="btn btn-sm btn-primary w-xs">save order</button>
                </div>

            </div>
            <div className="flex flex-col pt-8">
                <button onClick={saveAll} className="btn btn-sm btn-neutral w-xs">save all</button>
            </div>
        </div>
    )
}

export default Checkout;