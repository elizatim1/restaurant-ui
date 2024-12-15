import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import NavBar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DishesPage from './pages/DishesPage';
import OrdersPage from './pages/OrdersPage';
import RestaurantsPage from './pages/RestaurantsPage';
import UsersPage from './pages/UsersPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { SnackbarProvider } from 'notistack';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#ff4081',
    },
  },
});

const App = () => {
  return (
    <SnackbarProvider maxSnack={5}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div id="root">
            <NavBar />
            <main>
              <Routes>
                {/* Публічний маршрут для логіну */}
                <Route path="/login" element={<LoginPage />} />

                {/* Захищені маршрути */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <HomePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dishes"
                  element={
                    <ProtectedRoute>
                      <DishesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrdersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/restaurants"
                  element={
                    <ProtectedRoute>
                      <RestaurantsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute>
                      <UsersPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </SnackbarProvider>
  );
};

export default App;
