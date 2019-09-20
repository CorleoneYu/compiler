import React, { Component } from "react";
import classnames from "classnames";

import { UNION_SIZE } from "../../constant";
import { ImgType, ISize, ITankUI } from "../../typings";

import { ReactComponent as TankIcon } from "./image/tank.svg";
import { ReactComponent as Wall } from "./image/wall.svg";
import { ReactComponent as Steel } from "./image/steel.svg";
import { ReactComponent as Target } from "./image/target.svg";
import * as Style from "./style";

interface IGameUIState {}

interface IGameUIProps {
  gameMap: ImgType[][][];
  size: ISize;
  tankUI: ITankUI | null;
}

export default class GameUI extends Component<IGameUIProps, IGameUIState> {
  renderItem(imgType: ImgType) {
    switch (imgType) {
      case ImgType.STEEL:
        return <Steel width={UNION_SIZE} height={UNION_SIZE} />;
      case ImgType.WALL:
        return <Wall width={UNION_SIZE} height={UNION_SIZE} />;
      case ImgType.TARGET:
        return <Target width={UNION_SIZE} height={UNION_SIZE} />;
      default:
        return <></>;
    }
  }

  renderUnion(imgType: ImgType, left: number, top: number) {
    if (imgType === ImgType.ROAD) return;

    const key = `${top}-${left}-${imgType}`;
    const cls = classnames("game-ui__union", `${key}`);
    return (
      <Style.GameUIUnion className={cls} key={key} left={left} top={top}>
        {this.renderItem(imgType)}
      </Style.GameUIUnion>
    );
  }

  renderRow(row: ImgType[][], top: number) {
    return (
      <React.Fragment key={top}>
        {row &&
          row.map((itemAry, left) => {
            return (
              itemAry &&
              itemAry.map(imgType => this.renderUnion(imgType, left, top))
            );
          })}
      </React.Fragment>
    );
  }

  renderGameMap() {
    const { gameMap, size } = this.props;
    return (
      <Style.GameUIMap width={size.width} height={size.height}>
        {gameMap && gameMap.map((row, top) => this.renderRow(row, top))}
        {this.renderTank()}
      </Style.GameUIMap>
    );
  }

  renderTank() {
    const { tankUI } = this.props;
    if (!tankUI) return;

    const { left, top, direction } = tankUI;
    return (
      <Style.GameUITank left={left} top={top} direction={direction}>
        <TankIcon width={UNION_SIZE} height={UNION_SIZE} />
      </Style.GameUITank>
    );
  }

  render() {
    return (
      <Style.GameUIContainer>{this.renderGameMap()}</Style.GameUIContainer>
    );
  }
}
