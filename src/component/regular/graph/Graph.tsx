import React, { useCallback } from 'react';
import ReactEcharts from 'echarts-for-react';
import { NFANode, Edge } from '../../../core/regular-exp/src/NFA';

export interface IGraphProps {
    nodes: NFANode[];
    edges: Edge[];
}

function format(props: IGraphProps) {
    const data = props.nodes.map((node) => ({
        id: node.id,
        name: node.nodeId,
        value: node.id,
        category: node.type,
    }));
    const edges = props.edges.map((edge) => ({
        id: edge.id,
        name: edge.inputSet.visibleInputList,
        value: -edge.inputSet.visibleInputList.length,
        source: edge.start.id,
        target: edge.end.id,
    }));

    return {
        data,
        edges,
    };
}

const Graph = (props: IGraphProps) => {
    const { nodes, edges } = props;

    const getOption = useCallback((nodes, edgeArray) => {
        const { data, edges } = format({
            nodes,
            edges: edgeArray,
        });

        return {
            title: {
                text: 'NFA',
                top: 'bottom',
                left: 'right',
            },
            legend: [
                {
                    data: ['头节点', '尾节点', '普通节点'],
                },
            ],
            series: [
                {
                    data,
                    links: edges,
                    type: 'graph',
                    layout: 'force',
                    draggable: true,
                    hoverAnimation: true,
                    force: {
                        repulsion: 60,
                        edgeLength: [80, 180],
                        gravity: 0.01,
                    },
                    categories: [
                        {
                            name: '头节点',
                        },
                        {
                            name: '尾节点',
                        },
                        {
                            name: '普通节点',
                        },
                    ],
                    symbolSize: 30,
                    label: {
                        // 节点 label
                        show: true,
                    },
                    edgeLabel: {
                        // 连线 label
                        show: true,
                        color: '#111',
                        formatter: (edge: any) => {
                            return edge.data.name;
                        },
                    },
                    lineStyle: {
                        color: 'target',
                        curveness: 0.3,
                        width: 3,
                    },
                    edgeSymbol: ['', 'arrow'],
                },
            ],
        };
    }, []);

    return (
        <div className="graph" style={{ marginTop: '30px' }}>
            <ReactEcharts
                style={{
                    height: '600px',
                }}
                option={getOption(nodes, edges)}
            />
        </div>
    );
};

export default Graph;
