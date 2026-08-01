import {
    CPP_IMAGE,
    PYTHON_IMAGE,
    JAVA_IMAGE,
    NODE_IMAGE
} from "./constants";

export function getImageName(language: string) {
    switch (language) {
        case "cpp":
            return CPP_IMAGE;
        case "python":
            return PYTHON_IMAGE;
        case "java":
            return JAVA_IMAGE;
        case "javascript":
            return NODE_IMAGE;
        default:
            throw new Error("Unsupported language");
    }
}