import PropTypes from 'prop-types';
// @mui
import {alpha, styled} from '@mui/material/styles';
import {Link, Card, Avatar, Typography, CardContent} from '@mui/material';
// utils
import {fDate} from "../../../utils/formatTime";
//
import SvgColor from '../../../components/svg-color';


// ----------------------------------------------------------------------

const StyledCardMedia = styled('div')({
    position: 'relative',
    paddingTop: 'calc(100% * 3 / 4)',
});

const StyledTitle = styled(Link)({
    height: 44,
    overflow: 'hidden',
    WebkitLineClamp: 2,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
});

const StyledAvatar = styled(Avatar)(({theme}) => ({
    zIndex: 9,
    width: 32,
    height: 32,
    position: 'absolute',
    left: theme.spacing(3),
    bottom: theme.spacing(-2),
}));
styled('div')(({theme}) => ({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(3),
    color: theme.palette.text.disabled,
}));

const StyledCover = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
});

// ----------------------------------------------------------------------

BusinessDetailsCard.propTypes = {
    business: PropTypes.object.isRequired
};

export default function BusinessDetailsCard({business}) {
    const {cover, title, author, createdAt, description} = business;
    const latestPostLarge = true;
    const latestPost = false;

    return (
        <Card sx={{position: 'relative'}}>
            <StyledCardMedia
                sx={{
                    ...((latestPostLarge || latestPost) && {
                        pt: 'calc(100% * 3 / 3)',
                        '&:after': {
                            top: 0,
                            content: "''",
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.40),
                        },
                    }),
                    ...(latestPostLarge && {
                        pt: {
                            xs: 'calc(100% * 3 / 3)',
                            sm: 'calc(100% * 3 / 4.66)',
                        },
                    }),
                }}
            >
                <SvgColor
                    color="paper"
                    src="/assets/icons/shape-avatar.svg"
                    sx={{
                        width: 150,
                        height: 60,
                        zIndex: 9,
                        bottom: -15,
                        position: 'absolute',
                        color: 'background.paper',
                        ...((latestPostLarge || latestPost) && {display: 'none'}),
                    }}
                />
                <StyledAvatar
                    alt={author.name}
                    src={author.avatarUrl}
                    sx={{
                        ...((latestPostLarge || latestPost) && {
                            zIndex: 9,
                            top: 24,
                            left: 24,
                            width: 100,
                            height: 100,
                        }),
                    }}
                />

                <StyledCover alt={title} src={cover}/>
            </StyledCardMedia>

            <CardContent
                sx={{
                    pt: 4,
                    ...((latestPostLarge || latestPost) && {
                        bottom: 0,
                        width: '100%',
                        position: 'absolute',
                    }),
                }}
            >
                <Typography gutterBottom variant="caption" sx={{color: 'common.white', display: 'block'}}>
                    Created: {fDate(createdAt)}
                </Typography>

                <StyledTitle
                    color="inherit"
                    variant="subtitle2"
                    underline="hover"
                    sx={{
                        ...(latestPostLarge && {typography: 'h5', height: 40}),
                        ...((latestPostLarge || latestPost) && {
                            color: 'common.white',
                        }),
                    }}
                >
                    {title}
                </StyledTitle>
                <Typography gutterBottom variant="caption" sx={{color: 'common.white', display: 'block'}}>
                    Description: {description}
                </Typography>
                <Typography gutterBottom variant="caption" sx={{color: 'common.white', display: 'block'}}>
                    Owner: {author.name}
                </Typography>
            </CardContent>
        </Card>
    );
}
