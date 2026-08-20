const bashConfig = ["/bin/bash", "-c"];

export const commands = {
    cpp(code: string, input: string) {
        const codeB64 = Buffer.from(code || "").toString("base64");
        const inputB64 = Buffer.from(input || "").toString("base64");

        const runCommand = `
            mkdir -p app &&
            cd app &&
            echo '${codeB64}' | base64 -d > code.cpp &&
            echo '${inputB64}' | base64 -d > input.txt &&
            g++ code.cpp -o run &&
            ./run < input.txt
        `;

        return [...bashConfig, runCommand];
    },

    python(code: string, input: string) {
        const codeB64 = Buffer.from(code || "").toString("base64");
        const inputB64 = Buffer.from(input || "").toString("base64");

        const runCommand = `
            mkdir -p app &&
            cd app &&
            echo '${codeB64}' | base64 -d > code.py &&
            echo '${inputB64}' | base64 -d > input.txt &&
            python3 code.py < input.txt
        `;

        return [...bashConfig, runCommand];
    },

    javascript(code: string, input: string) {
        const codeB64 = Buffer.from(code || "").toString("base64");
        const inputB64 = Buffer.from(input || "").toString("base64");

        const runCommand = `
            mkdir -p app &&
            cd app &&
            echo '${codeB64}' | base64 -d > code.js &&
            echo '${inputB64}' | base64 -d > input.txt &&
            node code.js < input.txt
        `;

        return [...bashConfig, runCommand];
    },

    java(code: string, input: string) {
        const codeB64 = Buffer.from(code || "").toString("base64");
        const inputB64 = Buffer.from(input || "").toString("base64");

        const runCommand = `
            mkdir -p app &&
            cd app &&
            echo '${codeB64}' | base64 -d > Main.java &&
            echo '${inputB64}' | base64 -d > input.txt &&
            javac Main.java &&
            java Main < input.txt
        `;

        return [...bashConfig, runCommand];
    }
};