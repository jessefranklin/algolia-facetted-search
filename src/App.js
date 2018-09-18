import React, { Component } from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  Configure,
  InstantSearch,
  Hits,
  SearchBox,
  RefinementList,
  CurrentRefinements,
  ClearRefinements,
  Pagination,
  InfiniteHits,
  SortBy,
  Index,
  Highlight
} from 'react-instantsearch-dom';
import PropTypes from 'prop-types';
import Autocomplete from './components';
import qs from 'qs'
import { orderBy } from 'lodash';
import './styles.css'

const searchClient = algoliasearch(
  'testingHHJZ8341BW',
  '0071873edbe8d1409d072ef90f3ff8a0'
  
);

const client = searchClient.initIndex("drupalspeakers");
const clientTypes = searchClient.initIndex("drupalspeakers-name-asc");

const indexes = [
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
      suggestion: (suggestion, isSelected) => <div data-selected={isSelected}><a href={suggestion.url}>{suggestion.types}</a></div>,
      empty: () => <div class="aa-empty">No matching players</div>
    }
  }
]

const updateAfter = 50;

const createURL = state => {
  return `?${qs.stringify(state)}`;
}

const searchStateToUrl = (props, searchState) => {
  return createPrettyURL(searchState);
}


const createPrettyURL = state => {
  let baseUrl = window.location.href.split('/caaspeakers/search')[0];

  if (!state.q && state.types === 'all' && state.p === 1) return baseUrl;
  
  if (baseUrl[baseUrl.length - 1] !== '/') baseUrl += '/';

  let routeStateArray = [];
  {state.query?routeStateArray.push('q', encodeURIComponent(state.query)):null}
  {state.refinementList.types?routeStateArray.push('types', encodeURIComponent(state.refinementList.types)):null}
  {state.refinementList.topics?routeStateArray.push('topics', encodeURIComponent(state.refinementList.topics)):null}
  {state.page?routeStateArray.push('page', encodeURIComponent(state.page)):null}
  {state.sortBy?routeStateArray.push('sortBy', encodeURIComponent(state.sortBy)):null}

  let url = `caaspeakers/search/${routeStateArray.join('/')}`;
  return url;
  // return `${qs.stringify(state)}`;
}

const urlToSearchState = location => {
  // OOB method
  return qs.parse(location.search.slice(1));
}

const urlToSearchStateIn = location => {
  const params = {refinementList:{}}
  let routeStateString = location;

  const q = routeStateString.indexOf('q/')!==-1?routeStateString.split('q/')[1].split('/')[0]:false;
  const types = routeStateString.indexOf('types/')!==-1? alignArray(routeStateString.split('types/')[1].split('/')[0]) :false;
  const topics = routeStateString.indexOf('topics/')!==-1? alignArray(routeStateString.split('topics/')[1].split('/')[0]) :false;
  const sortBy = routeStateString.indexOf('sortBy/')!==-1?routeStateString.split('sortBy/')[1].split('/')[0]:false;
  const page = routeStateString.indexOf('page/')!==-1?routeStateString.split('page/')[1].split('/')[0]:false;

  {q? params.query=decodeURIComponent(q):''}
  {types? params.refinementList.types=types:null}
  {topics? params.refinementList.topics=topics:null}
  {sortBy?params.sortBy=decodeURIComponent(sortBy):null}
  {page?params.page=page:null}

  return params;
}

const alignArray = (str) => {
  var item = decodeURIComponent(str).split(',');
  var array = [];
  for (var i=0; i < item.length; i++) {
    if (/\S/.test(item[i])) {
      array.push(item[i]);
    }
  }
  return array;
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchState: {},
      selection: null,
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
      this.props.history.replace(
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
      this.props.history.replace(
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
  closeMenu =()=> {
    this.setState({ showTypes: false, showTopics: false }, () => {
      document.removeEventListener('click', this.closeMenu);
    });
  }
  render() {
    const { selection, showTopics, showTypes } = this.state;

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

            
            <Autocomplete 
              indexes={indexes} 
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
                autoComplete="off"  
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
