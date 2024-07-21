import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';

const Editor = ({ socketRef, roomId, onCodeChange }) => {
//since hame ek code sabko same dikhana hai we will need to add event listener to capture what we are typing
//uske liye pehle hame jo editor hamne banaya hai use kahi to store karna hoga
//uske liye we use useRef
    const editorRef = useRef(null);
    useEffect(() => {
        async function init() {
            editorRef.current = Codemirror.fromTextArea(
            //since we are converting textarea 
            //fromTextArea method from codemirror
                document.getElementById('realtimeEditor'),
                {
                    //for configuring additional options like setting lang theame mode etc
                    mode: { name: 'javascript', json: true },
                    theme: 'dracula',
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                }
            );

            editorRef.current.on('change', (instance, changes) => {
                console.log('changes', changes);
                const { origin } = changes; //in origin we gat value like cut paste or add setvalue basically what we have done in editor
                const code = instance.getValue();
                console.log(code);
                onCodeChange(code); // jaise hi koi code type karega wo code update hoga
                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code, //code jo change hua hai
                    });
                }
                console.log(code);
            });
        }
        init();
    }, []);

    // useEffect(() => {
    //     if (socketRef.current) {
    //         socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
    //             console.log('receiving',code);
    //             if (code !== null) {
    //                 editorRef.current.setValue(code);
    //             }
    //         });
    //     }

    //     return () => {
    //         socketRef.current.off(ACTIONS.CODE_CHANGE);
    //     };
    // }, [socketRef.current]);

    useEffect(() => {
        const handleCodeChange = ({ code }) => {
            if (code !== null && editorRef.current) {
                editorRef.current.setValue(code);
            }
        };

        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.off(ACTIONS.CODE_CHANGE, handleCodeChange);
            }
        };
    }, [socketRef.current]);

    return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;