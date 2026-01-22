import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import InventoryList from './pages/InventoryList';
import AddItem from './pages/AddItem';
import EditItem from './pages/EditItem';

function App() {
    return (
        <Router>
            <div className="app">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/inventory" element={<InventoryList />} />
                    <Route path="/add-item" element={<AddItem />} />
                    <Route path="/edit-item/:id" element={<EditItem />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
