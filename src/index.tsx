import React from 'react';
import ReactDOM from 'react-dom/client';
import CountrySearch from './components/country-search.d/country-search.component';
import "./style.css";


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement); 

const hashArgs=Object.fromEntries(
	window.location.hash.slice(1) //remove #
		.split('&') //split into key=value
		.map(x=>x.split('=')) //may create array longer than tuple
		.map(([k,...v])=>([k,v.join('=')])) //back to tuple
)

root.render(
	<React.StrictMode>
		<h1 id="title" className="center">Countries</h1>
		<CountrySearch search={hashArgs.s}/>
	</React.StrictMode>
);
