import React, { Component } from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  Configure,
  InstantSearch,
  Hits,
  SearchBox,
  Menu,
  RefinementList,
  CurrentRefinements,
  ClearRefinements,
  hierarchicalMenu,
  Pagination,
  SortBy,
  Highlight
} from 'react-instantsearch-dom';
import { connectRefinementList } from 'react-instantsearch/connectors';
import PropTypes from 'prop-types';

import Autocomplete from "algolia-react-autocomplete";
import "algolia-react-autocomplete/build/css/index.css";
import Router from 'next/router'
import qs from 'qs'

import { Link } from 'react-router-dom';
 
const searchClient = algoliasearch(
  'testingHHJZ8341BW',
  '0071873edbe8d1409d072ef90f3ff8a0'
);


const updateAfter = 700;

const createURL = state => `?${qs.stringify(state)}`;

const searchStateToUrl = (props, searchState) =>
  searchState ? `${props.location.pathname}${createURL(searchState)}` : '';
const urlToSearchState = location => qs.parse(location.search.slice(1));

const indexes = [
  {
    source: searchClient.initIndex("drupalspeakers"),
    displayKey: 'name',
    templates: {
      header: () => <h2 className="aa-suggestions-category"> Speakers</h2>,
      suggestion: (suggestion, isSelected) => <div data-selected={isSelected}><a href={suggestion.url}>{suggestion.name}</a></div>
    }
  }
  // {
  //   source: this.client.initIndex("types"),
  //   displayKey: 'name',
  //   templates: {
  //     header: () => <h2 className="aa-suggestions-category">Types</h2>,
  //     suggestion: (props, isSelected) => <li>{props.name}</li>
  //   }
  // }
]




class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchState: { ...qs.parse(window.location.search.slice(1)) },
      selection: null,
      category: null
    };
  }
  componentWillReceiveProps(props) {
    if (props.location !== this.props.location) {
      this.setState({ searchState: urlToSearchState(props.location) });
    }
  }
  onSelectionChange = selection => this.setState({ selection });

  onSuggestionSelected = (suggestion) => {
    
    const sansRefine = {
      ...this.state.searchState, refinementList: {}
    }
    console.log(sansRefine);
    this.setState({ sansRefine });
    this.props.history.push(searchStateToUrl(this.props,sansRefine));
  }
  onSubmit = (suggestion) => {
    console.log('Submitted', suggestion)
  }
  onInputChange = (v) => {
    console.log('v');
  }
  handleKeyPress = (e) => {
    

    if (e.key === 'Enter') {
      const queryx = {
        ...this.state.searchState, 
        query: e.target.value
      }
      this.setState({ queryx });
      this.props.history.push(searchStateToUrl(this.props,queryx));
    }
  }

  closeDropdown=()=>{
    console.log('close')
    this.setState({
      open: false,
    });
  }

  onSearchStateChange = searchState => {
    clearTimeout(this.debouncedSetState);
    this.debouncedSetState = setTimeout(() => {
      this.props.history.push(
        searchStateToUrl(this.props, searchState),
        searchState
      );
    }, updateAfter);
    this.setState({ searchState });
  };

  render() {
    const { selection } = this.state;
    return (
      <div>
        <header className="header">

        </header>

        <div className="container">
          <InstantSearch 
            searchClient={searchClient} indexName="drupalspeakers"
            searchState={this.state.searchState}
            onSearchStateChange={this.onSearchStateChange}
            createURL={createURL}
            >
            <Configure hitsPerPage={60} />
            <Autocomplete 
              indexes={indexes}
              >
              <input
                key="input" 
                type="search"
                id="aa-search-input"
                className="aa-input-search searchbox"
                placeholder="Search for Speakers"
                name="search"
                autoComplete="off"  
                onKeyPress={this.handleKeyPress}
                onKeyUp={this.onSuggestionSelected}
              />

              {/* <SearchBox key="input" type="search" className="aa-input-search" autocomplete="off"  onKeyUp={this.onSuggestionSelected} placeholder="" /> */} 
            </Autocomplete>

            <div className="search-panel">
              <br /><br />
              <CurrentRefinements />
              <ClearRefinements />
            
              <div className="filter-row">
            
                <div className="filter-cell">
                  Types
                  <div className="search-panel__filters">
                    <RefinementList attribute="types" limit={10}
                      transformItems={(types)=>{
                        const typex = types.filter(type => {
                          return type.label.indexOf(',')===-1;
                        })
                        return typex;
                      }} />
                  </div>
                </div>
                
                <div className="filter-cell">
                  Topics
                  <div className="search-panel__filters">
                    <RefinementList attribute="topics" limit={10}
                    transformItems={(types)=>{
                      const typex = types.filter(type => {
                        return type.label.indexOf(',')===-1;
                      })
                      return typex;
                    }} />
                  </div>
                </div>

                <div className="filter-cell">
                  Sort by
                  
                </div>
              </div>

              <div className="search-panel__results">
                <Hits hitComponent={Hit} />

                <div className="pagination">
                  <Pagination />
                </div>
              </div>

            </div>
          </InstantSearch>
        </div>
      </div>
    );
  }
}



function Hit(props,goToSpeaker) {
  return (
    <article>
      
        <div className="img-container">
        <a href={props.hit.url}>
          <img src={'https://caaweb-stg.caadev.com/'+props.hit.image} />
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


App.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  location: PropTypes.object.isRequired,
};



export default App;
