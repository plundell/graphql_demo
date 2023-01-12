import React from 'react'
import {TileGrid, Props as GridProps,Tile} from 'components/tiles.d/tile-grid.component'
import {Entity, NullableEntityArray} from './country-search.component'
import {graphql} from 'services/countries-api/countries-api.service';
import { Renderable } from 'components/tiles.d/tile.component';

interface Props {
	results:NullableEntityArray
	register?:(self:CountryResults)=>void
}

type TileProps=NonNullable<GridProps['tiles']>[keyof GridProps['tiles']] ;
type TileRecords=NonNullable<GridProps['tiles']>
	
const settings={
	markClass:'marked'
}

// function randomDelay<T>(resolveWith:T):Promise<T>{
// 	return new Promise(resolve=>{
// 		const delay=Math.random() * (3000 - 1000) + 1000;
// 		setTimeout(()=>{
// 			// console.log('resolving with',resolveWith)
// 			resolve(resolveWith);
// 		},delay);
// 	})
// }

export default class CountryResults extends React.Component<Props> {
	private _ID:number;
	debug(...args:any[]){
		console.debug(this._ID,`<${this.constructor.name}>`,...args);
	}

	private cache:TileRecords={};
	
	constructor(props:Props){
		super(props);
		this._ID=Math.floor(Math.random()*10000);
		this.debug("creating",this.props.results?.map(ent=>ent.value).join(', '));
		if(props.register)
			props.register(this);
	}

	get selected(){
		return Object.entries(this.cache)
			.filter(([,tile])=>tile.classNames?.includes(settings.markClass))
			.map(([key])=>key)
	}

	clearSelected(){
		const keys=this.selected;
		if(keys.length){
			for(const key of keys){
				this.cache[key].onClick?.call(null)
			}
			this.forceUpdate();
		}
	}

	private getTile(ent:Entity):TileProps{
		if(this.cache.hasOwnProperty(ent.key)==false){
			this.cache[ent.key]=this.buildTile(ent);
		}
		return this.cache[ent.key];
	}

	private buildTile=(ent:Entity):TileProps=>{
		const tile:any={
			title:ent.value
			,classNames:[ent.type.toLowerCase()]
		};
		const cls=settings.markClass;
		tile.onClick=function toggleSelected(this:Tile|null){
			const i=tile.classNames.indexOf(cls)
			if(i>-1){
				tile.classNames.splice(i,1)
				this?.elem.classList.remove(cls)
			}else{
				tile.classNames.push(settings.markClass);
				this?.elem.classList.add(cls);
			}
		}
		const promise=CountryResults[`build${ent.type}TileContent`](ent);
		tile.content=promise;
		promise.then(content=>{tile.content=content})
	
		return tile;
	}
	
	private static getNestedString(value:any):string{
		if(typeof value=='object'){
			if(Array.isArray(value)) 
				return value.map(v=>v.name).join(', ');
			else
				return value.name
		}else if(typeof value!='string'){
			console.error("Unexpected value returned from GraphQL query:",value);
			return 'no data';
		}
		return value;
	}

	private static keyValueToHtml(prop:string,value:any){
		const Prop=prop[0].toUpperCase()+prop.slice(1)+': '
		value=this.getNestedString(value);
		if(value.length>100){
			const i=value.slice(100).indexOf(',')+101;
			value=(
				<span>
					<span className="hideOverflow">{value.slice(0,i)}</span>
					<span className='overflow'>{value.slice(i)}</span>
				</span>
			)
		}

		return (<div>
			<span className='fieldName'>{Prop}</span>
			<span className='fieldValue'>{value}</span>
		</div>);
	}
	private static queryDataToTileContent(data:{[key:string]:any}|null|undefined){
		const html:JSX.Element[]=[];
		if(data){
			 /* eslint-disable-next-line prefer-const */
			for(let [prop,value] of Object.entries(data)){ /**/
				if(value) html.push(CountryResults.keyValueToHtml(prop,value))
			}
		}else{
			html.push(<div>no data</div>)
		}
		return html
	}

	private static async buildCountryTileContent(ent:Entity):Promise<Renderable>{
		return graphql.getCountryDetails(ent)
			.then(({country})=>CountryResults.queryDataToTileContent(country));
	}
	private static async buildContinentTileContent(ent:Entity):Promise<Renderable>{
		return graphql.getContinentMembers(ent)
			.then(({continent})=>CountryResults.queryDataToTileContent(continent));
	}
	private static async buildLanguageTileContent(ent:Entity):Promise<Renderable>{
		return graphql.getLanguageDetails({code:ent.code.toLowerCase()})
			.then(({language})=>CountryResults.queryDataToTileContent(language));
	}

	private getTiles=():GridProps['tiles']=>{
		if(this.props.results){
			const tiles:TileRecords={};
		    for(const ent of this.props.results){
		    	tiles[ent.key]=this.getTile(ent);
			}
			return tiles;
		}else{
			return null;
		}
	}

	render(){
		const tiles=this.getTiles();
		if(tiles){
			if(Object.keys(tiles).length)
				this.debug("rendering:",Object.values(tiles).map(t=>(`${t.title}${t.content instanceof Promise ?'*':''}`)).join(', '));
			else 
				this.debug("no results:",this)
		}else{
			this.debug("not started yet")
		}
		return (
			<div className="countryResults">
				<TileGrid tiles={tiles}/>
			</div>
		)
	}





}
