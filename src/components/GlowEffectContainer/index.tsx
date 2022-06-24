import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledBox = styled(Box)`
  position: relative;
  &:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -9px;
    top: 18px;
    background: linear-gradient(270deg, #0fffc1, #7e0fff);
    background-size: 200% 200%;
    filter: blur(72px);
    z-index: -1;
    animation: animateGlow 10s ease infinite;

    @keyframes animateGlow {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
  }
`;

export default function GlowEffectContainer({ children, ...rest }: any) {
  return <StyledBox {...rest}>{children}</StyledBox>;
}
