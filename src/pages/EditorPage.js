import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import ACTIONS from '../Actions';
import Client from '../components/Client';
import Editor from '../components/Editor';
import Output from '../components/Output';
import { initSocket } from '../socket';
import { createSubmission, getSubmissionResult } from '../api';
import {
    useLocation,
    useNavigate,
    Navigate,
    useParams,
} from 'react-router-dom';

const EditorPage = () => {
    //initialization and storing ref banake of that socket connection
    const socketRef = useRef(null);
    const codeRef = useRef('');
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);

    const [result, setResult] = useState(null); // State to store the result
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleErrors(e) {
        console.log('socket error', e);
        toast.error('Socket connection failed, try again later.');
        reactNavigator('/');
    }

    //intialization
    useEffect(() => {
        const init = async () => {
            try{
                socketRef.current = await initSocket();
                //to handle error
                socketRef.current.on('connect_error', (err) => handleErrors(err));
                socketRef.current.on('connect_failed', (err) => handleErrors(err));

                //join wala is optional for like roomid send karne ke liye we are using it
                socketRef.current.emit(ACTIONS.JOIN, {
                    roomId,
                    username: location.state?.username, //jaise hi hamara socket init ho jata hai uske bad hame server pe ek event bhejni hai
                });
                //event hogi hamari join event 

                // Listening for joined event
                socketRef.current.on(
                    ACTIONS.JOINED, //and callback function
                    ({ clients, username, socketId }) => {
                        if (username !== location.state?.username) { //mujhe chodke baki sabko notify karna hai ki i am joined
                            toast.success(`${username} joined the room.`);
                            console.log(`${username} joined`);
                        }
                        //pushing every joined client using setClient
                        setClients(clients);

                        //when new client join uske code dikhna chahiye jo already bakione kiya hai 
                        //for that we have sync if we don't do this when new client join use uske code editor pe kuch nahi dikhega jab kuch aur add nahi karte existing user like anything . , 
                        //but hamara code to editor page ke andar nahi hai wo editor me hai for that we use useRef 
                        socketRef.current.emit(ACTIONS.SYNC_CODE, {
                            code: codeRef.current,
                            socketId,
                        });
                    }
                );

                // Listening for disconnected
                socketRef.current.on(
                    ACTIONS.DISCONNECTED,
                    ({ socketId, username }) => {
                        toast.success(`${username} left the room.`);
                        //jo nikal gaye unhe state se bhi nikalana current list
                        setClients((prev) => {
                            return prev.filter(
                                (client) => client.socketId !== socketId
                            );
                        });
                    }
                );
            } catch (error) {
                handleErrors(error);
            }
        };
        init();

        //we have used many listeners like .on so clean that
        return () => {
            //cleaning functions
            if(socketRef.current){
                socketRef.current.disconnect();
                socketRef.current.off(ACTIONS.JOINED);
                socketRef.current.off(ACTIONS.DISCONNECTED);
            }
            
        };
    }, [location.state?.username, reactNavigator, roomId]); //empty array nahi diya har ek render pe ye useEffect call hoga

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }

    function leaveRoom() {
        reactNavigator('/');
    }

    //for execution and result
    const executeCode = async () => {
        setIsSubmitting(true);
        try {
            const submission = await createSubmission(codeRef.current);
            const { token } = submission;

            // Polling for the result
            const intervalId = setInterval(async () => {
                const result = await getSubmissionResult(token);
                if (result.status.id >= 3) { // Status id 3 means it's completed
                    setResult(result);
                    clearInterval(intervalId);
                    setIsSubmitting(false);
                }
            }, 1000); // Adjust polling interval as needed
        } catch (error) {
            toast.error('Error executing code');
            console.error(error);
            setIsSubmitting(false);
        }
    };

    if (!location.state) {
        return <Navigate to="/" />;
    }

    // return (
    //     <div className="mainWrap">
    //         <div className="aside">
    //             <div className="asideInner">
    //                 <div className="logo">
    //                     <img
    //                         className="logoImage"
    //                         src="/code-sync.png"
    //                         alt="logo"
    //                     />
    //                 </div>
    //                 <h3>Connected</h3>
    //                 <div className="clientsList">
    //                     {clients.map((client) => (
    //                         <Client
    //                             key={client.socketId}
    //                             username={client.username}
    //                         /> //we are returning a component
    //                     ))}
    //                 </div>
    //             </div>
    //             <button className="btn copyBtn" onClick={copyRoomId}>
    //                 Copy ROOM ID
    //             </button>
    //             <button className="btn leaveBtn" onClick={leaveRoom}>
    //                 Leave
    //             </button>
    //             <button className="btn" onClick={executeCode} disabled={isSubmitting}>
    //                 {isSubmitting ? 'Running...' : 'Run Code'}
    //             </button>
    //             {result && (
    //                 <div className="result">
    //                     <h3>Result:</h3>
    //                     <pre>{atob(result.stdout || '')}</pre>
    //                     <pre>{atob(result.stderr || '')}</pre>
    //                     <pre>{result.exit_code === 0 ? 'Success' : 'Error'}</pre>
    //                 </div>
    //             )}
    //         </div>
    //         <div className="editorWrap">
    //             <Editor
    //                 socketRef={socketRef}
    //                 roomId={roomId}
    //                 onCodeChange={(code) => { //child component se ham parent component ko code pass kar rahe hai 
    //                 //we do this function ki help se
    //                     codeRef.current = code;
    //                 }}
    //             />
    //         </div>
    //     </div>
    // );

    return (
        <div className="mainWrap">
            <div className="aside">
                <div className="asideInner">
                    <div className="logo">
                        <img
                            className="logoImage"
                            src="/code-sync.png"
                            alt="logo"
                        />
                    </div>
                    <h3>Connected</h3>
                    <div className="clientList">
                        {clients.map((client) => (
                            <Client
                                key={client.socketId}
                                username={client.username}
                            />
                        ))}
                    </div>
                </div>
                <div className="asideFooter">
                    <button className="btn copyBtn" onClick={copyRoomId}>
                        Copy ROOM ID
                    </button>
                    <button className="btn leaveBtn" onClick={leaveRoom}>
                        Leave
                    </button>
                </div>
            </div>
            <div className="editorWrap">
                <div className="editorContainer">
                    <Editor
                        socketRef={socketRef}
                        roomId={roomId}
                        onCodeChange={(code) => { //child component se ham parent component ko code pass kar rahe hai 
                        //we do this function ki help se
                            codeRef.current = code;
                        }}
                    />
                </div>
                <div className="outputContainer">
                    <button className="runCodeBtn" onClick={executeCode} disabled={isSubmitting}>
                        {isSubmitting ? 'Running...' : 'Run Code'}
                    </button>
                    {result && (
                        <div className="result">
                            <h3>Result:</h3>
                            <pre>{atob(result.stdout || '')}</pre>
                            <pre>{atob(result.stderr || '')}</pre>
                            <pre>{result.exit_code === 0 ? 'Success' : 'Error'}</pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

};

export default EditorPage;