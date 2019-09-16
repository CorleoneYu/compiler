import styled from "styled-components";
const marginLeft = 40;
const linePadding = 11;

export const CompilerBox = styled.div`
  position: relative;

  .compiler__container {
    position: relative;
    margin-left: ${marginLeft}px;

    .container__div {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 4px ${linePadding}px;
      line-height: 1.5;

      .line {
        position: relative;

        .key-word {
          color: red;
        }

        .line__point {
          position: absolute;
          left: ${-marginLeft - linePadding}px;
          width: ${marginLeft}px;
          text-align: center;
        }
      }

      .current-line {
        background: red;
      }
    }

    .container__input {
      background: transparent;
      color: transparent;
      /* color: red; */
      caret-color: black;
    }
  }

  .compiler__btn {
    margin-top: 10px;
  }
`;
