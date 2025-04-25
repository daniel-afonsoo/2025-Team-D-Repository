import React from 'react';
 import { Routes, Route } from 'react-router-dom';
 import Dashboard from '../pages/Dashboard';
 import HorariosESGT from '../pages/HorariosESGT';
 import HorariosESTA from '../pages/HorariosESTT';
 import HorariosESTT from '../pages/HorariosESTA';
 

 
 
 
 const Router = () => {
   return (
     <Routes>
       {/* Rota inicial */}
       <Route path="/" element={<Dashboard />} />
 
       {/* Rotas para as páginas */}
       <Route path="/HorariosESGT" element={<HorariosESGT />} />
       <Route path="/HorariosESTA" element={<HorariosESTA />} />
       <Route path="/HorariosESTT" element={<HorariosESTT />} />
     </Routes>
   );
 };
 
 export default Router;