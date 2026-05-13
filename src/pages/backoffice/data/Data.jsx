

const Data = () => {

    const handleRemoveData = () => {
        console.log("remove dataaa");
    }

    return (
        <div className="flex p-2">
            <button onClick={handleRemoveData} className="btn btn-sm btn-warning">remove data</button>
        </div>
    )
}

export default Data;