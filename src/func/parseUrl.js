import qs from 'qs';

const urlToSearchState = location => {
    // OOB method
    return qs.parse(location.search.slice(1));
}

export const createURL = state => {
  return `?${qs.stringify(state)}`;
}

export const searchStateToUrl = (props, searchState) => {
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


export const urlToSearchStateIn = location => {
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
  