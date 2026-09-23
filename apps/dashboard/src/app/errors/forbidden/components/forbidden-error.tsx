import { ErrorPage } from "../../components/error-page";

export function ForbiddenError() {
  return (
    <ErrorPage
      code="403"
      title="Forbidden"
      message="Access to this resource is forbidden. You don't have the necessary permissions to view this page."
    />
  );
}
