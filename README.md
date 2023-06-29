# Stock Market

股市觀察站，自訂台股與美股觀察名單。

## Getting Started

### .env

#### 本例使用 [FinMind 開源資料 API](https://finmindtrade.com)，可免費註冊

```
VITE_FinMind_User_Id = Your_FinMind_User_Id
VITE_FinMind_Password = Your_FinMind_Password
```

### Install and Run

```bash
# install dependencies
$ yarn install

# development
$ yarn dev

# build for production
$ yarn build

# preview for production
$ yarn preview
```

## Technology

- [Vite 4](https://vitejs.dev/)
- [React 18](https://react.dev/reference/react)
- [React Router 6](https://reactrouter.com/)
- [Tailwind CSS 3](https://tailwindcss.com) / SASS / PostCSS
- [MUI](https://mui.com/)
- [twin.macro](https://www.npmjs.com/package/twin.macro)
- [FindMind](https://finmindtrade.com/)

## Features

- 串接 FinMind API，可自訂台股與美股觀察名單。

## Experience

- 使用 [vite-plugin-markdown](https://github.com/hmsk/vite-plugin-markdown) 將 README.md 轉換作為首頁內容時，必須以 &lt;React component /&gt; 方式輸出，若選擇 Mode.HTML 只會將 html 標籤連同內文輸出為純文字，且官網介紹的設定有誤，須改成 mdPlugin.plugin(options)。
- 在架構上將&lt;Layout&gt;內部區分為&lt;Header&gt;與&lt;Main&gt;，&lt;Header&gt;為固定顯示的元件，&lt;Main&gt;則用於載入 child route element, 由於&lt;Header&gt;提供股票搜尋並加入觀察清單的功能，其結果會影響 child route element 的內容，因此在&lt;Header&gt;與&lt;Main&gt;外層加上&lt;StockContext.Provider&gt;統一管理狀態，利用 useContext 讓所有的 child route element 都能取得狀態，之所以不考慮 useOutletContext() 是因為它只能取得 parent route 的狀態，並不適合多層 child route 的狀態傳遞，因此&lt;Outlet&gt;只用於切換 child route element，本身並不使用 context 傳遞狀態。
- 採用 SWC 取代 Babel，或許是專案規模太小，無法確認編譯效能是否有顯著提升。
- twin.macro 這個工具雖然可以結合 tailwind css， styled-components 與 zero-runtime CSS-in-JS 特性，但面對複雜的 css，最好還是採用外部 css/sass/scss, 避免 jsx 內容太過冗長而難以閱讀。

## Browser Support

Mobile Browsers
