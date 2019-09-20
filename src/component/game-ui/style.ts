import styled from 'styled-components';
import { UNION_SIZE } from '../../constant';
import { Direction } from '../../typings';

export const GameUIContainer = styled.div`
  background: #eee;
`;

export interface IGameUIMapProps {
  width: number;
  height: number;
}
export const GameUIMap = styled.div`
  position: relative;
  background: black;
  width: ${(props: IGameUIMapProps) => `${props.width * UNION_SIZE}px`};
  height: ${(props: IGameUIMapProps) => `${props.height * UNION_SIZE}px`};

  & > div {
    position: absolute;
    width: ${UNION_SIZE}px;
    height: ${UNION_SIZE}px;
  }
`;

export interface IGameUIUnionProps {
  left: number;
  top: number;
}
export const GameUIUnion = styled.div`
  left: ${(props: IGameUIUnionProps) => `${props.left * UNION_SIZE}px`};
  top: ${(props: IGameUIUnionProps) => `${props.top * UNION_SIZE}px`};
`;

export interface IGameUITankProps {
  left: number;
  top: number;
  direction: Direction;
}
export const GameUITank = styled.div`
  transition: all 1s;
  left: ${(props: IGameUITankProps) => `${props.left * UNION_SIZE}px`};
  top: ${(props: IGameUITankProps) => `${props.top * UNION_SIZE}px`};
  transform: ${(props: IGameUITankProps) => `rotate(${props.direction * 90}deg)`};
`;