import axios from 'axios';

const _apiHost = 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3';
const _apiHost_gql = 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/graphql';

export const BEARER_TOKEN = `tcYfXi-s6U1YElkj4cxuExE2ct1S9pIL_0AeS8qK2cC1y-yXDhcQ8MoSD52ebmPwoK_HBONn8tzEXtezDg4-fYqONaAMBcLs7dnuMwt9jUERHCLKAUbItT2f2x0aYHYx`;

async function request(url, params, method = 'GET') {

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${BEARER_TOKEN}`,
            'origin': 'localhost',
            'withCredentials': true
        }
    };

    if (params) {
        if (method === 'GET') {
            url += '?' + objectToQueryString(params);
        } else {
            options.body = JSON.stringify(params);
        }
    }

    const response = await fetch(_apiHost + url, options);

    if (response.status !== 200) {
        return generateErrorResponse('The server responded with an unexpected status.');
    }

    return await response.json();
}

async function allRequests(businesses) {
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${BEARER_TOKEN}`,
            'origin': 'localhost',
            'withCredentials': true
        }
    };
    try {
        let callList = []
        businesses && businesses.forEach(business => {
            callList.push({
                API: `/businesses/${business.id}/reviews`,
                method: 'GET'
            })
        });
        let data = await Promise.all(
            callList.map(
                call =>
                    fetch(_apiHost + call.API, {method: call.method, headers: options.headers}).then(
                        (response) => {
                            if(response.status === 200) {
                                return response.json()
                            }
                        }
                    ).catch(err => err)
            )
        );
        data = data.filter((ele, index) => typeof data[index] !== 'undefined')
        return (data)

    } catch (error) {
        console.log(error)
        throw (error)
    }
}

function objectToQueryString(obj) {
    return Object.keys(obj).map(key => key + '=' + obj[key]).join('&');
}

function generateErrorResponse(message) {
    return {
        status: 'error',
        message
    };
}

function get(url, params) {
    return request(url, params);
}

function create(url, params) {
    return request(url, params, 'POST');
}

function update(url, params) {
    return request(url, params, 'PUT');
}

function remove(url, params) {
    return request(url, params, 'DELETE');
}

export default {
    get,
    create,
    update,
    remove,
    allRequests
};
