

export abstract class Context {
    
    abstract load(): Promise<void>;
    abstract status(): string;
    
}





