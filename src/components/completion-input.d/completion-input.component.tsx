import React from 'react'
import "./completion-input.css"; 


type CompletionItem={
	value:string
	,key?:string
	,html?:JSX.Element|JSX.Element[]
}



export type OnInputHandler<T extends CompletionItem,R=T[]|null>=(search:string,lastCompletions:R)=>R

export type OnSubmitHandler<T extends CompletionItem>=(completions:T[]|null)=>void

export interface Props<T extends CompletionItem> {
	debounce?:number,
	onInput:OnInputHandler<T> ,
	onSubmit?:OnSubmitHandler<T>,
	onEmpty?:()=>void
	onClear?:()=>void
}

interface State<T extends CompletionItem>{
	completions:T[]|null
	,highlight:number
}


export class CompletionInput<T extends CompletionItem> extends React.Component<Props<T>,State<T>> {


	public last='';

	//create a fake input element as a placeholder
	public inputElem:HTMLInputElement=document.createElement('input');

	constructor(props:Props<T>){
		super(props);
		this.state={completions:null,highlight:-1};
	}
	
	get inputHandler(){
		if(this.props?.debounce && this.props.debounce>0)
			return CompletionInput.debounceHandler(this.#inputHandler,this.props.debounce,this);
		else
			return this.#inputHandler.bind(this);
	}
	#inputHandler(event?:React.FormEvent<HTMLInputElement>){
		// console.log("updating this.state.completions",this)	
		const last=this.last;
		const value=this.last=this.inputElem.value;
		if(!value){
			this.#setCompletionState(null);
			if(this.props.onEmpty)
				this.props.onEmpty()
		}else if(this.props.onInput){
			if(event)
				event.preventDefault();
			let lastCompletions=null;
			if(value.startsWith(last)){
				lastCompletions=this.state.completions;
			}else{
				this.#setCompletionState(null); //user has pressed backspace => delete the old completions
			}
			this.#setCompletionState(this.props.onInput(value,lastCompletions));
		}
	}

	#setCompletionState(completions:State<T>["completions"]){
		this.setState({completions});
	}

	/* eslint-disable-next-line @typescript-eslint/ban-types -- we explicitly expect any function */
	static debounceHandler<F extends (...args:any[])=>any>(fn:F,delay=50,self:any=window) {
		var timer:ReturnType<typeof setInterval>; /* eslint-disable-line no-var -- explicitly refers to entire function */
		return (...args:Parameters<F>)=>{
			// console.log('debounce',...args);
			clearTimeout(timer);
			timer=setTimeout(()=>{
				// console.log('trigger',...args);
				try{fn.apply(self,args)}catch(e){console.error(e)}
			},delay);
		}
	}
   
	get keyboardHandler(){
		return this.#keyboardHandler.bind(this)
	}
	#keyboardHandler(event:React.KeyboardEvent<HTMLInputElement>){

		// console.log(event,input);
		var highlight; // eslint-disable-line no-var 
		switch(event.key){
		case 'ArrowUp':
			highlight=this.state.highlight-1;
			if(highlight>-1)
				this.setState({highlight})
			break;
		
		case 'ArrowDown':
			highlight=this.state.highlight+1;
			if(highlight<=(this.state.completions?.length||0))
				this.setState({highlight})
			break;
		case 'Tab':
			this.#applySuggestion();
			event.preventDefault();
			this.inputElem.blur();
			break;
		case 'Enter':
			this.#applySuggestion();
			if(this.props.onSubmit && this.currentSuggestion){
				// console.log("input calling onSubmit handler")
				this.props.onSubmit(this.state.completions)
			}else{
				this.inputElem.dispatchEvent(new Event("submit")) //alternative method
			}
			this.inputElem.blur();
			break;
		default:
			return;
		}
		// setTimeout(()=>console.log(event.key,this.state,this),100);
	}

	get currentSuggestion(){
		if(this.state.completions && this.state.completions.length){
			return this.state.completions[Math.max(this.state.highlight,0)]
		}
		return undefined
	}
	#applySuggestion():void{
		if(this.state.highlight>-1){
			const suggestion=this.currentSuggestion
			if(suggestion){
				//manually set the 
				this.inputElem.value=suggestion.value
				this.#inputHandler();
			}
		}
	}

	get onClear(){
		return (event:React.MouseEvent)=>{
			this.inputElem.value='';
			this.#inputHandler();
			event.preventDefault();
			if(this.props.onClear)
				this.props.onClear();
			else
				this.inputElem.dispatchEvent(new Event('clear'));
		}
	}
	render(){	
		return (
			<div className="completionInput">
				<input 
					ref={elem=>{if(elem)this.inputElem=elem;}}
					type="text" 
					placeholder="Search..." 
					onInput={this.inputHandler} 
					onKeyDown={this.keyboardHandler}
					autoFocus
				></input>
				<span title="Reset" className="clearInput" onClick={this.onClear}>x</span>
				{(	
					this.state.completions 
					&& (this.state.completions.length>1 || this.value!=this.state.completions[0]?.value)
				)
					?<div className="completionList">{
						this.state.completions.map(
							(c,i)=>(
								<div
									id={c.key||c.value} 
									key={c.key||c.value} 
									className={`completion ${i==this.state.highlight?'active':''}`}
								>{c.html||c.value}</div>
							)
						)
					}</div>
					: ''
				}
			</div>
		);
	}

	componentDidMount(): void {
		this.inputElem.focus();
	}

}


export default CompletionInput;
