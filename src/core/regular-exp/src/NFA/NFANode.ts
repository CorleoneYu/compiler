import Edge from './Edge';
import InputSet from './InputSet';
import NFAManager from './NFAManager';

export enum NODE_TYPE {
    HEAD,
    TAIL,
    NORMAL,
}

let NFAId = 1;

export interface INFANodePair {
    head: NFANode;
    tail: NFANode;
}

class NFANode {
    public type: NODE_TYPE = NODE_TYPE.NORMAL;
    public manager: NFAManager;
    public id: string;
    public nodeId: number;
    public edgeMap: Map<string, Edge> = new Map();
    public emptyClosure: Map<string, NFANode> = new Map(); // 一个 nfa 图中的 空闭包

    public get next() {
        const next: NFANode[] = [];
        this.edgeMap.forEach((edge: Edge) => {
            next.push(edge.end);
        });
        return next;
    }
    constructor(manager: NFAManager) {
        this.nodeId = NFAId++;
        this.id = `node-${this.nodeId}`;
        this.manager = manager;
    }

    public setEdge(inputSet: InputSet, next: NFANode) {
        const edge = this.manager.createEdge(inputSet, this, next);
        this.edgeMap.set(edge.id, edge);
    }
}

export default NFANode;
