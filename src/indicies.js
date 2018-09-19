import React from 'react';
import {client, clientTypes} from './settings';

export const indicies = [
    {
      source: client,
      displayKey: 'names',
      templates: {
        header: (suggestion) => <h2 className="aa-suggestions-category">Speakers</h2>,
        suggestion: (suggestion, isSelected) => <div data-selected={isSelected}><a href={suggestion.url}>{suggestion.name}</a></div>,
        empty: () => <div class="aa-empty">No matching players</div>
      }
    },{
      source: clientTypes,
      displayKey: 'types',
      templates: {
        header: (suggestion) => <h2 className="aa-suggestions-category">Types</h2>,
        suggestion: (suggestion, isSelected) => {
          const url = '/caaspeakers/search/types/'+suggestion.types;
          return <div data-selected={isSelected}><a href={url}>{suggestion.types}</a></div>
        },
        empty: () => <div class="aa-empty">No matching players</div>
      }
    }
]

export default indicies;