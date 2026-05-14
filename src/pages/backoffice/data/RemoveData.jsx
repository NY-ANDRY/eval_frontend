import { useNotification } from "../../../context/NotificationContext.jsx";
import { DataRemove } from "../../../services/DataRemove.js";


const RemoveData = () => {
    const { notify, setGlobalLoading } = useNotification();

    const handleRemoveData = async () => {

        try {
            setGlobalLoading(true);

            const dr = new DataRemove();

            await dr.remove();

        } catch (error) {

        } finally {
            setGlobalLoading(false);
        }

    }

    return (
        <div className="flex p-2">
            <button onClick={handleRemoveData} className="btn btn-sm btn-warning">remove data</button>
        </div>
    )
}

export default RemoveData;