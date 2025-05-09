import React from 'react';
 import { Routes, Route } from 'react-router-dom';
 import Dashboard from '../pages/Dashboard';
 import BackOffice from '../pages/BackOffice';
 import Data_Pages from '../pages/Data_Pages.jsx';
 import HorariosESGT from '../pages/HorariosESGT';
 import HorariosESTA from '../pages/HorariosESTA';
 import HorariosESTT from '../pages/HorariosESTT';
 

 
 
 
 const Router = () => {
   return (
     <Routes>
       {/* Rota inicial */}
       <Route path="/" element={<Dashboard />} />
       <Route path="/backoffice" element={<BackOffice />} />
 
       {/* Rotas para as páginas */}
       <Route path="/HorariosESGT" element={<HorariosESGT />} />
       <Route path="/HorariosESTA" element={<HorariosESTA />} />
       <Route path="/HorariosESTT" element={<HorariosESTT />} />
       <Route path="/backoffice/docentes" element={<Data_Pages />} />
       <Route path="/backoffice/cursos" element={<Data_Pages />} />
       <Route path="/backoffice/unidades-curriculares" element={<Data_Pages />} />
       <Route path="/backoffice/escolas" element={<Data_Pages />} />
       <Route path="/backoffice/salas" element={<Data_Pages />} />

     </Routes>
   );
 };
 
 export default Router;