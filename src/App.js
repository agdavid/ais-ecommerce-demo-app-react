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
  connectHighlight
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
            <SearchBox />
            <Hits hitComponent={Hit}/>
            <Pagination />
          </div>
        </InstantSearch>
      </div>
    )
  }
}

function Hit(props) {
  return (
    <div key={props.hit.objectID}>
      <img src={props.hit.image} align="left" alt={props.hit.name} />
      <div className="hit-name">
        <CustomHighlight attribute="name" hit={props.hit} />
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

  console.log(parsedHit)

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
