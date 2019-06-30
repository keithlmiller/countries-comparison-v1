import React from "react";
import { format as d3Format } from 'd3';
import './Tooltip.scss';

export default function Tooltip({name, property, propertyValue, x, y}) {
    const positionStyles = {
        top: y - 5,
        left: x + 10,
    }

    return (
        <div className='tooltip' style={positionStyles}>
            <div className='tootip-title'>{name}</div>
            <div className='tooltip-content'>
                {property && 
                    <div className='tooltip-item'>
                        <span className='tooltip-label'>{property}:</span> {d3Format(',')(propertyValue)}
                    </div>
                }
            </div>
        </div>
    )
}