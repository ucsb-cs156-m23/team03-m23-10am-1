import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function MenuItemReviewEditPage({ storybook = false }) {
    let { id } = useParams();

    const { data: menuitemreview, error: _error, status: _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/menuitemreview?id=${id}`],
            {  // Stryker disable next-line all
                method: "GET",
                url: `/api/menuitemreview`,
                params: {
                    id: id,
                }
            },
        );

    const objectToAxiosPutParams = (menuitemreview) => ({
        url: `/api/menuitemreview`,
        method: "PUT",
        params: {
            id: menuitemreview.id,
        },
        data: {
            itemId: menuitemreview.itemId,
            reviewerEmail: menuitemreview.reviewerEmail,
            stars: menuitemreview.stars,
            dateReviewed: menuitemreview.dateReviewed,
            comments: menuitemreview.comments,
        },
    });

    const onSuccess = (menuitemreview) => {
        toast(`MenuItemReview Updated - id: ${menuitemreview.id} itemId: ${menuitemreview.itemId} reviewerEmail: ${menuitemreview.reviewerEmail} stars: ${menuitemreview.stars} dateReviewed: ${menuitemreview.dateReviewed} comments: ${menuitemreview.comments}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/menuitemreview?id=${id}`]
    );

    const { isSuccess } = mutation;

    const onSubmit = async (menuitemreview) => {
        mutation.mutate(menuitemreview);
    }

    if (isSuccess && !storybook) {
        return <Navigate to = "/menuitemreview" />;
    }

    return (
        <BasicLayout>
            <div className = "pt-2">
                <h1>Edit MenuItemReview</h1>
                {
                    menuitemreview && <MenuItemReviewForm submitAction={onSubmit} buttonLabel="Update" initialContents={menuitemreview} />
                }
            </div>
        </BasicLayout>
    )
}