import React, { Component } from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  Hits,
  SearchBox,
  Pagination,
  Highlight,
  ClearRefinements,
  RefinementList,
  Configure,
  connectHighlight,
  createConnector
} from 'react-instantsearch-dom';
import PropTypes from 'prop-types';
import './App.css';

const searchClient = algoliasearch(
  'B1G2GM9NG0',
  'aadef574be1f9252bb48d4ea09b5cfe5'
);

class App extends Component {
  render() {
    return (
      <div className = "ais-InstantSearch">
        <h1>React InstantSearch e-commerce-demo</h1>
        <InstantSearch indexName="demo_ecommerce" searchClient={searchClient}>
          <div className="left-panel">
            <ClearRefinements />
            <h2>Brands</h2>
            <RefinementList attribute="brand" />
            <Configure hitsPerPage={8}/>
          </div>
          <div className="right-panel">
            {/* <SearchBox /> */}
            <label>SearchBox</label>
            <ConnectedSearchBox />
            <label>Hit Count:</label>
            <ConnectedHitSelector />
            <Hits hitComponent={Hit}/>
            <Pagination />
          </div>
        </InstantSearch>
      </div>
    )
  }
}

// to create a custom widget
// use createConnector to create your custom widget function

const connectWithQuery = createConnector({
  // give your component a name
  displayName: 'CustomWidgetWithQuery',
  // what props to forward to the composed component
  getProvidedProps(props, searchState) {
    // searchState is the state object
    // add a new state attribute for your custom data
    const currentRefinement = searchState.attributeForMyQuery || '';
    // you now have a searchState object like
    // { attributeForMyQuery: '' }
    return { currentRefinement }

  },
  refine(props, searchState, nextRefinement) 
  {
    // update the search state 
    return { 
      ...searchState,
      attributeForMyQuery: nextRefinement
    }
  },
  getSearchParameters(searchParameters, props, searchState) {
    return searchParameters.setQuery(searchState.attributeForMyQuery || '');
  },
  cleanUp(props, searchState) {
    const { attributeForMyQuery, ...nextSearchState } = searchState;
    return nextSearchState;
  }
})

const MySearchBox = (props) => (
  <input 
    type="input"
    value={props.currentRefinement}
    onChange={ e => props.refine(e.currentTarget.value)}
  />
);

const ConnectedSearchBox = connectWithQuery(MySearchBox);

const connectWithHit = createConnector({ 
  displayName: 'CustomHitSelectorWidget',
  getProvidedProps(props, searchState, searchResults) {
    // this sends props to the composed component
    // add your custom data from the widget to searchState
    const currentHitsPerPage = searchState.attributeForHitsPerPage || '';
    return { currentHitsPerPage };
  },
  refine(props, searchState, nextRefinement) {
    // on refine
    // update search state with new data from component
    return {
      ...searchState,
      attributeForHitsPerPage: nextRefinement
    }
  },
  getSearchParameters(searchParameters, props, searchState) {
    // update the search parameters with new search state data 
    return searchParameters.setQueryParameter('hitsPerPage', searchState.attributeForHitsPerPage || 8);
  },
  cleanUp(props, searchState) {
    const { currentHitsPerPage, ...nextSearchState} = searchState;
    return nextSearchState;
  }
})

const MyHitSelector = (props) => (
  <input 
  type="input"
  value={props.currentHitsPerPage}
  onChange={e => props.refine(e.currentTarget.value)}
  />
)

const ConnectedHitSelector = connectWithHit(MyHitSelector)

const Hit = (props) => {
  return (
    <div>
      <img src={props.hit.image} align="left" alt={props.hit.name} />
      <div className="hit-name">
        <CustomHighlight attribute="name" hit={props.hit}/>
      </div>
      <div className="hit-description">
        <Highlight attribute="description" hit={props.hit} />
      </div>
      <div className="hit-price">${props.hit.price}</div>
    </div>
  );
}

const CustomHighlight = connectHighlight(({ highlight, attribute, hit }) => {
  
  const parsedHit = highlight({
    highlightProperty: '_highlightResult',
    attribute,
    hit
  });

  return(
    <div>
      {parsedHit.map(
        part => (part.isHighlighted ? <mark>{part.value}</mark> : part.value)
      )}
    </div>
  )
})

Hit.propTypes = {
  hit: PropTypes.object.isRequired,
};

export default App;
