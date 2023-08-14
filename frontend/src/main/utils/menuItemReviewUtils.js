import { toast } from "react-toastify";

export function cellToAxiosParamsDelete(cell) {
    return {
        url: "/api/menuitemreview",
        method: "DELETE",
        params: {
            id: cell.row.values.id
        }
    }
}
