import React from 'react'
import { Box, Typography, Divider } from '@mui/material';
import colors from 'app/style/Colors';

function UserDraft() {
  return (
    <Box sx={{ mb: 2, p: 3, m: 3, borderRadius: "10px", bgcolor: colors.white, boxShadow: "rgb(159 162 191 / 18%) 0px 9px 16px, rgb(159 162 191 / 32%) 0px 2px 2px" }}>
      <Typography variant="h5" sx={{ my: 2, fontWeight: "bold", color: colors.primary }}>My Draft</Typography>
      <Divider sx={{ mb: 2.5, mt: 1 }} />
    </Box>
  )
}

export default UserDraft