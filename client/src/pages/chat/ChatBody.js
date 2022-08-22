import { UploadOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Comment, Input, Tooltip } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import io from "socket.io-client";
import { ChatLayout } from '../../components/chat/ChatLayout';
import { isAuthenticated } from '../../components/auth/auth';


let socket;
export const ChatBody = (props) => {
  const receiver = props.match.params.id;
  const user = isAuthenticated();
  const [chatMessage, setChatMessage] = useState("");
  const [getMessage, setGetMessage] = useState([]);
  const [typingMessage, setTypingMessage] = useState('');
  const [onlineMessage, setOnlineMessage] = useState('');
  const [receiverHeader, setReceiverHeader] = useState({});
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState('');
  let ENDPOINT;
  if (process.env.NODE_ENV === 'production') {
    ENDPOINT = "https://chat-app-kat.herokuapp.com/";
  }
  else {
    ENDPOINT = "http://localhost:8000";
  }


  const onChange = e => {
    setChatMessage(e.target.value);
  };


  const getSpecificUserChat = async () => {
    await axios.post(`/api/chats/ind-chat`, { userId: user._id, receiverId: receiver }, {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).then(res => {
      if (res.status === 200) {
        setGetMessage(res.data.result);
      }
      else {
        setGetMessage('');
      }
    })
  }

  const getUserById = async () => {
    await axios.get(`/api/users/get/${receiver}`).then(res => {
      setReceiverHeader(res.data);
    })
  }

  const scrolltobottom = () => {
    var myDiv = document.getElementById("myDiv");
    myDiv.scrollIntoView({ behavior: 'smooth' });
  }



  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit("join", { userId: user._id, username: user.username }, () => {

    });

    socket.emit('Get Online Status', { receiver });

    socket.on("Outputting Online Status", online => {
      setOnlineMessage(online);
    });

    socket.on("outputting typing", typing => {
      if (typing.receiver === user._id && typing.sender === receiver) {
        setTypingMessage(typing.status);
      } else {
        setTypingMessage("");
      }
    });

    socket.on("Output Chat Message", messageFromBackend => {
      console.log(messageFromBackend)
      if (messageFromBackend.receiver === user._id && messageFromBackend?.sender?._id === receiver) {
        setGetMessage(getMessage => [...getMessage, messageFromBackend])
      } else if (messageFromBackend?.sender?._id === user._id) {
        setGetMessage(getMessage => [...getMessage, messageFromBackend])
      }
      if (messageFromBackend.receiver === user._id && messageFromBackend?.sender?._id === receiver) {
        scrolltobottom();
      }
      if (messageFromBackend?.sender?._id === isAuthenticated()._id) {
        scrolltobottom();
      }
    });

    return () => {
    }
  }, [ENDPOINT]);

  useEffect(() => {
    getSpecificUserChat();
    getUserById();
    scrolltobottom();
    socket.emit('Get Online Status', { receiver });
    return () => {

    }
  }, [receiver]);


  const submitChatHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTypingMessage("");
    let type = "Text";
    chatMessage &&
      await socket.emit("Input Chat Message", {
        message: chatMessage,
        userId: user._id,
        username: user.username,
        receiver: receiver,
        nowTime: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
        type
      });
    setChatMessage("");
    scrolltobottom();
    setLoading(false);

  }

  setTimeout(() => {
    setTypingMessage("");
  }, 2000);

  const showTypingMessage = async () => {
    socket.emit("The user is typing....", {
      username: user.username,
      receiver: receiver
    });
  }



  const handleImageChange = (e) => {
    setFile(
      e.target.files[0]

    )
  }
  const UploadImage = () => {
    setLoading(true);
    let data = new FormData();
    data.append('file', file);
    let type = "VideoOrImage"
    axios.post('/api/chats/upload-image', data, {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).then(res => {
      if (res.status === 200) {
        socket.emit("Input Chat Message", {
          message: res.data.url,
          cloudinary_id: res.data.id,
          userId: user._id,
          username: user.username,
          receiver: receiver,
          nowTime: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
          type
        });

        setFile('');
        setLoading(false);
      }
    });
  }

  return (
    <ChatLayout usersSide>
      <div className='chat-body' style={{ position: 'relative' }}>
        <div className='header-avatar px-2' style={{ background: 'whitesmoke', position: 'fixed', width: '100%' }}>
          <Comment
            author={<h6 className='mt-1'>{receiverHeader.fullName}</h6>}
            avatar={
              <Avatar
                src={receiverHeader.image}
                alt={receiverHeader.username}
              />
            }
            content={
              typingMessage ?
                <p>
                  {typingMessage}
                </p>
                :
                <p>
                  {onlineMessage}
                </p>
            }
          />
        </div>
      </div>
      <div>
        <div style={{ overflowX: 'hidden', height: '67vh', overflowY: 'auto', marginTop: '223px' }}>
          {
            getMessage && getMessage.map(chat => {
              return (
                <Comment key={chat._id} className={chat.sender._id === user._id ? 'sender-chat' : 'w-50'}
                  author={<h6>{chat.sender.fullName}</h6>}
                  avatar={
                    <Avatar
                      src={chat.sender.image}
                      alt={chat.sender.username}
                    />
                  }
                  content={
                    chat.message.substring(0, 6) === "http:/" ?
                      chat.message.substring(chat.message.length - 3, chat.message.length) === "mp4" ?
                        chat.sender._id === user._id ?
                          <video style={{ maxWidth: '200px' }} src={chat.message} controls alt='video' type="video/mp4" />
                          :
                          <video style={{ maxWidth: '200px' }} src={chat.message} controls alt='video' type="video/mp4" />
                        :
                        chat.sender._id === user._id ?
                          <img src={chat.message} alt='image' style={{ maxWidth: '200px' }} />
                          :
                          <img src={chat.message} alt='image' style={{ maxWidth: '200px' }} />

                      :
                      chat.sender._id === user._id ?
                        <Link className='text-dark'>
                          {chat.message}
                        </Link>
                        :
                        <p>
                          {chat.message}
                        </p>
                  }
                  datetime={
                    <span>
                      {
                        moment(chat.timeOfSending, 'dddd, MMMM Do YYYY, h:mm:ss a').fromNow()
                      }

                    </span>
                  }

                />
              )
            })
          }
          <div id='myDiv'>
          </div>
        </div>
        <div className='p-2' style={{ position: 'sticky', bottom: '0px', background: 'lightgray' }}>
          <div className='d-flex'>
            <Input onKeyPress={() => showTypingMessage()} style={file ? { width: '73%' } : { width: '82%' }} value={chatMessage} placeholder="Type message here..." allowClear onChange={onChange} />
            <input id="actual-btn" type="file" name='file' multiple onChange={handleImageChange} hidden />
            <label for="actual-btn" className='px-4'><Tooltip title='Choose File'><UploadOutlined style={{ fontSize: '23px', cursor: 'pointer' }} /></Tooltip></label>
            {
              file ?
                <Button type='primary' loading={loading} onClick={UploadImage}>{loading ? <span>Sending</span> : <span>Send File</span>}</Button>
                :
                <Button type='primary' loading={loading} onClick={submitChatHandler}><SendOutlined /></Button>

            }
          </div>
        </div>
      </div>
    </ChatLayout >
  )
}
