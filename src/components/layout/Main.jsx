import tw from 'twin.macro';

const Main = tw.main`flex-grow p-4`;

export default function main({ children }) {
  return <Main>{children}</Main>;
}
