import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { color } from "metabase/lib/colors";
export interface DashCardRootProps {
  isNightMode: boolean;
}

export const DashCardRoot = styled.div<DashCardRootProps>`
  background-color: ${color("white")};

  ${({ isNightMode }) =>
    isNightMode &&
    css`
      border-color: ${color("bg-night")};
      background-color: ${color("bg-night")};
    `}
`;
export const WaterMark = styled.div`
background-image: url(${require('@/web3goLayout/assets/dashboard/logo.png')});
background-position: 50%;
background-repeat: no-repeat;
background-size: 40%;
color: rgba(203,203,255,.5);
content: " ";
display: block;
font-size: 18px;
height: 100%;
line-height: 100%;
pointer-events: none;
position: absolute;
text-align: center;
user-select: none;
width: 100%;
z-index: 9999;
`;