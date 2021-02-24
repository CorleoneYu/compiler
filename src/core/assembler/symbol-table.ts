class SymbolTable {
    private table: Map<string, number>;

    constructor() {
        const table = new Map([
            ['SP', 0],
            ['LCL', 1],
            ['ARG', 2],
            ['THIS', 3],
            ['THAT', 4],
            ['SCREEN', 16384],
            ['KBD', 24576]
        ]);
        let num = 16;
        // R0 ~ R15
        while (num--) {
            const key = `R${num}`;
            table.set(key, num);
        }

        this.table = table;
    }

    public addEntry(symbol: string, address: number) {
        this.table.set(symbol, address);
    }

    public getAddress(symbol: string) {
        return this.table.get(symbol);
    }

    public contains(symbol: string) {
        return this.table.has(symbol);
    }
    
}

export default SymbolTable;
