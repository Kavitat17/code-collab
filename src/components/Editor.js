import React, { useEffect } from "react";
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';  //for configuring additional options
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets'

const Editor = () =>{
    useEffect(()=>{
        //ye hame call karna hai bs ek bar jab ye component render hota hai
        async function init(){
            //since we are converting textarea 
            //fromTextArea method from codemirror
            Codemirror.fromTextArea(document.getElementById('realtimeEditor'),{
                //for configuring additional options like setting lang theame mode etc
                mode: {name: 'javascript', json:true},
                theme: 'dracula',
                autoCloseTags:true,
                autoCloseBrackets:true,
                lineNumbers:true,
            });
        }
        init();
    },[])
    return(
        <textarea id="realtimeEditor"></textarea>
    )
}

export default Editor;
