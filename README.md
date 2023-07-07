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

- 股票觀察清單採用 `MUI DataGridPro` 協助自動排序與分頁，但它的手動排序功能 `rowReordering` 並未支援行動裝置，只好在其外層另外加上 `<div>` 利用 `useSwipeable` 額外控制手動排序，排序的過程則是直接操作 DOM Elements，待決定位置後再更新 state 。

  藉由 `<DataGridPro>` 允許多選的特性( `<DataGrid>` 只能單選)，可同時移除多檔股票。

  > `MUI DataGridPro` 內容很豐富，本例只針對使用到的功能去研究，若要全盤深入熟悉，仍需多多練習各類應用。

- 使用 [vite-plugin-markdown](https://github.com/hmsk/vite-plugin-markdown) 將 README.md 轉換作為首頁內容時，若以 `Mode.REACT` 方式輸出，其中有一些特殊符號無法轉換，因此選擇 `Mode.HTML` 將 html 標籤連同內文輸出為純文字，結合 React `dangerouslySetInnerHTML` 即可完美轉換；官網介紹的設定有誤，此版本須改成 `mdPlugin.plugin(options)`才有作用。

  ```js
  // vite.config.js
  plugins: [mdPlugin.plugin({ mode: ['html'] })];
  ```

- 在架構設計上將 `<Layout>` 內部區分為 `<Header>` 與 `<Main>` ， `<Header>` 為固定顯示的元件， `<Main>` 則用於載入 child route element, 由於 `<Header>` 提供股票搜尋並加入觀察清單的功能，其結果會影響 child route element 的內容，因此在 `<Header>` 與 `<Main>` 外層加上 `<StockContext.Provider>` 統一管理狀態，利用 `useContext` 讓所有的 child route element 都能取得即時狀態。

  之所以不考慮 `useOutletContext()` 是因為它只能取得 parent route 的狀態，並不適合多層 child route 的狀態傳遞，因此 `<Outlet />` 只用於切換 child route element，本身並不使用 `context` 傳遞狀態。

- 採用 SWC 取代 Babel
  > 或許是專案規模太小，無法確認編譯效能是否有顯著提升。
- twin.macro 這個工具雖然可以結合 tailwind css， styled-components 與 zero-runtime CSS-in-JS 特性，但面對複雜的 css，最好還是採用外部 css/sass/scss, 避免 jsx 內容太過冗長而難以閱讀(如果擔心命名重覆，可採用 CSS Modules)。
  > 以本專案的規模而言，嘗試的經驗遠大於實質意義。

## Browser Support

Mobile Browsers
