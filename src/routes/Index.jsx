import '@/index.sass';
import { html } from '../../README.md';

export default function Index() {
  return <div id="index" className="mx-auto prose" dangerouslySetInnerHTML={{ __html: html }}></div>;
}
