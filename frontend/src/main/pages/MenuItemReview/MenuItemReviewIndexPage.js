import React from "react";
import { useBackend } from "main/utils/useBackend";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import MenuItemReviewTable from "main/components/MenuItemReview/MenuItemReviewTable";
import { Button } from "react-bootstrap";
import { useCurrentUser, hasRole } from "main/utils/currentUser";

export default function MenuItemReviewIndexPage() {

    const currentUser = useCurrentUser();

    const { data: menuitemreviews, error: _error, status: _status } =
        useBackend(
            // Stryker disable all : don't test internal caching of React Query
            ["/api/menuitemreview/all"],
            { method: "GET", url: "/api/menuitemreview/all" },
            []
            // Stryker restore all
        );

    const createButton = () => {
        if (hasRole(currentUser, "ROLE_ADMIN")) {
            return (
                <Button
                    variant="primary"
                    href="/menuitemreview/create"
                    style={{ float: "right" }}
                >
                    Create MenuItemReview
                </Button>
            );
        }
    };

    return (
        <BasicLayout>
            <div className="pt-2">
                {createButton()}
                <h1>MenuItemReviews</h1>
                <MenuItemReviewTable menuitemreviews={menuitemreviews} currentUser={currentUser} />
            </div>
        </BasicLayout>
    )
}