import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import CircularProgress from '@material-ui/core/CircularProgress';
import GridListTile from '@material-ui/core/GridListTile';

import Http from '../api/yelp_http_api';
import MyCard from '../components/card';
import mock from '../api/mock';
import mockReviews from '../api/reviews';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: 1000,
        height: 2000,
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
    spinner: {
        left: '50%',
        marginLeft: '-4em'
    },
    noDataStyle: {
        width: '100% !important',
        height: '50% !important',
        padding: '2px',
    },
}));

export default function Home() {
    const classes = useStyles();
    const [businesses, setBusinesses] = useState([]);
    const [amountResults, setAmountResults] = useState();
    const [reviews, setReviews] = useState(new Map());
    const [error, setError] = useState(false);
    useEffect(() => {
        async function getData() {
            let params = {
                term: 'desserts',
                location: 'alpharetta',
                sort_by: 'rating'
            }
            let resp = await Http.get('/businesses/search', params);
            if (resp.status && resp.status === 'error') {
                setError(true)
                const parsedMock = JSON.parse(JSON.stringify(mock));
                setBusinesses(parsedMock.businesses);
                setAmountResults(parsedMock.total);
            } else {
                setBusinesses(resp.businesses);
                setAmountResults(resp.total);
            }
        }

        getData();
    }, [])

    // Get reviews
    useEffect(() => {
        async function getReviews() {
            console.log('running 2nd effect..');
            await Http.allRequests(businesses)
                .then(res => {
                        if (res && res.status && res.status === 'error' || res.length === 0) {
                            setReviews(mockReviews);
                        } else {
                            setReviews(new Map(res));
                        }

                    }
                ).catch(err => console.log('running error ', err))
        }
        if(businesses && businesses.length > 0){
            getReviews();
        }

    }, [businesses])


    return (
        <div className={classes.root}>
            <GridList cellHeight={180} className={classes.gridList}>
                <GridListTile key="Subheader" cols={2} style={{height: 'auto'}}>
                    <h1 component="div">Shops</h1>
                </GridListTile>
                {businesses && reviews && reviews.size > 0 && businesses.length > 0 ? businesses.map((item) => (

                        <MyCard key={item.id} review={reviews.get(item.id)} item={item}/>
                    ))
                    : !error ? <CircularProgress className={classes.spinner}/> :
                        <p className={classes.noDataStyle}>'No Data'</p>}
            </GridList>
        </div>
    );
}
