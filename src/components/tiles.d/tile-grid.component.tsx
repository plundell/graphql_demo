import React from 'react'
import {Tile, Props as TileProps,Renderable} from './tile.component'
export {Tile} from './tile.component'

export type NullableTiles = Record<string,Omit<TileProps,'whileLoading'>>|null

export type Props={
	tiles: NullableTiles//null => don't show onEmptyResults
	whileLoading?:TileProps["whileLoading"]
	onEmptyResults?:Renderable
}

const defaultProps={
	whileLoading:(<span className='loading'></span>)
	,onEmptyResults:(<div className='emptyResults'>No results</div>)
}

export class TileGrid extends React.Component<Props> {
	
	private _ID:number;
	debug(...args:any[]){
		console.debug(this._ID,`<${this.constructor.name}>`,...args);
	}

	private _props:Required<Props>

	constructor(props:Props){
		super(props);
		this._props=Object.assign({},defaultProps,props);
		this._ID=Math.floor(Math.random()*10000);
		this.debug("creating:",Object.values(this._props.tiles||{}).map(t=>(`${t.title}${t.content instanceof Promise ?'*':''}`)).join(', '));
	}


  	render() {
  		if(this.props.tiles){
  			var tiles=Object.entries(this.props.tiles); /*eslint-disable-line no-var*/
  			if(!tiles.length)
  				return this._props.onEmptyResults
  		}else{
  			return ''
  		}

  		this.debug("rendering:",tiles.map(([,t])=>(`${t.title}${t.content instanceof Promise ?'*':''}`)).join(', '));
  		return (
			<div className="tileGrid">
				{tiles.map(([key,tileProps])=>
					<Tile 
						key={key} 
						whileLoading={this._props.whileLoading}
						{...tileProps} 
					/>
				)}
			</div>  
  		)
  	}

}


export default TileGrid
