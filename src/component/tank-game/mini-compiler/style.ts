import styled from "styled-components";
const marginLeft = 40;
const linePadding = 11;

export const CompilerBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: auto;

  .compiler__container {
    position: relative;
    flex-grow: 1;
    margin: 20px 20px 0 ${marginLeft}px;

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
        background: #40a9ff;
      }
    }

    .container__input {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: transparent;
      color: transparent;
      /* color: red; */
      caret-color: black;
      border-color: black;

      &:hover, :focus {
        border-color: #40a9ff;
      }
    }
  }

  .compiler__btn-group {
    margin: 20px 0 20px 40px;

    & > button {
      margin-right: 20px; 
    }
  }
`;
