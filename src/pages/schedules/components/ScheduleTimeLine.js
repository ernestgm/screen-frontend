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
import { Dvr, FormatColorTextOutlined, Tv } from '@mui/icons-material';
import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import palette from '../../../theme/palette';

ScheduleTimeLine.propTypes = {
  schedules: PropTypes.array,
};
export default function ScheduleTimeLine({ schedules }) {
  const getActiveColor = (startTime, endTime) => {
    const activeColors = {
      bg: palette.success.dark,
      text: palette.common.white,
    };

    const inactiveColors = {
      bg: palette.grey.A100,
      text: palette.common.black,
    };

    dayjs.extend(isBetween);

    const isActive = dayjs(new Date()).isBetween(startTime, endTime, 'hour', '[)');

    // To use `year` granularity pass the third parameter
    return isActive ? activeColors : inactiveColors;
  };

  return (
    <Timeline>
      {schedules
        .sort((a, b) => (dayjs(`2018-04-04T${a.start_time}`).isAfter(dayjs(`2018-04-04T${b.start_time}`)) ? 1 : -1))
        .map((schedule) => {
          const activeColors = getActiveColor(
            dayjs(`2018-04-04T${schedule.start_time}`),
            dayjs(`2018-04-04T${schedule.end_time}`)
          );
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
                  <TimelineDot sx={{ color: `${activeColors.text}`, bgcolor: `${activeColors.bg}` }}>
                    <Tv sx={{ width: '20px', height: '20px' }} />
                  </TimelineDot>
                )}
                {schedule.schedule_type === 'marquee' && (
                  <TimelineDot sx={{ color: `${activeColors.text}`, bgcolor: `${activeColors.bg}` }}>
                    <FormatColorTextOutlined sx={{ width: '20px', height: '20px' }} />
                  </TimelineDot>
                )}
                {schedule.schedule_type === 'all' && (
                  <TimelineDot sx={{ color: `${activeColors.text}`, bgcolor: `${activeColors.bg}` }}>
                    <Dvr sx={{ width: '20px', height: '20px' }} />
                  </TimelineDot>
                )}
                <TimelineConnector sx={{ bgcolor: `${activeColors.bg}` }} />
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
