import React from 'react';
import PropTypes from 'prop-types';
import {
  Highlight
} from 'react-instantsearch-dom';

export const Hit = (props,goToSpeaker) => {
    return (
      <article>
          <div className="img-container">
          <a href={props.hit.url}>
            <img src={'https://caaweb-stg.caadev.com/'+props.hit.image} alt={props.hit.name}/>
          </a>
          </div>
          <a href={props.hit.url}>
            <Highlight attribute="name" hit={props.hit} />
          </a>
          <Highlight attribute="description" hit={props.hit} />
      </article>
    );
}

Hit.propTypes = {
    hit: PropTypes.object.isRequired,
};

export default Hit;