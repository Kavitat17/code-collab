import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        console.log(id);
        toast.success('Created a new room')
    };

    const joinRoom = () =>{
        if(!roomId || !username){
            toast.error('Room ID and UserName is required');
            return;
        }
        //redirect
        navigate(`/editor/${roomId}`,{
            state: {
                username,  //ek route se dusre route ke andar data access kar rahe hai like jo username se ham es naye page pe aaye that username es page pe bhi dikna chahiye thats why
                //other options can be using local storage or passing in url and accessing etc

            }
        })
    }

    const handleInputEnter = (e) =>{
        if(e.code === 'Enter'){
            joinRoom();
        }
    }

    return (
        <div className="homePageWrapper">
            <div className="formWrapper">
                <img 
                    className="homePageLogo" 
                    src='/logo.png' 
                    alt="code-collab-logo"
                />
                <h4 className="mainLabel">Paste invitation Room ID</h4>
                <div className="inputGroup">
                    <input 
                        type="text" 
                        className="inputBox" 
                        placeholder='ROOM ID'
                        onChange={(e) => setRoomId(e.target.value)}
                        value={roomId}
                        //adding a listner since i want after pressing enter also we should navigate to next page for better user experience
                        onKeyUp={handleInputEnter}
                    />
                    <input 
                        type="text" 
                        className="inputBox" 
                        placeholder='User Name'
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        //adding a listner 
                        onKeyUp={handleInputEnter}
                    />

                    <button className='btn joinBtn' onClick={joinRoom}>Join</button>

                    <span className='createInfo'>
                        If you don't have an invite then create &nbsp;
                        <a 
                            onClick={createNewRoom} 
                            href="#"
                            className='createNewBtn'
                        >
                            new room
                        </a>
                    </span>
                </div>
            </div> 

            <footer>
                Built By <a 
                    href="https://www.linkedin.com/in/kavitathete/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="linkedin-link"
                >
                    Kavita Thete <i className="fab fa-linkedin"></i>
                </a>
            </footer>
        </div>
    );
};

export default Home;
