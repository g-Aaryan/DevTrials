import Docker from "dockerode";
import logger from "../../config/logger.config";
import { CreateContainerOptions } from "../../dtos/docker.dto";


export async function createNewDockerContainer(
    options: CreateContainerOptions
) {
    try {
        const docker = new Docker();
        const container = await docker.createContainer({
            Image: options.imageName,
            Cmd: options.cmdExecutable,
            AttachStdout: true,
            AttachStderr: true,
            AttachStdin: true,
            OpenStdin: true,
            Tty: false,
            HostConfig: {
                Memory: options.memoryLimit,
                CpuQuota: 50000,
                CpuPeriod: 100000,
                PidsLimit: 100,
                NetworkMode: "none",
                SecurityOpt: ["no-new-privileges"]
            }
        });
        logger.info(`Container created: ${container.id}`);
        return container;
    } catch (error) {
        logger.error("Error creating container", error);
        return null;
    }
}