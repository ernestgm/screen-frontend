// @mui
import PropTypes from 'prop-types';
import {alpha, styled} from '@mui/material/styles';
import {Card, Stack, Typography} from '@mui/material';
// utils
// table
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const StyledIcon = styled('div')(({theme}) => ({
    display: 'flex',
    borderRadius: '50%',
    alignItems: 'center',
    width: theme.spacing(8),
    height: theme.spacing(8),
    justifyContent: 'center',
}));

// ----------------------------------------------------------------------

TitlePageDetails.propTypes = {
    color: PropTypes.string,
    icon: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    createdAt: PropTypes.string,
    sx: PropTypes.object,
};

export default function TitlePageDetails({title, description, createdAt, icon, color = 'primary', sx, ...other}) {
    return (
        <Card
            sx={{
                py: 3,
                px: 5,
                boxShadow: 0,
                textAlign: 'left',
                color: (theme) => theme.palette[color].darker,
                bgcolor: (theme) => theme.palette[color].lighter,
                ...sx,
            }}
            {...other}
        >
            <Stack direction="row" spacing={2}>
                <Stack>
                    <StyledIcon
                        sx={{
                            color: (theme) => theme.palette[color].dark,
                            backgroundImage: (theme) =>
                                `linear-gradient(135deg, ${alpha(theme.palette[color].dark, 0)} 0%, ${alpha(
                                    theme.palette[color].dark,
                                    0.24
                                )} 100%)`,
                            mr: '20px'
                        }}
                    >
                        <Iconify icon={icon} width={24} height={24}/>
                    </StyledIcon>
                </Stack>
                <Stack>
                    <Typography variant="h3" sx={{opacity: 0.72}}>
                        name: {title}
                    </Typography>
                    {
                        description && (
                            <Typography variant="h5" sx={{opacity: 0.72}}>
                                Description: {description}
                            </Typography>
                        )
                    }
                </Stack>


            </Stack>

        </Card>
    );
}
