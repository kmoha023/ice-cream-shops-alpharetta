import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Rating from '@material-ui/lab/Rating';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: '100%',
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
}));

export default function MyCard(props) {
    const classes = useStyles();
    const { item, review } = props;
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card className={classes.root}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        {item.name}
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={item.name}
                subheader={''}
            />
            <CardMedia
                className={classes.media}
                image={item.image_url}
                title={item.name}
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    { item && item.categories.map(ele => {
                        return <p>
                            {ele.title}
                        </p>
                    })
                    }
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                    <Rating
                        name="hover-feedback"
                        value={item.rating}
                        precision={0.5}
                        />
                    <p >{item.review_count} Reviews</p>
                </IconButton>
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <strong >Address:</strong>
                    <Typography paragraph>
                        { item && item.location["display_address"].map(ele => {
                            return <p key={ele}>
                                {ele}
                            </p>
                        })
                        }
                    </Typography>
                    <strong >
                        Reviews:
                    </strong>
                    <Typography paragraph>
                        {
                            <React.Fragment>
                            <p>
                                Name : {review && review.reviews && review.reviews && review.reviews[0].user.name }
                            </p>
                            <p>
                             Review : {review && review.reviews && review.reviews && review.reviews[0].text }
                            </p>
                            <p>
                            Time : {review && review.reviews && review.reviews && review.reviews[0].time_created }
                            </p>
                                <p>
                                    Rating : {review && review.reviews && review.reviews && review.reviews[0].rating }
                                </p>
                            </React.Fragment>
                        }
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
}
