import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("RecommendationRequestForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Requester Email", "Professor Email", "Explanation", "Date Requested", "Date Needed", "Done"];
    const testId = "RecommendationRequestForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RecommendationRequestForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-requesterEmail`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-professorEmail`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-explanation`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-dateRequested`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-dateNeeded`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-done`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-submit`)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });
    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RecommendationRequestForm initialContents={recommendationRequestFixtures.oneRecommendationRequest} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByText(`Id`)).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RecommendationRequestForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RecommendationRequestForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/RequesterEmail is required./);
        expect(screen.getByText(/ProfessorEmail is required./)).toBeInTheDocument();
        expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
        expect(screen.getByText(/DateRequested is required./)).toBeInTheDocument();
        expect(screen.getByText(/DateNeeded is required./)).toBeInTheDocument();
        expect(screen.getByText(/Done is required./)).toBeInTheDocument();

        fireEvent.change(screen.getByTestId(`${testId}-requesterEmail`), { target: { value: "a".repeat(51) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Max length 50 characters/)).toBeInTheDocument();
        });

        fireEvent.change(screen.getByTestId(`${testId}-explanation`), { target: { value: "a".repeat(3001) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Max length 3000 characters/)).toBeInTheDocument();
        });
    });

});