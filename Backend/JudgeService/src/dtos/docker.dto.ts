export interface CreateContainerOptions {
    imageName: string;
    cmdExecutable: string[];
    memoryLimit: number;
}

export interface RunCodeOptions {
    code: string;
    language: "cpp" | "python" | "java" | "javascript";
    timeout: number;
    imageName: string;
    input: string;
}