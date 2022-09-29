import React from 'react';

const ALibbSvg = (props) => {
  const { type,fill,width,height,extra } = props;
  return <svg style={{fill:fill,width:width,height:height,...extra}} aria-hidden="true">
    <use xlinkHref={`#icon${type}`}></use>
  </svg>;
};
export default ALibbSvg;
