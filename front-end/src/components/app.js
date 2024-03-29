import React from 'react';
import { Router, Location, Redirect } from '@reach/router';
import ScrollToTopBtn from './menu/ScrollToTop';
import Header from './menu/header';
// import Home from './pages/home';
// import HomeGrey from './pages/homeGrey';
// import Home1 from './pages/home1';
// import Home1grey from './pages/home1Grey';
// import Home2 from './pages/home2';
// import Home2grey from './pages/home2Grey';
import Home3 from './pages/home3';
// import Home4 from './pages/home4';
// import Home5 from './pages/home5';
// import Home6 from './pages/home6';
import Explore from './pages/explore';
// import Exploregrey from './pages/exploreGrey';
// import Explore2 from './pages/explore2';
// import Explore2grey from './pages/explore2Grey';
// import ExploreOpensea from './pages/Opensea/explore';
// import Rangking from './pages/rangking';
// import RankingRedux from './pages/RankingRedux';
// import RankingReduxgrey from './pages/RankingReduxGrey';
// import Auction from './pages/Auction';
// import Auctiongrey from './pages/AuctionGrey';
import Helpcenter from './pages/helpcenter';
// import Helpcentergrey from './pages/helpcenterGrey';
// import Colection from './pages/colection';
// import Colectiongrey from './pages/colectionGrey';
// import ItemDetail from './pages/ItemDetail';
import ItemDetailRedux from './pages/ItemDetailRedux';
// import ItemDetailReduxgrey from './pages/ItemDetailReduxGrey';
import Author from './pages/Author';
// import AuthorGrey from './pages/AuthorGrey';
// import AuthorOpensea from './pages/Opensea/author';
// import Wallet from './pages/wallet';
// import WalletGrey from './pages/walletGrey';
import Login from './pages/login';
// import Logingrey from './pages/loginGrey';
// import LoginTwo from './pages/loginTwo';
// import LoginTwogrey from './pages/loginTwoGrey';
import Register from './pages/register';
// import Registergrey from './pages/registerGrey';
// import Price from './pages/price';
// import Works from './pages/works';
import News from './pages/news';
// import NewsSingle from './pages/newsSingle';
// import Create from './pages/create';
// import Creategrey from './pages/createGrey';
// import Create2 from './pages/create2';
// import Create3 from './pages/create3';
// import Createoption from './pages/createOptions';
// import Activity from './pages/activity';
// import Activitygrey from './pages/activityGrey';
import Contact from './pages/contact';
// import Contactgrey from './pages/contactGrey';
// import ElegantIcons from './pages/elegantIcons';
// import EtlineIcons from './pages/etlineIcons';
// import FontAwesomeIcons from './pages/fontAwesomeIcons';
// import Accordion from './pages/accordion';
// import Alerts from './pages/alerts';
// import Progressbar from './pages/progressbar';
// import Tabs from './pages/tabs';
// import Minter from './pages/Minter';
// import Mintergrey from './pages/MinterGrey';
import auth from '../core/auth';
import Profile from './pages/Profile';
// import Portfilo from "./pages/portfilo";

import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    scroll-behavior: unset;
  }
