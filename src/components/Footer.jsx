import React from 'react';
import { Box, Typography, Link, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto', 
        backgroundColor: '#1976d2',
        color: '#fff',
        textAlign: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2">
          {'Copyright © '}
          <Link color="inherit" href="/">
            Restaurant Management
          </Link>{' '}
          {new Date().getFullYear()}.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Built with ❤️ using React and Material-UI
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
