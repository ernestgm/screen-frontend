import { Grid, Paper, Stack, Skeleton } from '@mui/material';
import React from 'react';

export default function TableSkeleton() {
  return (
    <>
      <Paper sx={{ p: 2, width: '100%' }}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={9} lg={9} />
          <Grid item xs={12} md={3} lg={3}>
            <Skeleton animation="wave" height={70} />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Skeleton animation="wave" height={50} />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-start">
              <Skeleton sx={{flexGrow: 1}} animation="wave" height={50} />
              <Skeleton sx={{flexGrow: 1}} animation="wave" height={50} />
              <Skeleton sx={{flexGrow: 1}} animation="wave" height={50} />
              <Skeleton sx={{flexGrow: 1}} animation="wave" height={50} />
              <Skeleton sx={{flexGrow: 1}} animation="wave" height={50} />
            </Stack>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-start">
              <Skeleton sx={{flexGrow: 1}} animation="wave" height={50} />
              <Skeleton sx={{flexGrow: 1}} animation="wave" height={50} />
              <Skeleton sx={{flexGrow: 1}} animation="wave" height={50} />
              <Skeleton sx={{flexGrow: 1}} animation="wave" height={50} />
              <Skeleton sx={{flexGrow: 1}} animation="wave" height={50} />
            </Stack>
          </Grid>
          <Grid item xs={12} md={8} lg={8} />
          <Grid item xs={12} md={4} lg={4}>
            <Skeleton animation="wave" height={30} />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}