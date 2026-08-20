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
    if (!logs || logs.length === 0) {
        return "";
    }

    let output = "";
    let offset = 0;

    // Parse Docker multiplexed log stream headers (8 bytes per frame)
    while (offset < logs.length) {
        if (offset + 8 > logs.length) {
            output += logs.slice(offset).toString("utf8");
            break;
        }

        const streamType = logs[offset];
        if (streamType === 1 || streamType === 2) {
            const frameSize = logs.readUInt32BE(offset + 4);
            const frameContent = logs.slice(offset + 8, offset + 8 + frameSize).toString("utf8");
            if (streamType === 1) { // stdout
                output += frameContent;
            }
            offset += 8 + frameSize;
        } else {
            output += logs.slice(offset).toString("utf8");
            break;
        }
    }

    return output.trim();
}
