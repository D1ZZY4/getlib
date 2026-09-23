import { ErrorPage } from "../../components/error-page";

export function UnauthorizedError() {
  return (
    <ErrorPage
      code="401"
      title="Unauthorized"
      message="You don't have permission to access this resource. Please sign in or contact your administrator."
    />
  );
}
