import { ErrorPage } from "../../components/error-page";

export function UnderMaintenanceError() {
  return (
    <ErrorPage
      code="503"
      title="Under Maintenance"
      message="The service is currently unavailable. Please try again later."
    />
  );
}
