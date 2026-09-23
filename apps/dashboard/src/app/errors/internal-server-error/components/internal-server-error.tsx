import { ErrorPage } from "../../components/error-page";

export function InternalServerError() {
  return (
    <ErrorPage
      code="500"
      title="Internal Server Error"
      message="Something went wrong on our end. We're working to fix the issue. Please try again later."
    />
  );
}
