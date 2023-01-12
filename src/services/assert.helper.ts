
export default {
	type:assertType
	,typedArray:assertTypedArray
}

type stringOrClass=string|Function /* eslint-disable-line @typescript-eslint/ban-types */

function getPrettyType(type:stringOrClass){
	return typeof type=='string' ? type : type.name
}

function checkType(x:any,type:stringOrClass):boolean{
	if(typeof type=='string'){
		return typeof x==type
	}else if(x && typeof x=='object' && x instanceof type){
		return true
	}
	return false
}

function assertType(x:any,type:stringOrClass):void{
	if(checkType(x,type)==false)
		throw new TypeError(`Expected a ${getPrettyType(type)}, but got: (${typeof x})${String(x)}`);
}

function assertTypedArray(arr:any,type:stringOrClass):void{
	if(!Array.isArray(arr))
		throw new TypeError(`Expected typed array, but got: (${typeof arr})${String(arr)}`);

	const i=arr.findIndex(x=>checkType(x,type)==false);
	if(i>-1)
		throw new TypeError(`Expected ${getPrettyType(type)}[], but index ${i} was: (${typeof arr[i]})${String(arr[i])}`)

}

