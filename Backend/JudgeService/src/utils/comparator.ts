export function compareOutput(
    expectedOutput: string,
    actualOutput: string
): boolean {

    const normalize = (output: string) => {
        return output
            .trim()
            .replace(/\r\n/g, "\n")
            .replace(/\s+$/gm, "");
    };

    return normalize(expectedOutput) === normalize(actualOutput);
}