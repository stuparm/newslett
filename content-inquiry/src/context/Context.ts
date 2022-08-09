export abstract class Context {
    
    abstract load(): Promise<void>;
    // abstract status(): string;   TODO: use status for healthcheck
    
}