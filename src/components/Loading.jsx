import tw, { css } from 'twin.macro';

const spin = css`
  ${tw`flex items-center justify-center m-4 text-white`}
  &::before {
    content: '';
    ${tw`animate-spin border-primary/40 border-t-primary border-3 w-4 h-4 mr-1 rounded-full`}
  }
`;
export default function Loading() {
  // console.log('component: Loading');
  return <p css={spin}>Loading...</p>;
}
