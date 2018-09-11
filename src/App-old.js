import React, { Component } from 'react';
import { InstantSearch, HitsPerPage, SearchBox, Hits, Pagination, MenuSelectWidget } from 'react-instantsearch/dom';
import axios from 'axios';
import AutoComplete from './AutoComplete';
import { connectSearchBox, RefinementList } from 'react-instantsearch-dom';

const MySearchBox = ({currentRefinement, refine}) =>
  <input
    type="text"
    value={currentRefinement}
    onChange={e => refine(e.target.value)}
  />;

// `ConnectedSearchBox` renders a `<MySearchBox>` widget that is connected to
// the <InstantSearch> state, providing it with `currentRefinement` and `refine` props for
// reading and manipulating the current query of the search.
const ConnectedSearchBox = connectSearchBox(MySearchBox);

const headers = {
  header: {
      "Content-Type":"application/json",
      "Access-Control-Allow-Origin": "*"
  }
}

const Hit = ({hit}) => 
  <div className="hit">
    <img src={hit.image} />
    {hit.name}
  </div>

const Sidebar = () => 
  <div className="">
  </div>

const Content = () => 
  <div className="content">
  <Hits hitComponent={Hit} />
  <HitsPerPage
      defaultRefinement={40}
      items={[
        { value: 20, label: 'Show 20 hits' },
        { value: 40, label: 'Show 40 hits' },
      ]}
    />
  </div>


  const searchState = {
    range: {
      price: {
        min: 20,
        max: 3000
      }
    },
    configure: {
      aroundLatLng: true,
    },
    refinementList: {
      fruits: ['lemon', 'orange']
    },
    hierarchicalMenu: {
      products: 'Laptops > Surface'
    },
    menu: {
      brands: 'Sony'
    },
    multiRange: {
      rank: '2:5'
    },
    toggle: {
      freeShipping: true
    },
    hitsPerPage: 40,
    sortBy: 'mostPopular',
    query: '',
    page: 1
  }

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchState: searchState
    }
  }

  onSearchStateChange = () => {
    
  }
  render() {
    return (
      <div className="App">
        <InstantSearch
          appId="testingHHJZ8341BW" 
          apiKey="0071873edbe8d1409d072ef90f3ff8a0" 
          indexName="drupalspeakers"  
          searchState={this.state.searchState}
          onSearchStateChange={this.onSearchStateChange}   
        >
          <header>
            
            <RefinementList attribute="topics"  />
            <br /> <br />
            <RefinementList attribute="types"  />
          </header>
          <main>
            <Sidebar />
            <Content />
            <Pagination />
          </main>
        </InstantSearch>
      </div>
    );
  }
}

export default App;
