import React, { useState } from 'react';
import { Input } from 'antd';
import { KeyOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { isAuthenticated, setAuthentication } from '../../components/auth/auth';
import { ErrorMessage, SuccessMessage } from '../../components/Messages/messages';
import { Loading } from '../../components/Loading/Loading';

export const Login = (props) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    email: '',
    password: '',

  });

  const { email, password } = userData;

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  }

  const submitHandler = async () => {
    window.scrollTo(0, 0);
    setLoading(true);
    await axios.post('/api/users/login', { email, password }).then(res => {
      setLoading(false);
      if (res.status === 200) {
        setAuthentication(res.data, res.data.token);
        SuccessMessage(res.data.successMessage);
        props.history.push('/');
        window.location.reload();
      }
      else if (res.status === 201) {
        ErrorMessage(res.data.errorMessage);
      }
      else {
        ErrorMessage(res.data.errorMessage);
      }
    })

  };


  return (
    <div>
      {
        !isAuthenticated() ?
          loading
            ?
            <Loading />
            :
            <>
              <div className='auth-form'>
                <div className='auth-form-inner'>
                  <div style={{ padding: '60px' }}>
                    <div className='login-right text-center'>
                      <div>
                        <div className='mb-3 text-center ml-4'>
                          <Link style={{ color: 'rgba(130, 36, 227, 0.8)', fontSize: '32px', fontWeight: '700', paddingBottom: '300px' }} to="/">Chat App</Link>
                        </div>
                        <p className='mb-2' style={{ fontSize: '20px', fontWeight: '680', color: '#424553' }}>Welcome!</p>
                        <p>Join gazillions of people online</p>
                        <form onSubmit={submitHandler}>
                          <div className="floating-label-group mb-3">
                            <Input name='email' onChange={handleChange} size='small' placeholder="Email or Username" prefix={<UserOutlined />} />
                          </div>
                          <div className="floating-label-group">
                            <Input.Password name='password' type='password' onChange={handleChange} size="small" placeholder="Password" prefix={<KeyOutlined />} />
                          </div>
                          <button type='submit' className='btn my-2 mt-3 w-100' style={{ padding: '10px', background: 'rgba(130, 36, 227, 0.8)', color: 'white', borderRadius: '23px' }}>
                            Login
                          </button>
                        </form>
                        <div className='mt-2'>
                          <p>
                            New to <strong>Chat App?</strong> <Link to='/signup' style={{ color: 'rgba(130, 36, 227, 0.8)', fontWeight: '631' }}>Register</Link>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          :
          <div className='text-center' style={{ marginTop: '50vh' }}>
            <h4>
              <LoginOutlined /> <br />
              You are already Logged in!
            </h4>
            <Link to='/' className='btn my-2 mt-2' style={{ width: '202px', background: 'rgba(130, 36, 227, 0.8)', color: 'white' }}>Go to Home</Link>
          </div>

      }
    </div>

  );
}
