export class NamespaceValidator {

    private namespacePattern: RegExp;

    constructor(){
        this.namespacePattern =/^\w+( \w+)*$/;
    }

    public validFormat(name: string): boolean {
        return name.match(this.namespacePattern) != null;
    }
}