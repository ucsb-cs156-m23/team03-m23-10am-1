import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

function UCSBOrganizationForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    
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

    const testIdPrefix = "UCSBOrganizationForm";

    return (
        <Form onSubmit={handleSubmit(submitAction)}>

            {
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="orgCode">Organization Code</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-orgCode"}
                        id="orgCode"
                        type="text"
                        {...register("orgCode")}
                    />
                </Form.Group>
            }

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="orgTranslationShort">Organization Translation Short</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-orgTranslationShort"}
                    id="orgTranslationShort"
                    type="text"
                    isInvalid={Boolean(errors.orgTranslationShort)}
                    {...register("orgTranslationShort", {
                        required: "orgTranslationShort is required.",
                        maxLength : {
                            value: 50,
                            message: "orgTranslationShort max length 50 characters."
                        }
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.orgTranslationShort?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="orgTranslation">Organization Translation</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-orgTranslation"}
                    id="orgTranslation"
                    type="text"
                    isInvalid={Boolean(errors.orgTranslation)}
                    {...register("orgTranslation", {
                        required: "orgTranslation is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.orgTranslation?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="inactive">Inactive</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-inactive"}
                    id="inactive"
                    type="text"
                    isInvalid={Boolean(errors.inactive)}
                    {...register("inactive", {
                        required: "Inactive is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.inactive?.message}
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

export default UCSBOrganizationForm;