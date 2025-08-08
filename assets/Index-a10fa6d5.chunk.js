import{b as e}from"./vendor-262f8ba3.chunk.js";const n=`<h1>Stocks Watch List</h1>
<p>自訂台股與美股上市公司股票與 ETF 觀察名單。</p>
<h2>Getting Started</h2>
<ul>
<li>本專案使用 <a href="https://finmindtrade.com">FinMind 開源資料 API</a>，無需註冊即可免費使用 (API/下載限制 300 次 / 小時)。</li>
<li><a href="https://finmindtrade.com/analysis/#/Sponsor/sponsor" target="_blank">FinMind 使用權限說明</a></li>
</ul>
<h3>How to use</h3>
<p>Install Dependencies</p>
<pre><code class="language-bash">$ npm install | yarn install
</code></pre>
<p>Development</p>
<pre><code class="language-bash">$ npm run dev | yarn dev
</code></pre>
<p>Production Build</p>
<pre><code class="language-bash">$ npm run build | yarn build
</code></pre>
<p>Production Preview</p>
<pre><code class="language-bash">$ npm run preview | yarn preview
</code></pre>
<h2>Features</h2>
<ul>
<li>串接 FinMind API，可自訂台股與美股上市公司股票與 ETF 觀察名單。</li>
<li>允許新增、刪除、排序觀察名單。</li>
<li>圖表化呈現每一筆觀察名單在不同時間區間的表現</li>
<li>台股可查詢上市公司股票與 ETF 近五年股利。</li>
<li>與國際股市同採「綠漲紅跌」呈現數據變化。</li>
<li>台、美股市大盤指數，美國政府公債殖利率，黃金現貨、原油價格。</li>
</ul>
<h2>Experience</h2>
<ul>
<li>
<p>觀察名單採用 <code>MUI DataGridPro</code> 協助自動排序與分頁，因其手動排序功能 <code>rowReordering</code> 並未支援行動裝置，暫不考慮使用，須仰賴第三方套件 <code>react-beautiful-dnd</code> 擴充其功能 (Drag and drop)，做法是在原始的 <code>&lt;GridRow&gt;</code> 外層加上一個 <code>&lt;div&gt;</code> 做為自訂的 <code>&lt;DraggableGridRow&gt;</code> 元件，由 <code>&lt;DataGridPro&gt;</code> 的 <code>slots</code> 與 <code>slotProps</code> 導入該元件。</p>
<p>另一個使用 <code>&lt;DataGridPro&gt;</code> 的原因在於允許多選( <code>&lt;DataGrid&gt;</code> 只能單選)，利用此特性可同時移除多檔股票。</p>
<blockquote>
<ul>
<li><code>MUI DataGridPro</code> 內容豐富，本例只針對使用到的功能去研究，若要全盤深入熟悉，仍需多方嘗試各類應用。</li>
<li><code>react-beautiful-dnd</code> 目前(v13.1.1)不支援 <code>&lt;React.StrictMode&gt;</code></li>
</ul>
</blockquote>
</li>
<li>
<p>目前串接的 API 均為非即時性的資料，針對少量資料的串接使用自訂的 <code>useFetch.js</code> ，以 <code>new Map()</code>, <code>Storage</code> 作為 cache 以減少非必要的 request。另外，針對資料量大的串接結果則另以 <code>IndexedDB</code> 作為 cache。</p>
</li>
<li>
<p>在架構設計上將 <code>&lt;Layout&gt;</code> 內部區分為 <code>&lt;Header&gt;</code> 與 <code>&lt;Main&gt;</code> ， <code>&lt;Header&gt;</code> 為固定顯示的元件， <code>&lt;Main&gt;</code> 則用於載入 child route element, 由於 <code>&lt;Header&gt;</code> 提供股票搜尋並加入觀察名單的功能，其結果會影響 child route element 的內容，因此在 root route (<code>Dashboard.jsx</code>) 最外層加上 <code>&lt;StockContext.Provider&gt;</code> 統一管理狀態，利用 <code>useContext</code> 讓所有的 child route element 都能取得即時狀態。</p>
<p>不考慮 <code>useOutletContext()</code> 是因為它只能取得 parent route 的狀態，並不適合多層 child route 的狀態傳遞，因此 <code>&lt;Outlet /&gt;</code> 只用於切換 child route element，本身並不使用 <code>context</code> 傳遞狀態。</p>
</li>
<li>
<p>採用 SWC 取代 Babel</p>
<blockquote>
<p>或許是專案規模太小，無法確認編譯效能是否有顯著提升。</p>
</blockquote>
</li>
<li>
<p>twin.macro 這個工具雖然可以結合 tailwind css， styled-components 與 zero-runtime CSS-in-JS 特性，但面對複雜的 css，最好還是採用外部 css/sass/scss，避免 jsx 內容太過冗長而難以閱讀(如果擔心命名重覆，可採用 CSS Modules)。</p>
<blockquote>
<p>以本專案的規模而言，嘗試的經驗遠大於實質意義。</p>
</blockquote>
</li>
<li>
<p>使用 <a href="https://github.com/hmsk/vite-plugin-markdown">vite-plugin-markdown</a> 將 README.md 轉換作為首頁內容時，若以 <code>Mode.REACT</code> 方式輸出，其中有一些特殊符號無法轉換，因此選擇 <code>Mode.HTML</code> 將 html 標籤連同內文輸出為純文字，結合 React <code>dangerouslySetInnerHTML</code> 即可完美轉換；官網介紹的設定有誤，此版本(2.1.0)須改成 <code>mdPlugin.plugin(options)</code>才有作用。</p>
<pre><code class="language-js">// vite.config.js
plugins: [mdPlugin.plugin({ mode: ['html'] })];
</code></pre>
</li>
</ul>
<h2>Tech Stack</h2>
<ul>
<li><a href="https://vitejs.dev/">Vite 4</a></li>
<li><a href="https://react.dev/reference/react">React 18</a></li>
<li><a href="https://reactrouter.com/">React Router 6</a></li>
<li><a href="https://tailwindcss.com">Tailwind CSS 3</a> / SASS / PostCSS</li>
<li><a href="https://mui.com/">MUI</a></li>
<li><a href="https://finmindtrade.com/">FindMind API</a></li>
</ul>
<h2>Browser Support</h2>
<p>Modern Browsers</p>
`;function t(){return e("div",{id:"index",className:"mx-auto prose",dangerouslySetInnerHTML:{__html:n}})}export{t as Index};
