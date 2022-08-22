import { Comment, Avatar } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../auth/auth'


export const ChatLayout = (props) => {
  const user = isAuthenticated();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllUsers();
    return () => {

    }
  }, []);


  const getAllUsers = async () => {
    await axios.get('/api/users/get', {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).then(res => {
      const filteringUsers = res.data.filter(filUser => filUser._id !== user._id);
      setUsers(filteringUsers);
    })
  }


  return (
    <div>
      {
        props.usersSide ?
          <>
            <div>
              <div className='row'>
                <div className='col-md-3 col-lg-3 col-sm-3 col-3'>
                  <div style={{ height: '82vh', overflowY: 'auto', position: 'fixed', width: '25%' }}>
                    <div>
                      {
                        users.map(user => {
                          return (
                            <Link to={'/chat/' + user._id}>
                              <Comment style={{ borderTop: '1px solid #eaeaec' }}
                                author={<h6>{user.fullName}</h6>}
                                avatar={
                                  <Avatar
                                    src={user.image}
                                    alt={user.username}
                                  />
                                }
                              />
                            </Link>
                          )
                        })
                      }
                    </div>
                  </div>
                </div>
                <div className='col-md-9 col-lg-9 col-9' style={{ borderCollapse: 'collapse', position: 'relative', height: '100vh' }}>
                  {props.children}
                </div>
              </div>
            </div>
          </>
          :
          props.children
      }

    </div>
  )
}
