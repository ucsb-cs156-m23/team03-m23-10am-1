import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

function RecommendationRequestForm({ initialContents, submitAction, buttonLabel = "Create" }) {
    
    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all

    const navigate = useNavigate();

    const testIdPrefix = "RecommendationRequestForm";

    return (
        <Form onSubmit={handleSubmit(submitAction)}>

            {initialContents && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-id"}
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialContents.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="requesterEmail">Requester Email</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-requesterEmail"}
                    id="requesterEmail"
                    type="text"
                    isInvalid={Boolean(errors.requesterEmail)}
                    {...register("requesterEmail", {
                        required: "RequesterEmail is required.",
                        maxLength : {
                            value: 50,
                            message: "Max length 50 characters"
                        }
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.requesterEmail?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="professorEmail">Professor Email</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-professorEmail"}
                    id="professorEmail"
                    type="text"
                    isInvalid={Boolean(errors.professorEmail)}
                    {...register("professorEmail", {
                        required: "ProfessorEmail is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.professorEmail?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="explanation">Explanation</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-explanation"}
                    id="explanation"
                    type="text"
                    isInvalid={Boolean(errors.explanation)}
                    {...register("explanation", {
                        required: "Explanation is required.",
                        maxLength : {
                            value: 3000,
                            message: "Max length 3000 characters"
                        }
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.explanation?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="dateRequested">Date Requested</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-dateRequested"}
                    id="dateRequested"
                    type="datetime-local"
                    isInvalid={Boolean(errors.dateRequested)}
                    {...register("dateRequested", {
                        required: "DateRequested is required.",
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.dateRequested?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="dateNeeded">Date Needed</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-dateNeeded"}
                    id="dateNeeded"
                    type="datetime-local"
                    isInvalid={Boolean(errors.dateNeeded)}
                    {...register("dateNeeded", {
                        required: "DateNeeded is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.dateNeeded?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="done">Done</Form.Label>
                <Form.Check
                    data-testid={testIdPrefix + "-done"}
                    id="done"
                    type="text"
                    isInvalid={Boolean(errors.done)}
                    {...register("done", {
                        required: "Done is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.done?.message}
                </Form.Control.Feedback>
            </Form.Group>


            <Button
                type="submit"
                data-testid={testIdPrefix + "-submit"}
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "-cancel"}
            >
                Cancel
            </Button>

        </Form>

    )
}

export default RecommendationRequestForm;