import React from 'react'
import {CompletionInput} from 'components/completion-input.d/completion-input.component'
import CountryResults from './country-results.component';
import "./country-search.css";
import {graphql,EntityType,toEntityType,Scalars} from 'services/countries-api/countries-api.service';

export interface Entity{
	value:Scalars['String']
	,code:Scalars['ID']
	,type:EntityType
	,key:Scalars['String']
	,html?:JSX.Element|JSX.Element[]
}

export type NullableEntityArray=Entity[]|null;

const settings={
	debounce:300
	,maxResults:20
}


export interface Props {
	search?:string
} 

interface State{
	results:NullableEntityArray
	,selected:string[]
}

export class CountrySearch extends React.Component<Props,State> {

	private entities:NullableEntityArray=null;

	private resultsComponent:CountryResults|null=null;

	constructor(props:Props){
		super(props);
		this.state={
			results:null
			,selected:[]
		};
		graphql.getNamesAndCodes({})
			.then(data=>{
				const list:typeof this.entities=[];
				Object.entries(data).forEach(([t,arr])=>{
					if(Array.isArray(arr)){
						const type=toEntityType(t)
						arr.forEach(({code,name})=>{
							code=code.toUpperCase()
							const value=String(name||code);
							const key:Entity["key"]=`${code}-${type}`.toLowerCase();
							list.push({key, value, code, type});
						})
					}
				})
				if(list.length){
					this.entities=list
				}else{
					alert("Something went wrong. Failed to contact the GraphQL API.")
				}
			})

	}

	getCompletions(search:string,entities:NullableEntityArray):NullableEntityArray {
		// console.log("getting completions for:",search);
		//Ad the search term to the url
		window.location.hash=`s=${search}`


		if(!entities){
			//if no subset of entities are passed in then use the entire list...
			if(!this.entities || !this.entities.length){
				//...but if no list has been retreived yet we return null which won't
				//show "no results" in the output
				return null;
			}
			entities=this.entities; 
		}else if(!entities.length){
			//If an empty subset is passed in that means the last search already didn't 
			//yield anything in which case it's not gonna help adding more letters so 
			//we just go ahead and return an empty resultset
			return []; 
		}
		
		//Define 2 regex, one used for code/value, the other for type. For short strings
		//and type we only match the begining, else we match anywhere
		const regex1=new RegExp((search.length<3 ? '(^)(' : '(.*)(')+search+')(.*)','i'); 
		const regex2=new RegExp('^'+search,'i'); //used for type

		//Define a search function using the regexs^ which also sets the html for
		//the dropdown list on the returned entity
		const fn=(e:any,p:any)=>(e.html=CountrySearch.getCompletionItemHtml(p=='type'?regex2:regex1,e,p));

		var completions:NullableEntityArray; /*eslint-disable-line no-var*/
		if(search.length<3)
			completions=entities.filter(ent=>fn(ent,'value')||fn(ent,'code'));
		else
			completions=entities.filter(ent=>fn(ent,'value')||fn(ent,'type'));

		//While we'll return the entire list of completions vv, we only show a limited
		//number in the output/results
		this.setState({results:completions.slice(0,settings.maxResults)})
		
		return completions;
	}

	

	render(){
		return (
			<div id="countrySearch">
				<CompletionInput 
					debounce={settings.debounce} 
					onInput={this.getCompletions.bind(this)}
					onEmpty={()=>{this.setState({results:null});window.location.hash=""}}
					onClear={()=>this.resultsComponent?.clearSelected()}
					search={this.props.search}
				/>
				<CountryResults 
					results={this.state?.results||null}
					register={(child)=>this.resultsComponent=child}
				/>
			</div>
		)
	}

	static getCompletionItemHtml(regex:RegExp,ent:Entity,prop:"value"|"code"|'type'):JSX.Element[]|undefined{
		const match=ent[prop].match(regex);
		if(match){
			const htmlArr:JSX.Element[]=[];
			if(prop=='type'){
				htmlArr.push((<span>{ent.value}</span>))
			}else{
				if(match[1]) htmlArr.push((<span>{match[1]}</span>))
				htmlArr.push((<span className="highlight">{match[2]}</span>))
				if(match[3]) htmlArr.push((<span>{match[3]}</span>))
				if(prop=='code')
					htmlArr.push((<span> - {ent.value}</span>))
			}
			htmlArr.push((<span className="type">{ent.type}</span>))
			return htmlArr
		}
		return undefined;
	}


}

export default CountrySearch


