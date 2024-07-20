import react from 'react'
import { useState } from 'react'
import Client from '../components/Client';
import Editor from '../components/Editor';

const EditorPage = () =>{

    const [clients, setClients] = useState([
        {socketId:1, username:'rakesh'},
        {socketId:2, username:'kavita'},
    ]);

    return(
        <div className='mainWrap'>
            <div className='aside'>
                <div className='asideInner'>
                    <div className='logo'>
                        <img className='logoImage' src='/logo.png' alt='code collab logo'></img>
                    </div>
                    <div>Connected</div>
                    <div className='clientList'>
                        {
                            clients.map((client) => (
                                <Client 
                                    key={Client.socketId}
                                    username={client.username}
                                />  //we are returning a component
                            ))
                        }
                    </div>
                </div>

                <button className='btn copyBtn'>Copy ROOM ID</button>
                <button className='btn leaveBtn'>Leave</button>
            </div>

            <div className='editorWrap' style= {{background:"white"}}>
                <Editor/>
            </div>
        </div>
    )
}

export default EditorPage