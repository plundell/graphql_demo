import React from 'react';
import ReactDOM from 'react-dom/client';
import CountrySearch from './components/country-search.d/country-search.component';
import "./style.css";




const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement); 

root.render(
	<React.StrictMode>
		<CountrySearch />
	</React.StrictMode>
);



// async function resultsHandler(promise: Promise){
//   try{
//     const data=await promise;
//     console.log(data);
//   }catch(e){
//     console.error(e)
//   }
// }
