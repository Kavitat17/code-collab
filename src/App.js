import './App.css';
import{BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
      <>

        <div>
          <Toaster position='top-right'></Toaster>
        </div>

        {/* we have to wrap everything in BrowserRouter */}
        <BrowserRouter>
          {/* eske andar hame routes ki list karni hoti hai */}
          <Routes>
            {/* routes ke andar har ek route aayega like home page, editor page etc */}
            <Route path="/" element={<Home/>}></Route>
            <Route path="/editor/:roomId" element={<EditorPage/>}></Route>
          </Routes>
        </BrowserRouter>
        
      </>
  );
}

export default App;
