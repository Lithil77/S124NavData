
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { OLMapProvider } from './Contexts/OlMapContext.jsx';
import { UtilityProvider } from './Contexts/UtilityContext.jsx';
import { ColorProvider } from './Contexts/ColorContext.jsx';
import './index.css';
import { ProductFilterProvider } from './Contexts/ProductFilterContext.jsx';
import { RTZFileProvider } from './Contexts/RTZFileContext.jsx';
import OlMap from './Components/Map/Controls/OlMap/OlMap';
import Home from './Components/Map/Controls/Home/Home';
import ZoomIn from './Components/Map/Controls/ZoomIn/ZoomIn';
import ZoomOut from './Components/Map/Controls/ZoomOut/ZoomOut';
<<<<<<< HEAD
import BaseMaps from './Components/Map/Controls/BaseMaps/BaseMaps';
import MousePosition from './Components/Map/Controls/MousePosition/MousePosition';
import ProductFilter from './Components/Map/Controls/ProductFilter/ProductFilter';
=======
<<<<<<< HEAD
import BaseMaps from './Components/Map/Controls/BaseMaps/BaseMaps';
import MousePosition from './Components/Map/Controls/MousePosition/MousePosition';
import ProductFilter from './Components/Map/Controls/ProductFilter/ProductFilter';
=======
<<<<<<< HEAD
import MousePosition from './Components/Map/Controls/MousePosition/MousePosition';
import BaseMaps from './Components/Map/Controls/BaseMaps/BaseMaps';
import ProductFilter from './Components/Map/Controls/ProductFilter/ProductFilter';
=======
>>>>>>> 54d46b511d9a59bb7bd731871fba1b1c9c5bb7f5
>>>>>>> ddde2ac67393345a1dbb6f98450501cf822e9435
>>>>>>> 14119d932fdbf441ac86d868da2f940a1bf1948c


function App() {

    const MapComponents = () => {
        return(
          <div>
                 <OlMap />
<Home />
<ZoomIn />
<ZoomOut />
<<<<<<< HEAD
<BaseMaps />
<MousePosition />
<ProductFilter />
=======
<<<<<<< HEAD
<BaseMaps />
<MousePosition />
<ProductFilter />
=======
<<<<<<< HEAD
<MousePosition />
<BaseMaps />
<ProductFilter />
=======
>>>>>>> 54d46b511d9a59bb7bd731871fba1b1c9c5bb7f5
>>>>>>> ddde2ac67393345a1dbb6f98450501cf822e9435
>>>>>>> 14119d932fdbf441ac86d868da2f940a1bf1948c
          </div>
        );
    };

    return (
        <>
        <ColorProvider>
            <OLMapProvider>
                <UtilityProvider>
                <ProductFilterProvider>
                <RTZFileProvider>
                     <Router>
                        <Routes>
                          <Route path="/" element={<MapComponents />} />
                          <Route path="/mainLayout/:projectName/:projectId" element={<MapComponents />} />
                          
                        </Routes>
                     </Router>
                </RTZFileProvider>
                </ProductFilterProvider>
                </UtilityProvider>
            </OLMapProvider>
        </ColorProvider>
        <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
        </>
    );
}
export default App;
        