`;

export const ScrollTop = ({ children, location }) => {
  React.useEffect(() => window.scrollTo(0,0), [location])
  return children
}

const PosedRouter = ({ children }) => (
  <Location>
    {({ location }) => (
      <div id='routerhang'>
        <div key={location.key}>
          <Router location={location}>
            {children}
          </Router>
        </div>
      </div>
    )}
  </Location>
);

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const isAuth = auth.getToken() !== null;
  
  return (
      isAuth ? <Component {...rest} /> : <Redirect from="" to="/login" noThrow />
  )
};

const app = () =>{
  return (
    <div className="wraper">
    <GlobalStyles />
      <Header/>
        <PosedRouter>
        <ScrollTop path="/">
        <ProtectedRoute component={Home3}  path="/"/>
        <ProtectedRoute component={Explore} path="/explore"/>
        <ProtectedRoute component={Helpcenter} path="/helpcenter"/>
        <ProtectedRoute component={ItemDetailRedux} path="/ItemDetail/:nftId"/>
        <ProtectedRoute component={News} path="/news"/>
        <ProtectedRoute component={Author} path="/Author/:authorId"/>
        <ProtectedRoute component={Profile} path="/Profile/:authorId"/>
        <ProtectedRoute component={Contact} path="/contact"/>
        <Register path="/register" />
        <Login path="/login" />

          {/* <Home3 exact path="/">
            <Redirect to="/home3" />
          </Home3> */}
          {/* <HomeGrey path="/homeGrey" />
          <Home1 path="/home1" />
          <Home1grey path="/home1Grey" />
          <Home2 path="/home2" />
          <Home2grey path="/home2Grey" />
          <Home3 path="/home3" />
          <Home4 path="/home4" />
          <Home5 path="/home5" />
          <Home6 path="/home6" /> */}
          {/* <Explore path="/explore" /> */}
          {/* <Exploregrey path="/exploreGrey" /> */}
          {/* <Explore2 path="/explore2" /> */}
          {/* <Explore2grey path="/explore2Grey" />
          <ExploreOpensea path="/exploreOpensea" /> */}
          {/* <RankingRedux path="/rangking" />
          <RankingReduxgrey path="/rangkingGrey" />
          <Auction path="/Auction" />
          <Auctiongrey path="/AuctionGrey" /> */}
          {/* <Helpcenter path="/helpcenter" /> */}
          {/*<Portfilo path="/portfilo"/>*/}
          {/* <Colection path="/colection/:collectionId" /> */}
          {/* <Helpcentergrey path="/helpcenterGrey" />
          <Colection path="/colection/:collectionId" />
          <Colectiongrey path="/colectionGrey/:collectionId" /> */}
          {/* <ItemDetailRedux path="/ItemDetail/:nftId" /> */}
          {/* <ItemDetailReduxgrey path="/ItemDetailGrey/:nftId" /> */}
          {/* 
            PROTECTED ROUTE :
            you can use this to protect your route, user must login first to access
           */}
          
          {/* 
          <Author path="/Author/:authorId" /> 
          */}
          {/* <AuthorGrey path="/AuthorGrey/:authorId" /> */}
          {/* <AuthorOpensea path="/AuthorOpensea" /> */}
          {/* <Wallet path="/wallet" /> */}
          {/* <WalletGrey path="/walletGrey" /> */}
          
          {/* <Logingrey path="/loginGrey" /> */}
          {/* <LoginTwo path="/loginTwo" />
          <LoginTwogrey path="/loginTwoGrey" />
          <Register path="/register" />
          <Registergrey path="/registerGrey" />
          <Price path="/price" />
          <Works path="/works" /> */}
          {/* <News path="/news" /> */}
          {/* <NewsSingle path="/news/:postId" /> */}
          {/* <Create path="/create" /> */}
          {/* <Creategrey path="/createGrey" />
          <Create2 path="/create2" />
          <Create3 path="/create3" />
          <Createoption path="/createOptions" />
          <Activity path="/activity" />
          <Activitygrey path="/activityGrey" /> */}
          {/* <Contact path="/contact" /> */}
          {/* <Contactgrey path="/contactGrey" /> */}
          {/* <ElegantIcons path="/elegantIcons" />
          <EtlineIcons path="/etlineIcons" /> */}
          {/* <FontAwesomeIcons path="/fontAwesomeIcons" /> */}
          {/* <Accordion path="/accordion" />
          <Alerts path="/alerts" /> */}
          {/* <Progressbar path="/progressbar" /> */}
          {/* <Tabs path="/tabs" />
          <Minter path="/mint" />
          <Mintergrey path="/minter" /> */}
          </ScrollTop>
        </PosedRouter>
      <ScrollToTopBtn />
    </div>
  );
} 
export default app;