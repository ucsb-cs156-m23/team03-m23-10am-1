import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";
import UCSBOrganizationTable from "main/components/UCSBOrganization/UCSBOrganizationTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe("UCSBOrganizationTable tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = ["OrgCode", "OrgTranslationShort", "OrgTranslation", "Inactive"];
  const expectedFields = ["OrgCode", "OrgTranslationShort", "OrgTranslation", "Inactive"];
  const testId = "UCSBOrganizationTable";

  test("renders empty table correctly", () => {
    
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable ucsborganization={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const fieldElement = screen.queryByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(fieldElement).not.toBeInTheDocument();
    });
  });

  test("Has the expected column headers, content and buttons for admin user", () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable ucsborganization={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-OrgCode`)).toHaveTextContent("KRC");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-OrgTranslationShort`)).toHaveTextContent("KOREAN RADIO CL");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-OrgTranslation`)).toHaveTextContent("KOREAN RADIO CLUB");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-Inactive`)).toHaveTextContent("false");
    
    expect(screen.getByTestId(`${testId}-cell-row-1-col-OrgCode`)).toHaveTextContent("OSLI");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-OrgTranslationShort`)).toHaveTextContent("STUDENT LIFE");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-OrgTranslation`)).toHaveTextContent("OFFICE OF STUDENT LIFE");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-Inactive`)).toHaveTextContent("false");

    expect(screen.getByTestId(`${testId}-cell-row-2-col-OrgCode`)).toHaveTextContent("ZPR");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-OrgTranslationShort`)).toHaveTextContent("ZETA PHI RHO");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-OrgTranslation`)).toHaveTextContent("ZETA PHI RHO");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-Inactive`)).toHaveTextContent("true");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");

  });

  test("Has the expected column headers, content for ordinary user", () => {
    // arrange
    const currentUser = currentUserFixtures.userOnly;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable ucsborganization={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });
    
    expect(screen.getByTestId(`${testId}-cell-row-0-col-OrgCode`)).toHaveTextContent("KRC");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-OrgTranslationShort`)).toHaveTextContent("KOREAN RADIO CL");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-OrgTranslation`)).toHaveTextContent("KOREAN RADIO CLUB");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-OrgCode`)).toHaveTextContent("OSLI");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-OrgTranslationShort`)).toHaveTextContent("STUDENT LIFE");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-OrgTranslation`)).toHaveTextContent("OFFICE OF STUDENT LIFE");

    expect(screen.getByTestId(`${testId}-cell-row-2-col-OrgCode`)).toHaveTextContent("ZPR");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-OrgTranslationShort`)).toHaveTextContent("ZETA PHI RHO");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-OrgTranslation`)).toHaveTextContent("ZETA PHI RHO");

    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });


  test("Edit button navigates to the edit page", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable ucsborganization={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(await screen.findByTestId(`${testId}-cell-row-0-col-OrgCode`)).toHaveTextContent("KRC");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-OrgTranslationShort`)).toHaveTextContent("KOREAN RADIO CL");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();

    // act - click the edit button
    fireEvent.click(editButton);

    // assert - check that the navigate function was called with the expected path
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/ucsborganization/edit/KRC'));

  });

  test("Delete button calls delete callback", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable ucsborganization={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(await screen.findByTestId(`${testId}-cell-row-0-col-OrgCode`)).toHaveTextContent("KRC");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-OrgTranslationShort`)).toHaveTextContent("KOREAN RADIO CL");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();

    // act - click the delete button
    fireEvent.click(deleteButton);
  });
});