import { ActionResponse } from "@/types";

export function handleActionError<T>(
  error: unknown,
  defaultMessage: string
): ActionResponse<T> {
  console.error("Action Error:", error);

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "details" in error &&
    "message" in error
  ) {
    const dbError = error as {
      code: string;
      details: string | null;
      message: string;
    };
    return {
      success: false,
      message: defaultMessage,
      error: {
        code: dbError.code,
        details: dbError.details,
        message: dbError.message,
      },
    };
  }

  return {
    success: false,
    message: "An unexpected error occurred.",
  };
}
