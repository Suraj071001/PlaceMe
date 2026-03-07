import { Main as googleChatMain } from "./consumers-groups/googlechat";
import { Main as emailMain } from "./consumers-groups/email";

async function main() {
    googleChatMain().catch((err) => {
        console.error("Google Chat worker failed", err);
    });

    emailMain().catch((err) => {
        console.error("Email worker failed", err);
    });
}

main().catch((err) => {
    console.error("Worker bootstrap failed", err);
});
