import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import RecommendationRequestForm from 'main/components/RecommendationRequest/RecommendationRequestForm';
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RecommendationRequestEditPage({storybook=false}) {
    let { id } = useParams();

    const { data: reccomendationRequest, _error, _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/recommendationrequest?id=${id}`],
            {  // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
                method: "GET",
                url: `/api/recommendationrequest`,
                params: {
                    id
                }
            }
        );

    const objectToAxiosPutParams = (reccomendationRequest) => ({
        url: "/api/recommendationrequest",
        method: "PUT",
        params: {
            id: reccomendationRequest.id,
        },
        data: {
            requesterEmail: reccomendationRequest.requesterEmail,
            professorEmail: reccomendationRequest.professorEmail,
            explanation: reccomendationRequest.explanation,
            dateRequested: reccomendationRequest.dateRequested,
            dateNeeded: reccomendationRequest.dateNeeded,
            done: reccomendationRequest.done
        }
    });

    const onSuccess = (reccomendationRequest) => {
        toast(`Recommendation Request Updated - id: ${reccomendationRequest.id}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/recommendationrequest?id=${id}`]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess && !storybook) {
        return <Navigate to="/recommendationrequest" />
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Recommendation Request</h1>
                {
                    reccomendationRequest && <RecommendationRequestForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={reccomendationRequest} />
                }
            </div>
        </BasicLayout>
    )

}