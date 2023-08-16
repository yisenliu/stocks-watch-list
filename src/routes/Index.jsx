import { html } from '../../README.md';

export function Index() {
  // console.log('route: Index');
  return <div id="index" className="mx-auto prose" dangerouslySetInnerHTML={{ __html: html }}></div>;
}
