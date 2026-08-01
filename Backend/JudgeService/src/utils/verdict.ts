export function generateFinalVerdict(
    testcaseResults: { verdict: string }[]
): string {

    if (testcaseResults.some(t => t.verdict === "RUNTIME_ERROR")) {
        return "RUNTIME_ERROR";
    }

    if (testcaseResults.some(t => t.verdict === "TIME_LIMIT_EXCEEDED")) {
        return "TIME_LIMIT_EXCEEDED";
    }

    if (testcaseResults.some(t => t.verdict === "WRONG_ANSWER")) {
        return "WRONG_ANSWER";
    }

    return "ACCEPTED";
}