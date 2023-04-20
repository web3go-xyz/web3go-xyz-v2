import styled from "@emotion/styled";
import { color } from "metabase/lib/colors";
import Icon from "metabase/components/Icon";

export const LegendCaptionRoot = styled.div`
  position:relative;
  display: flex;
  align-items: center;
  min-width: 0;
`;
export const OperationWrap = styled.div`
  position:absolute;
  right:-5px;
  top:50%;
  transform:translateY(-50%);
  cursor: pointer;
  &:hover{
    background: var(--global-plain-btn-hover-bg);
    border-radius: 4px;
  }
`;

export const LegendLabel = styled.div`
  color: ${color("text-dark")};
  font-weight: bold;
  cursor: ${({ onClick }) => (onClick ? "pointer" : "")};
  overflow: hidden;

  &:hover {
    color: ${({ onClick }) => (onClick ? color("brand") : "")};
  }
`;

export const LegendLabelIcon = styled(Icon)`
  padding-right: 0.25rem;
`;

export const LegendDescriptionIcon = styled(Icon)`
  color: ${color("text-medium")};
  margin-left: 0.5rem;
`;

LegendDescriptionIcon.defaultProps = {
  name: "info",
};
