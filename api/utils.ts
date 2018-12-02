/** process.env.[name] or throw */
export const getEnv = (name: string): string =>
    process.env[name] || (() => { throw new Error(`environment variable ${name} is missing`); })();

export const log = console.log;

export const error = console.error;
