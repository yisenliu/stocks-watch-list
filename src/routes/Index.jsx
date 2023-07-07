import '@/index.sass';
import { html } from '../../README.md';

export default function Index() {
  return <div id="index" className="prose" dangerouslySetInnerHTML={{ __html: html }}></div>;
}
