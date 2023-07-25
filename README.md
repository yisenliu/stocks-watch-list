# Stocks Watch List

自訂台股與美股上市公司股票與 ETF 觀察名單。

## Getting Started

### Create `.env` file

本例使用 [FinMind 開源資料 API](https://finmindtrade.com)，可免費註冊

```
VITE_FinMind_User_Id = Your_FinMind_User_Id
VITE_FinMind_Password = Your_FinMind_Password
```

### How to use

Install Dependencies

```bash
$ yarn install
```

Development

```bash
$ yarn dev
```

Production Build

```bash
$ yarn build
```

Production Preview

```bash
$ yarn preview
```

## Technology

- [Vite 4](https://vitejs.dev/)
- [React 18](https://react.dev/reference/react)
- [React Router 6](https://reactrouter.com/)
- [Tailwind CSS 3](https://tailwindcss.com) / SASS / PostCSS
- [MUI](https://mui.com/)
- [twin.macro](https://www.npmjs.com/package/twin.macro)
- [FindMind API](https://finmindtrade.com/)

## Features

- 串接 FinMind API，可自訂台股與美股上市公司股票與 ETF 觀察名單。
- 允許新增、刪除、排序觀察名單。
- 圖表化呈現股票在不同時間區間的表現；另外，台股可查詢上市公司與 ETF 近六年股利。

## Experience

- 股票觀察名單採用 `MUI DataGridPro` 協助自動排序與分頁，因其手動排序功能 `rowReordering` 並未支援行動裝置，暫不考慮使用，須仰賴第三方套件 `react-beautiful-dnd` 擴充其功能 (Drag and drop)，做法是在原始的 `<GridRow>` 外層加上一個 `<div>` 做為自訂的 `<DraggableGridRow>` 元件，由 `<DataGridPro>` 的 `slots` 與 `slotProps` 導入該元件。

  另一個使用 `<DataGridPro>` 的原因在於允許多選( `<DataGrid>` 只能單選)，利用此特性可同時移除多檔股票。

  > - `MUI DataGridPro` 內容豐富，本例只針對使用到的功能去研究，若要全盤深入熟悉，仍需多方嘗試各類應用。
  > - `react-beautiful-dnd` 目前(v13.1.1)不支援 `<React.StrictMode>`

- 使用 [vite-plugin-markdown](https://github.com/hmsk/vite-plugin-markdown) 將 README.md 轉換作為首頁內容時，若以 `Mode.REACT` 方式輸出，其中有一些特殊符號無法轉換，因此選擇 `Mode.HTML` 將 html 標籤連同內文輸出為純文字，結合 React `dangerouslySetInnerHTML` 即可完美轉換；官網介紹的設定有誤，此版本(2.1.0)須改成 `mdPlugin.plugin(options)`才有作用。

  ```js
  // vite.config.js
  plugins: [mdPlugin.plugin({ mode: ['html'] })];
  ```

- 在架構設計上將 `<Layout>` 內部區分為 `<Header>` 與 `<Main>` ， `<Header>` 為固定顯示的元件， `<Main>` 則用於載入 child route element, 由於 `<Header>` 提供股票搜尋並加入觀察名單的功能，其結果會影響 child route element 的內容，因此在 `<Header>` 與 `<Main>` 外層加上 `<StockContext.Provider>` 統一管理狀態，利用 `useContext` 讓所有的 child route element 都能取得即時狀態。

  之所以不考慮 `useOutletContext()` 是因為它只能取得 parent route 的狀態，並不適合多層 child route 的狀態傳遞，因此 `<Outlet />` 只用於切換 child route element，本身並不使用 `context` 傳遞狀態。

- 採用 SWC 取代 Babel
  > 或許是專案規模太小，無法確認編譯效能是否有顯著提升。
- twin.macro 這個工具雖然可以結合 tailwind css， styled-components 與 zero-runtime CSS-in-JS 特性，但面對複雜的 css，最好還是採用外部 css/sass/scss, 避免 jsx 內容太過冗長而難以閱讀(如果擔心命名重覆，可採用 CSS Modules)。
  > 以本專案的規模而言，嘗試的經驗遠大於實質意義。

## Browser Support

Mobile Browsers
