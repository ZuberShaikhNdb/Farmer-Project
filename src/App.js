import './App.css';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import SingUp from './component/Login-SingUp';
import Home from './component/Home';
import SellProductForm from './component/Sell';
import BuyProducts from './component/Buy';



function App() {
  return (
  <>
    
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<SingUp/>}></Route>
          <Route path='/home' element={<Home/>}></Route>
          <Route path='/sell' element={<SellProductForm/>}></Route>
          <Route path='/buy' element={<BuyProducts/>}></Route>
        </Routes>
    </BrowserRouter>

  </>
   
   
  );
}

export default App;
