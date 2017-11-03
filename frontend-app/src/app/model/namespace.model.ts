export class Namespace {

    systemId: number;
    name: string;

    private initialize(){
        this.name = "";
    }

    constructor(){
        this.initialize();
    }

    reset(): void {
        this.initialize()
    }
}