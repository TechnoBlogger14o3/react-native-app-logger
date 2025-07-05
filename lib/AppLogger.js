const MAX_LOG_LENGTH = 4000;
const isDebug = __DEV__; // Only true in dev mode in React Native
function chunkMessage(msg) {
    const chunks = [];
    let i = 0;
    while (i < msg.length) {
        chunks.push(msg.substring(i, i + MAX_LOG_LENGTH));
        i += MAX_LOG_LENGTH;
    }
    return chunks;
}
function stringifyError(error) {
    if (error instanceof Error) {
        return `${error.name}: ${error.message}\n${error.stack}`;
    }
    return typeof error === 'object' ? JSON.stringify(error, null, 2) : String(error);
}
export class AppLogger {
    static e(tag, msg) {
        if (!isDebug)
            return;
        const formattedMsg = stringifyError(msg);
        const chunks = chunkMessage(formattedMsg);
        chunks.forEach((chunk, idx) => {
            console.error(`[${tag}] ${chunk}`);
        });
    }
    static i(tag, msg) {
        if (!isDebug)
            return;
        console.log(`[${tag}] ${msg}`);
    }
    static w(tag, msg) {
        if (!isDebug)
            return;
        console.warn(`[${tag}] ${msg}`);
    }
    static d(tag, msg) {
        if (!isDebug)
            return;
        console.debug(`[${tag}] ${msg}`);
    }
}
