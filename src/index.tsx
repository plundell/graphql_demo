import React from 'react';
import ReactDOM from 'react-dom/client';
import CountrySearch from './components/country-search.d/country-search.component';
import "./style.css";


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement); 

root.render(
	<React.StrictMode>
		<h1 id="title" className="center">Countries</h1>
		<CountrySearch />
	</React.StrictMode>
);
