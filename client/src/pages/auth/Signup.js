import React, { useState } from 'react';
import { Form, Input } from 'antd';
import axios from 'axios';
import { ContactsOutlined, KeyOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ErrorMessage, SuccessMessage } from '../../components/Messages/messages';
import { Loading } from '../../components/Loading/Loading';


export const Signup = (props) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState('');

  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confimPassword: '',
  });

  const { fullName, username, email, password } = userData;

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    })
  }


  const handleImageChange = (e) => {
    setFile(
      e.target.files[0]
    );
  }

  const onFinish = async (e) => {
    window.scrollTo(0, 0);
    setLoading(true);
    let data = new FormData();
    data.append('fullName', fullName);
    data.append('email', email);
    data.append('username', username);
    data.append('password', password);
    data.append('file', file);

    await axios.post('/api/users/signup', data).then(res => {
      setLoading(false);
      if (res.status === 200) {
        SuccessMessage(res.data.successMessage);
        setTimeout(() => {
          props.history.push('/login')

        }, 2000);
      }
      else if (res.status === 201) {
        ErrorMessage(res.data.ErrorMessageMessage);
      }
      else {
        ErrorMessage(res.data.errorMessage);
      }
    })

  };


  return (
    loading
      ?
      <Loading />
      :
      <div className='auth-form'>
        <div className='auth-form-inner'>
          <div className='signup-right text-center'>
            <div className='px-5'>
              <div className='mb-3 text-center ml-4'>
                <Link style={{ color: 'rgba(130, 36, 227, 0.8)', fontSize: '32px', fontWeight: '700', paddingBottom: '300px' }} to="/">Chat App</Link>
              </div>
              <p>Join gazillions of people online</p>
              <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
              >
                <div className="floating-label-group">
                  <Form.Item
                    name="Full Name"
                    rules={[{ required: true, message: 'Please input your Full Name!' }]}
                  >
                    <Input name='fullName' onChange={handleChange} size='small' placeholder="Full Name" prefix={<ContactsOutlined />} />
                  </Form.Item>
                </div>
                <div className="floating-label-group">
                  <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                  >
                    <Input name='username' type='text' onChange={handleChange} size="small" placeholder="Username" prefix={<UserOutlined />} />
                  </Form.Item>
                </div>
                <div className="floating-label-group">
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                      },
                      {
                        required: true,
                        message: 'Please input your E-mail!',
                      },
                    ]}
                  >
                    <Input name='email' onChange={handleChange} size='small' placeholder="Email" prefix={<MailOutlined />} />
                  </Form.Item>
                </div>
                <div className="floating-label-group">
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your password!',
                      },
                    ]}
                    hasFeedback
                  >
                    <Input.Password type='password' name='password' onChange={handleChange} size="small" placeholder="Password" prefix={<KeyOutlined />} />
                  </Form.Item>
                </div>
                <div className="floating-label-group">
                  <Form.Item
                    name="confirm"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: 'Please confirm your password!',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('The two passwords that you entered do not match!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password name='confimPassword' onChange={handleChange} size='small' placeholder="Re-Enter Password" prefix={<KeyOutlined />} />
                  </Form.Item>
                </div>
                <div className="floating-label-group my-3">
                  <label for="formFile" className="form-label mb-2 fw-bolder">Select profile picture</label>
                  <input className="form-control" type='file' name='file' onChange={handleImageChange} id="formFile" required />
                </div>
                <button type='submit' className='btn my-2 mt-3 w-100' style={{ padding: '10px', background: 'rgba(130, 36, 227, 0.8)', color: 'white', borderRadius: '23px' }}>
                  Create Account
                </button>
              </Form>
              <div className='mt-2'>
                <p>
                  Already Have Account? <Link to='/login' style={{ color: 'rgba(130, 36, 227, 0.8)', fontWeight: '631' }}>Login</Link>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
  );
};
