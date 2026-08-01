const bashConfig = ["/bin/bash", "-c"];

export const commands = {

    cpp(code: string, input: string) {

        const runCommand = `
            mkdir app &&
            cd app &&
            echo '${code}' > code.cpp &&
            echo '${input}' > input.txt &&
            g++ code.cpp -o run &&
            ./run < input.txt
        `;

        return [...bashConfig, runCommand];
    },

    python(code: string, input: string) {

        const runCommand = `
            mkdir app &&
            cd app &&
            echo '${code}' > code.py &&
            echo '${input}' > input.txt &&
            python3 code.py < input.txt
        `;

        return [...bashConfig, runCommand];
    },

    javascript(code: string, input: string) {

        const runCommand = `
            mkdir app &&
            cd app &&
            echo '${code}' > code.js &&
            echo '${input}' > input.txt &&
            node code.js < input.txt
        `;

        return [...bashConfig, runCommand];
    },

    java(code: string, input: string) {

        const runCommand = `
            mkdir app &&
            cd app &&
            echo '${code}' > Main.java &&
            echo '${input}' > input.txt &&
            javac Main.java &&
            java Main < input.txt
        `;

        return [...bashConfig, runCommand];
    }

};