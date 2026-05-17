import { useNotification } from "../../../context/NotificationContext.jsx";
import { DataRemove } from "../../../services/DataRemove.js";


const RemoveData = () => {
    const { notify, setGlobalLoading } = useNotification();

    const handleRemoveData = async () => {

        const confirmDelete = window.confirm("Voulez-vous vraiment supprimer toutes les données ?");
        if (!confirmDelete) return;

        try {
            setGlobalLoading(true);

            const dr = new DataRemove();
            dr.setNotify(notify);

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