import{r as m,j as t,b as e}from"./vendor-262f8ba3.chunk.js";import{B as d,T as b,a as o,P as u}from"./Tab-bab14ce8.chunk.js";import{H as n}from"./index-1f49204e.chunk.js";import"./404-374073c5.js";import"./moment-e953ecbf.chunk.js";function y(){const[a,l]=m.useState(localStorage.getItem("crude_oil_prices_active_tab")||"Brent"),c={Brent:e(n,{dataset:"CrudeOilPrices",data_id:"Brent",maxKey:"price",minKey:"price",closeKey:"price",tooltipValueLabel:"價格"}),WTI:e(n,{dataset:"CrudeOilPrices",data_id:"WTI",maxKey:"price",minKey:"price",closeKey:"price",tooltipValueLabel:"價格"})};function s({component:r}){return c[r]}function p(r,i){l(i),localStorage.setItem("crude_oil_prices_active_tab",i)}return t(u,{name:"crude_oil_prices_portal",children:[e(d,{to:-1,title:"Crude Oil Price"}),t("div",{className:"min-h-full pb-8 bg-gray-900",children:[e("div",{className:"z-5 bg-primary sticky top-0 text-white",children:t(b,{value:a,onChange:p,TabIndicatorProps:{sx:{bgcolor:"white"}},textColor:"inherit","aria-label":"tabs for the crude oil",children:[e(o,{label:"Brent",value:"Brent",sx:{fontSize:16,textTransform:"capitalize"}}),e(o,{label:"WTI",value:"WTI",sx:{fontSize:16,textTransform:"capitalize"}})]})}),e("div",{"data-name":"tab-panel",className:"bg-gray-900 bg-gradient-to-b from-primary from-[60px] via-transparent via-[60px] pt-8 px-2",children:e(s,{component:a},a)})]})]})}export{y as CrudeOilPrices};