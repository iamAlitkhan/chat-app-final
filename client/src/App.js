import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Chat } from './pages/chat/Chat';
import { ChatBody } from './pages/chat/ChatBody';
import './index.css'
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { Navbar } from './components/nav/Navbar';
import UserRoute from './routes/UserRoute';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <div>
          <Navbar />
          <div style={{ marginTop: '100px' }}>
            <Switch>
              <Route exact path='/login' component={Login} />
              <Route exact path='/signup' component={Signup} />
              <UserRoute exact path='/' component={Chat} />
              <UserRoute exact path='/chat/:id' component={ChatBody} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </div>

  )
}

export default App;