import Home from "pages/Home";
import NFTDetail from "pages/NFTDetail";
import NotFound from "pages/NotFound";
import Owner from "pages/Owner";

export const routes = [
  {
    path: "/",
    component: Home,
    exact: true,
  },
  {
    path: "/:account",
    component: Owner,
    exact: true,
  },
  {
    path: "/nft/:nftId",
    component: NFTDetail,
    exact: true,
  },
  {
    path: "*",
    component: NotFound,
  },
];
