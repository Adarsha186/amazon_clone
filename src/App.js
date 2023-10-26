import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Layout from './components/Layout';
import Login from './components/Login';
import { useEffect } from 'react';
import { auth } from './firebase';
import { useStateValue } from './StateProvider';
import Checkout from './components/Checkout';
import Payment from './components/Payment';
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import Orders from './components/Orders';

function App() {
  const promise = loadStripe('pk_test_51NxLzzDf2z7GOgEoNclos777YTGAqVH0ws5faSJTmtHHXAAVSDcGFcAb30SYYU71Avbszc5tIYAeOxhGLvFTFiZh00MQV2yhD4');
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      console.log(user)
      if (authUser) {
        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
  }, [dispatch, user]);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
          <Route path='/payment'
            element={
              <Layout>
                <Elements stripe={promise}>
                  <Payment />
                </Elements>
              </Layout>}
          />
          <Route path='/orders' element={<Layout><Orders /></Layout>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
