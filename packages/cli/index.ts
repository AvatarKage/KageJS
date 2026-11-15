#!/usr/bin/env node

async function main() {
    const command = process.argv[2];

    if (!["dev", "build"].includes(command)) {
        console.log("Usage: kagejs <dev|build>");
        process.exitCode = 1;
        return;
    }

    switch (command) {
        case "dev":
            console.log("Starting development server...");
            break;

        case "build":
            console.log("Building application...");
            break;
    }
}

main().catch((error) => {
    console.error("KageJS CLI error:", error);
    process.exitCode = 1;
});
