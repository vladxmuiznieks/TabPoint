import Homepage from './pages/Homepage.js';
import MenuItemPage from './pages/MenuItemPage.js';
import Sale from './pages/Sale.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import { UserProvider } from './UserContext.js';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TabList from './components/TabList.js';
import TabDetail from './components/TabDetails.js';
import TabForm from './components/TabForm.js';
import TablePlan from './components/TablePlan.js';

function App() {
  return (
    <>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <Homepage/>
              </ProtectedRoute>
            }/>
            <Route path="/menu" element={<MenuItemPage/>}/>
            <Route path="/sale" element={<Sale/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/table-plan" element={<TablePlan/>}/>
            <Route path="/tabs" element={<ProtectedRoute><TabList/></ProtectedRoute>}/>
            <Route path="/tabs/:id" element={<ProtectedRoute><TabDetail/></ProtectedRoute>}/>
            <Route path="/create-tab" element={<ProtectedRoute><TabForm/></ProtectedRoute>}/>
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </>
  );
}

export default App;

export function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if(token) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}
