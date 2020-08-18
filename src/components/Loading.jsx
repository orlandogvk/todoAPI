import React from 'react';
import {GridLoader} from 'react-spinners';

export default function Loading(){
    return (
        <div className="loading">
            <GridLoader color="#2c7eb4" />
            <h2>Cargando...</h2>
        </div>
    )
}