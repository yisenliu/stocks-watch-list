import tw, { css } from 'twin.macro';

const spin = css`
  ${tw`flex items-center justify-center my-4`}
  &::before {
    content: '';
    ${tw`animate-spin border-primary/40 border-t-primary border-3 w-4 h-4 mr-1 rounded-full`}
  }
`;
export default function Loading({ darkTheme = false }) {
  // console.log('component: Loading');
  return <p css={[spin, darkTheme && tw`text-white`]}>Loading...</p>;
}
