import Docker from "dockerode";
import logger from "../../config/logger.config";
import {
    CPP_IMAGE,
    PYTHON_IMAGE,
    JAVA_IMAGE,
    NODE_IMAGE
} from ".././constants";

export async function pullImage(image: string) {
    const docker = new Docker();
    return new Promise((resolve, reject) => {
        docker.pull(image, (err: any, stream: NodeJS.ReadableStream) => {
            if (err) {
                return reject(err);
            }
            docker.modem.followProgress(
                stream,
                function onFinished(error, output) {
                    if (error) {
                        return reject(error);
                    }
                    resolve(output);
                },
                function onProgress(event) {
                    logger.info(event.status);
                }
            );
        });
    });
}

export async function pullAllImages() {
    const images = [
        CPP_IMAGE,
        PYTHON_IMAGE,
        JAVA_IMAGE,
        NODE_IMAGE
    ];
    try {
        const promises = images.map(image => pullImage(image));
        await Promise.all(promises);
        logger.info("All Docker images pulled successfully.");
    } catch (error) {
        logger.error("Failed to pull Docker images.", error);
    }
}