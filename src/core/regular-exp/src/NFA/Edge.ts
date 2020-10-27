import NFANode from './NFANode';
import InputSet from './InputSet';

let edgeId = 1;

interface IEdgeProps {
    start: NFANode;
    end: NFANode;
    inputSet: InputSet;
}
class Edge {
    public id: string;
    public edgeId: number;
    public start: NFANode;
    public end: NFANode;
    public inputSet: InputSet;

    constructor(props: IEdgeProps) {
        const { start, end, inputSet } = props;
        this.edgeId = edgeId++;
        this.id = `edge-${this.edgeId}`;
        this.start = start;
        this.end = end;
        this.inputSet = inputSet;
    }

    match(char: string) {
        return this.inputSet.asciiList.includes(char.charCodeAt(0));
    }
}

export default Edge;
