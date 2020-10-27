import Edge from './Edge';
import NFANode from './NFANode';
import InputSet from './InputSet';

export interface IPair {
    head: NFANode,
    tail: NFANode,
}

class NFAManager {
    public edgeMap: Map<string, Edge> = new Map();
    public NFANodeMap: Map<string, NFANode> = new Map();
    public head: NFANode | null = null;
    public tail: NFANode | null = null;

    public get NFANodeList() {
        return Array.from(this.NFANodeMap.values());
    }

    public get edgeNodeList() {
        return Array.from(this.edgeMap.values());
    }

    public createNode() {
        const node = new NFANode(this);
        this.NFANodeMap.set(node.id, node);
        return node;
    }

    public createEdge(inputSet: InputSet, start: NFANode, end: NFANode) {
        const edge = new Edge({
            inputSet,
            start,
            end,
        });
        this.edgeMap.set(edge.id, edge);
        return edge;
    }

    public createPair(): IPair {
        const head = this.createNode();
        const tail = this.createNode();

        return {
            head,
            tail,
        }
    }

    /**
     * 尝试 字符串 是否匹配
     * @param head 头节点
     * @param tail 尾节点 
     * @param input 匹配的字符串
     */
    public match(input: string) {
        this.prepare();
        const { head, tail } = this;
        if (!head || !tail) {
            return false;
        }

        let curEmptyClosure = this.cloneClosure(head.emptyClosure);
        for (let i = 0; i < input.length; i++) {
            curEmptyClosure = this.move(curEmptyClosure, input[i]);
        }

        console.log('curEmptyClosure', curEmptyClosure);
        if (curEmptyClosure.has(tail.id)) {
            return true;
        }

        return false;
    }

    private cloneClosure(closure: Map<string, NFANode>) {
        const map = new Map();
        closure.forEach(node => {
            map.set(node.id, node);
        });
        return map;
    }

    /**
     * 当前状态 - char -> 下一状态集合
     * @param closure 当前状态集合
     * @param char 输入的字符
     */
    private move(closure: Map<string, NFANode>, char: string) {
        const next: Map<string, NFANode> = new Map();
        closure.forEach(node => {
            node.edgeMap.forEach(edge => {
                if (edge.match(char)) {
                    // 如果匹配 则下一状态包含 end 的空闭包集合
                    edge.end.emptyClosure.forEach(nextNode => {
                        next.set(nextNode.id, nextNode);
                    })
                }
            })
        });
        return next;
    }

    // 匹配前进行节点的 空闭包集合 计算
    private prepare() {
        // 求 空闭包 集合
        function calc(node: NFANode) {
            const emptyClosure = [node];

            for (let i = 0; i < emptyClosure.length; i++) {
                const cur = emptyClosure[i];
                cur.edgeMap.forEach((edge: Edge) => {
                    if (edge.inputSet.isEmpty()) {
                        // 如果为空边, 加入集合
                        emptyClosure.push(edge.end);
                    }
                })
            }
            
            // 转化为 map
            const emptyClosureMap: Map<string, NFANode> = new Map();
            emptyClosure.forEach(node => {
                emptyClosureMap.set(node.id, node);
            });

            return emptyClosureMap;
        }

        // 对每个节点 求 空闭包 集合 
        this.NFANodeMap.forEach((node: NFANode) => {
            const emptyClosureMap = calc(node);
            node.emptyClosure = emptyClosureMap;
        });
    }
}

export default NFAManager;
