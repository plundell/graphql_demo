import React from 'react'
import "./tiles.css";

export type Renderable=JSX.Element|JSX.Element[]|string

export interface Props {
	title:string
	content:Renderable|Promise<Renderable>
	,onClick?:(this:Tile|null)=>void
	,whileLoading?:Renderable
	,classNames?:string[]
}
export interface State {
	content:Renderable
}

export class Tile extends React.Component<Props,State>{
	private _ID:number;
	debug(...args:any[]){
		console.debug(this._ID,`<${this.constructor.name}>`,...args);
	}
	
	//create a fake input element as a placeholder
	public elem:HTMLElement=document.createElement('div');
	
	constructor(props:Props){
		super(props);
		this._ID=Math.floor(Math.random()*10000);
		this.state={
			content:(props.content instanceof Promise ? props.whileLoading||'' : props.content)
		}
		if(props.content instanceof Promise)
			props.content.then(content=>this.setState({content}));

		this.debug("constructor:",props.title);
	}

	render(){
		const classNames=['tile'].concat(this.props.classNames||[]).join(' ');
		return (
			<div 
				ref={elem=>{if(elem)this.elem=elem;}}
				className={classNames}
				onClick={this.props.onClick?.bind(this)}
			>
				<div className="title">{this.props.title}</div>
				<div className="content">{this.state.content}</div>
			</div>
		);
	}
}

export default Tile