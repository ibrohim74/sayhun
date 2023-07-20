import React from 'react';
import {Link} from "react-router-dom";

const Lang = () => {
    return (
        <>
            <div className="language-content">
                <div className="language-box">
                    <div className="lan-title">
                        <h2>Tilni tallang</h2>
                        <h2>Выберете язык</h2>
                    </div>
                    <div className="lan-btn">
                        <Link to={'/home'} onClick={e=>window.localStorage.setItem('lang','uz')}>Uz</Link>
                        <Link to={'/ru'} onClick={e=>window.localStorage.setItem('lang','ru')}>Ru</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Lang;
