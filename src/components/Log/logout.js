import React from 'react';
import axios from 'axios';

const logout = () => {
    const url_api = "http://localhost:8080";
    const logout = async () => {
        await axios({
            method: 'get',
            url: `${url_api}/api/users/logout/`,
            withCredentials: true,
        }).then((res) => console.log(res))
        .catch((err) => console.log(err))

        window.location = '/';
    }
    return (
        <li onClick={logout}>
            <img src='./img/icons/logout.svg' alt='logout' />
        </li>
    );
};

export default logout;