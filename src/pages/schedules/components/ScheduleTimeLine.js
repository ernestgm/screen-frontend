import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import { Stack, Typography } from '@mui/material';
import { Dvr, FormatColorTextOutlined, PlayArrow, Tv } from '@mui/icons-material';
import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

ScheduleTimeLine.propTypes = {
  schedules: PropTypes.array,
};
export default function ScheduleTimeLine({ schedules }) {
  // <TimelineDot color="success" sx={{ color: '#fff' }}>
  //   <PlayArrow />
  // </TimelineDot>
  return (
    <Timeline>
      {schedules.map((schedule) => {
        return (
          <TimelineItem key={schedule.id}>
            <TimelineOppositeContent color="text.secondary">
              <Stack direction="column" spacing={1}>
                <p>
                  <b>Start:</b> {dayjs(`2018-04-04T${schedule.start_time}`).format('hh:mm A')}
                </p>
                <p>
                  <b>End:</b> {dayjs(`2018-04-04T${schedule.end_time}`).format('hh:mm A')}
                </p>
              </Stack>
            </TimelineOppositeContent>
            <TimelineSeparator>
              {schedule.schedule_type === 'screen' && (
                <TimelineDot sx={{ color: '#000' }}>
                  <Tv sx={{ width: '20px', height: '20px' }} />
                </TimelineDot>
              )}
              {schedule.schedule_type === 'marquee' && (
                <TimelineDot sx={{ color: '#000' }}>
                  <FormatColorTextOutlined sx={{ width: '20px', height: '20px' }} />
                </TimelineDot>
              )}
              {schedule.schedule_type === 'all' && (
                <TimelineDot sx={{ color: '#000' }}>
                  <Dvr sx={{ width: '20px', height: '20px' }} />
                </TimelineDot>
              )}
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Stack direction="column" spacing={1}>
                {schedule.screen && (
                  <>
                    <img
                      width="100px"
                      src={schedule.screen && schedule.screen.images[0]?.image}
                      alt={'example'}
                      loading="lazy"
                    />
                    <Typography variant="body1" gutterBottom>
                      <b>name:</b> {schedule.screen.name}
                    </Typography>
                  </>
                )}
                {schedule.marquee && (
                  <Typography variant="body1" gutterBottom>
                    <b>marquee:</b> {schedule.marquee.name}
                  </Typography>
                )}
              </Stack>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}
