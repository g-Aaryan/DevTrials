import { RunCodeOptions } from "../../dtos/docker.dto";
import { InternalServerError } from "../errors/app.error";
import { createNewDockerContainer } from "./createContainer.util";
import { commands } from "./commands.utils";


const allowListedLanguage = [
    "cpp",
    "python",
    "java",
    "javascript"
];

export async function runcode(options:RunCodeOptions){
    const {
        code,
        language,
        timeout,
        imageName,
        input
    } = options;

    if (!allowListedLanguage.includes(language)) {
        throw new InternalServerError("Invalid Language");
    }

    const container = await createNewDockerContainer({
        imageName,
        cmdExecutable: commands[language](code, input),
        memoryLimit: 1024 * 1024 * 1024
    });
    if(!container){
        throw new InternalServerError("Failed to create container");
    }
    
    let isTimeLimitExceeded = false;

    const timeoutHandler = setTimeout(async () => {

        isTimeLimitExceeded = true;

        await container.kill();

    }, timeout);

    await container.start();

    const status = await container.wait();

    if (isTimeLimitExceeded) {
        await container.remove();
        return {
            status: "time_limit_exceeded",
            output: "Time Limit Exceeded"
        };
    }

    const logs = await container.logs({
        stdout: true,
        stderr: true
    });
    
    clearTimeout(timeoutHandler);
    await container.remove();
    const output = processLogs(logs);
    if (status.StatusCode === 0) {
        return {
            status: "success",
            output
        };
    }
    return {
        status: "failed",
        output
    };
}

function processLogs(logs: Buffer | undefined) {
    if(!logs){
        return "";
    }
    return logs
        .toString("utf8")
        .replace(/\x00/g, "")
        .replace(/[\x00-\x09\x0B-\x1F\x7F-\x9F]/g, "")
        .trim();
}
