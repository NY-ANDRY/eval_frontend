export const ProductSkeletons = ({ nb = 1 }) => {
    return (
        <>
            {Array.from({ length: nb }).map((_, i) => (
                <div key={i} className="flex w-62 flex-col gap-4">
                    <div className="skeleton h-48 w-full"></div>
                    <div className="skeleton h-4 w-48"></div>
                    <div className="flex items-center justify-between">
                        <div className="skeleton h-4 w-24"></div>
                        {/* <div className="skeleton h-4 w-24"></div> */}
                    </div>
                    <div className="skeleton h-8 w-full"></div>
                    <div className="skeleton h-8 w-full"></div>
                </div>
            ))}
        </>
    );
};

export const TableSkeletons = ({ rows = 10 }) => {
    return (
        <>
            <div className="flex flex-col gap-1 w-full">
                <div className="skeleton h-8 w-full rounded-sm"></div>
                {Array.from({ length: rows }).map((_, i) => (
                    <div className="skeleton h-6 w-full rounded-sm"></div>
                ))}
            </div>
        </>
    );
};