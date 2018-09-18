import React, { Component } from 'react';
import {
  InstantSearch,
  SearchBox,
  RefinementList,
  CurrentRefinements,
  ClearRefinements,
  InfiniteHits,
  SortBy
} from 'react-instantsearch-dom';

import { searchClient } from './settings';
import {createURL,searchStateToUrl,urlToSearchStateIn} from './func/parseUrl';

import Hit from './components/Hit';
import indicies from './indicies';

import PropTypes from 'prop-types';
import Autocomplete from './components';


import './styles.css';

const updateAfter = 700;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchState: {},
      showTopics: false,
      showTypes: false
    };
  }
  componentDidMount(){
    this.setState({
     searchState: urlToSearchStateIn(window.location.href)
   })
  }
  componentWillReceiveProps(props) {
    if (props.location !== this.props.location) {
      this.setState({ searchState: urlToSearchStateIn(props.location.pathname) });
    }
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.closeMenu);
  }

  onSuggestionSelected = (suggestion) => {
    const sansRefine = {
      ...this.state.searchState, refinementList: {}
    }
    this.setState({ sansRefine });
  }

  onSearchStateChange = searchState => {
    clearTimeout(this.debouncedSetState);
    this.debouncedSetState = setTimeout(() => {

      let url = searchStateToUrl(this.props, searchState);
      this.props.history.push(
        '/'+url,
        searchState
      );
    }, updateAfter);
    this.setState({ searchState });
  };

  query = (query) => {
    const searchState = {
      ...this.state.searchState, query: query, refinementList: {}
    }
    this.setState({ searchState });
    let url = searchStateToUrl(this.props, searchState);
      this.props.history.push(
        '/'+url,
        searchState
      );
  }

  showTypes = (e) => {
    this.setState({
      showTypes: true
    });
    
    document.addEventListener("click", this.closeMenu);
  }

  showTopics = (e) => {
    this.setState({
      showTopics: true
    });

    document.addEventListener("click", this.closeMenu);
  }

  closeMenu = () => {
    this.setState({ showTypes: false, showTopics: false }, () => {
      document.removeEventListener('click', this.closeMenu);
    });
  }

  render() {
    const { showTopics, showTypes } = this.state;

    return (
      <div>
        <div className="container">
          <InstantSearch 
            searchClient={searchClient} indexName="drupalspeakers"
            searchState={this.state.searchState}
            onSearchStateChange={this.onSearchStateChange}
            createURL={searchStateToUrl}
            >
            <Autocomplete 
              indexes={indicies} 
              query={this.query}
              >
              <SearchBox
                key="input" 
                type="search"
                id="aa-search-input"
                className="aa-input-search "
                placeholder="Search for Speakers"
                name="search" 
                searchAsYouType={false}
                onKeyUp={this.onSuggestionSelected} 
                autoComplete="on"  
              />

    
            </Autocomplete>

            <div className="search-panel">

              <ClearRefinements 
              clearsQuery={true} 
              autoHideContainer={true}
              />
            
              <div className="filter-row">
            
                <div className="filter-cell">
                    <button onClick={this.showTypes} name="types">
                      Types
                    </button>
                    <CurrentRefinements 
                      transformItems= {(types)=>{
                        const typex = types.filter(type => {
                          return type.attribute.indexOf('topics')===-1;
                        })
                        return typex;
                      }
                    }
                  />
                  
                  <div className={showTypes?'search-panel__filters show':'search-panel__filters'}>
                    <RefinementList attribute="types" limit={99}
                      transformItems={(types)=>{
                        const typex = types.filter(type => {
                          return type.label.indexOf(',')===-1;
                        })
                        return typex;
                      }} />
                  </div>
                  
                </div>
                
                <div className="filter-cell">
                  <button onClick={this.showTopics} name="topics">
                    Topics
                  </button>
                  <CurrentRefinements 
                      transformItems= {(types)=>{
                        const typex = types.filter(type => {
                          return type.attribute.indexOf('types')===-1;
                        })
                        return typex;
                      }
                    }
                  />

                
                  <div className={showTopics?'search-panel__filters show':'search-panel__filters'}>
                    <RefinementList attribute="topics" limit={99} 
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
                  <SortBy
                    defaultRefinement="drupalspeakers"
                    items={[
                      { value: 'drupalspeakers', label: 'Name A-Z' },
                      { value: 'drupalspeakers-name-desc', label: 'Name Z-A' }
                    ]}
                  />
                </div>
              </div>

              <div className="search-panel__results">
              <InfiniteHits hitComponent={Hit} />
              {/*
                <Hits hitComponent={Hit} />
                <Index indexName="drupalspeakers">
                      <p>Results in second dataset</p>
                      <Hits  hitComponent={Hit} />
                </Index>
                <div className="pagination">
                  <Pagination />
                </div>
                  */}

              </div>

            </div>
          </InstantSearch>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  location: PropTypes.object.isRequired,
};

export default App;
