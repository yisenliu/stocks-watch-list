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

- SPA
- 串接 FinMind API，可自訂台股與美股觀察名單。

## Experience

- 將 README.md 轉換成 React component 作為首頁內容。
- 在架構上將&lt;Layout&gt;內部區分為&lt;Header&gt;與&lt;Main&gt;，&lt;Header&gt;為固定顯示的元件，&lt;Main&gt;則用於載入 child route element, 由於&lt;Header&gt;提供股票搜尋並加入觀察清單的功能，其結果會影響 child route element 的內容，因此在&lt;Header&gt;與&lt;Main&gt;外層加上&lt;StockContext.Provider&gt;統一管理狀態，利用 useContext 讓所有的 child route element 都能取得狀態，之所以不考慮 useOutletContext() 是因為它只能取得 parent route 的狀態，並不適合多層 child route 的狀態傳遞，因此&lt;Outlet&gt;只用於切換 child route element，本身並不使用 context 傳遞狀態。

## Browser Support

Mobile Browsers
