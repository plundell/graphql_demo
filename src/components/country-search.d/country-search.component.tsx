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


export interface Props {} /*eslist-disable-line @typescript-eslint/no-empty-interface*/

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
				if(list.length)
					this.entities=list
			})
	}

	getCompletions(search:string,entities:NullableEntityArray):NullableEntityArray {
		console.log("getting completions for:",search);
		if(!entities)
			entities=this.entities; //if no subset of entities are passed in then use the entire list
		else if(!entities.length){
			return [];
		}
		// console.log("Check for completions to '"+search+"' in:",entities)
		
		if(!entities || !entities.length)
			return null;

		const regex1=new RegExp((search.length<3 ? '(^)(' : '(.*)(')+search+')(.*)','i'); //short strings we only match begining
		const regex2=new RegExp('^'+search,'i'); //short strings we only match begining
		const fn=(e:any,p:any)=>(e.html=CountrySearch.getCompletionItemHtml(p=='type'?regex2:regex1,e,p));
		var results:NullableEntityArray; /*eslint-disable-line no-var*/
		if(search.length<3)
			results=entities.filter(ent=>fn(ent,'value')||fn(ent,'code'));
		else
			results=entities.filter(ent=>fn(ent,'value')||fn(ent,'type'));
		this.setState({results:results.slice(0,settings.maxResults)})
		 //^we only show the xxx first results
		return results;
	}

	

	render(){
		return (
			<div className={this.constructor.name}>
				<CompletionInput 
					debounce={settings.debounce} 
					onInput={this.getCompletions.bind(this)}
					onEmpty={()=>{this.setState({results:null})}}
					onClear={()=>this.resultsComponent?.clearSelected()}
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


