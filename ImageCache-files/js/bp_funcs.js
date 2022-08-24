/*
	BP Funcs, as of 2022-08-24 03:41:47 (GMT +02:00)
	Params: 
*/

class SelectorDef{
	constructor(selectors="", refineFunc=null, within=null){
		this.selectors = [];
		if(selectors){
			switch(typeof selectors){
				case "object":
					if(selectors instanceof Array){
						this.selectors = [...selectors];
					}
					else{
						try{
							Object.assign(this, selectors);
							return this;
						}catch(e){
							console.warn("Could not assign Object to SelectorDef with", selectors);
						}
					}
					break;
				case "string":
					this.selectors = [selectors];
					break;
				default:
					console.warn("Could not construct SelectorDef with selector of type '" + (typeof selectors) + "':", selectors);
			}
		}
		this.refineFunc = refineFunc;
		this.within = within;
		return this;
	}
	add(selectors="", refineFunc=null, within=null){
		this.selectors.push(new SelectorDef(selectors, refineFunc, within));
		return this;
	}
	find(within=null, separate=false){
		if(!within)
			within = document;
		var r;
		if(separate)
			r = { length: 0, hasEMpty: false };
		else
			r = $();
		var i = 0;
		for(let sel of this.selectors){
			let f = null;
			if(sel instanceof SelectorDef){
				f = sel.find(within);
			}
			else{
				f = $(within).find(sel);
				if(this.refineFunc)
					f = this.refineFunc(f);
			}
			if(separate){
				if(f && f.length)
					r[i] = f;
				else{
					r[i] = null;
					r.hasEMpty = true;
				}
				r.length++;
			}
			else if(f && f.length)
				r = r.add(f);
			i++;
		}
		return r;
	}
	get(separate = false){
		return this.find(this.within, separate);
	}
	waitFor(cb, stopForAny = false, requireAll = false, cbFail=null, doneClass="", interval=200, maxTries=50){
		console.log("waiting, maxTries = " + maxTries);
		var res = this.get(requireAll);
		var runAgain = true;
		if(res.length>0){
			runAgain = maxTries <= -1 && !stopForAny;
			if(requireAll){
				if(!res.hasEMpty){
					var results = res[0];
					console.log("got all?", res);
					for(let i = 1; i<res.length; i++)
						results = results.add(res[i]);
					cb(results);
				}
				else
					runAgain = true;
			}
			else
				cb(res);
		}
		else
			runAgain = true;
		if(runAgain){
			var t = this;
			if(maxTries>0){
				maxTries--;
			} else if(maxTries==0){
				if(typeof cbFail == "function")
					cbFail();
				return;
			}
			this.__timer = setTimeout(function(){
				t.waitFor(cb, stopForAny, requireAll, cbFail, doneClass, interval, maxTries);
			}, interval);
		}
	}
	stop(){
		if(this.__timer)
			clearTimeout(this.__timer);
	}
}
String.prototype.after = function(str, fromRight, returnAll){
	if(fromRight === undefined)
		fromRight = false;
	if(returnAll === undefined)
		returnAll = false;
	var os = this.indexOf(str);
	if(fromRight)
		os = this.lastIndexOf(str);
	if(os<0)
		return returnAll?this:"";
	return this.substring(os + str.length);
};
String.prototype.before = function(str, fromRight, returnAll){
	if(fromRight === undefined)
		fromRight = false;
	if(returnAll === undefined)
		returnAll = false;
	var os = this.indexOf(str);
	if(fromRight)
		os = this.lastIndexOf(str);
	if(os<0)
		return returnAll?this:"";
	return this.substr(0, os);
};
function bpMenu(){
	var r = {};
	r.obj = null;
	r.items = {};
	r.styles = {
		default: {
			colors : {
				background : "#fff",
				text : "#333",
				item : "#555",
				itemHover : "#46a",
				itemBack : "transparent",
				frame : "#fff"
			},
			paddingFrame : "10px",
			radiusFrame : "10px",
			fontSize : "18px"
		}
	};
	r.style = r.styles.default;
	r.setup = function(override=false){
		var head, script;
		head = document.getElementsByTagName("head")[0];
//		if(typeof $ !== "function"){
//			console.log("jQuery not available?\nTrying to insert & load...", typeof $);
//			script = document.createElement("script");
//			script.type = "text/javascript";
//			script.onload = function(){
//				r.setup();
//			};
//			script.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js";
//			head.appendChild(script);
//			return;
//		}
		if(typeof bpModal !== "function"){
			console.log("BP Modal not available?\nTrying to insert & load...", typeof bpModal);
			script = document.createElement("script");
			script.type = "text/javascript";
			script.onload = function(){
				r.setup();
			};
			script.src = "https://benjamin-philipp.com/js/gm/funcs.js?funcs=bpModal";
			head.appendChild(script);
			return;
		}
//		console.log("Setup BP Menu");
		if(override){
			$("body>#bpMenu").remove();
		}
		r.injectStyles(override);

		if($("body>#bpMenu").length <=0)
			$("body").append("<div id='bpMenu'><div class='inner'></div></div>");
		r.obj = $("body>#bpMenu");
	};
	r.injectStyles = function(override=false){
		if(override)
			$("#bpMenuStyle").remove();
		if($("#bpMenuStyle").length<=0)
			$("head").append(`<style id="bpMenuStyle">
			.bpbutton{
				padding: 5px;
				display: inline-block;
				background: #aaa;
				color: #333;
				cursor: pointer;
				font-weight: 600;
				line-height: 1em;
			}
			.bpbutton:hover, .bpbutton.on{
				background: #1c82fa;
				color: #fff;
			}
			
			#bpMenu{
				position: fixed;
				z-index: 99999;
				top: -50px;
				right: 0px;
				height: 70px;
				display: inline-block;
				transition: top 0.5s;
				padding: 0px 0px 10px;
			}
			#bpMenu .inner{
				display: inline-block;
				background-color: #fff;
				color: #aaa;
				padding: 0px 10px 5px;
				border-radius: 0 0 10px 10px;
				box-shadow: 0 0 10px rgba(0,0,0,0.5);
			}
			#bpMenu:hover{
				top: 0px;
			}
			#bpMenu .bp{
				display: inline-block;
				padding: 5px;
				font-size: ' + r.style.fontSize + ';
			}
			#bpMenu .bp.item{
				color: ' + r.style.colors.item + ';
				font-weight: bold;
				cursor: pointer;
			}
			#bpMenu .bp.item:hover{
				color: ' + r.style.colors.itemHover + ';
			}
			#bpMenu .bp+.bp{
				margin-left: 10px;
			}
			</style>`);
	};
	r.add = function(id, html, cb=null, title="", override=false, sel=""){
		let l = $("body>#bpMenu>.inner #" + id);
		let add = true;
		if(l.length >0){
			add = false;
			if(override){
				l.remove();
				add = true;
			}
		}
		if(add){
			if(title)
				title = " title='" + title + "'";
			$("body>#bpMenu .inner").append("<div id='" + id + "' class='bp" + (cb?" item":"") + "'" + title + ">" + html + "</div>");
			r.items[id] = $("#bpMenu #" + id);
			if(cb)
				$("#bpMenu #" + id).click(function(e){
					cb(e);
				});
		}
	};
	r.changeStyle = function(obj){
		mergeDeep(r.style, obj);
		r.injectStyles(true);
	};
	r.setup();
	return r;
}
//if("undefined" === typeof bpMenuHelper){ // jshint ignore:line
//	var bpMenuHelper = bpMenu(); // jshint ignore:line
//}
function copyToClipboard(text) {
	if (window.clipboardData && window.clipboardData.setData) {
		// Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
		return window.clipboardData.setData("Text", text);

	}
	else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
		var textarea = document.createElement("textarea");
		textarea.textContent = text;
		textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
		document.body.appendChild(textarea);
		textarea.select();
		try {
			document.execCommand("copy");  // Security exception may be thrown by some browsers.
			msg("Copied.", "success", "", 1000);
			return;
		}
		catch (ex) {
			console.warn("Copy to clipboard failed.", ex);
			return prompt("Copy to clipboard: Ctrl+C, Enter", text);
		}
		finally {
			document.body.removeChild(textarea);
		}
	}
}
if("undefined" == typeof bp_iObject){
	bp_iObject = {
		style: `<style id="bp_iO_style">
	div.bp_iObject{
		color: #fff;
	}
	div.bp_iObject div.bp_iObject{
		display: inline;
		vertical-align: text-top;
	}
	.bp_iObject div.bp_iO_inner{
		white-space: pre;
		border: 1px solid transparent;
		transition: all 0.5s;
	}
	.bp_iO_pseudoContent{
		margin: 0.4em;
	}
	.bp_iO_pseudoContent + .bp_iO_pseudoContent{
		margin-left: 0;
	}
	.bp_iO_pseudoContent:before{
		content: attr(data-value);
	}
	span.bp_iO_meta{
		opacity: 0.7;
		background: #333;
		border: 1px solid #888;
		border-radius: 0.3em;
		font-size: 66%;
	}
	span.bp_iO_indent:before{
		content: "	";
		white-space: pre;
	}
	span.bp_iO_comma{
		display: inline;
		vertical-align: bottom;
	}
	div.bp_iObject>.bp_iO_content{
		color: #bbb;
		white-space: pre;
	}
	div.bp_iObject[data-type="string"]>.bp_iO_content,
	div.bp_iObject span.quotes{
		color: #888;
	}
	span.bp_iO_key{
		font-style: italic;
	}
	.collapsible>span.bp_iO_key{
		cursor: pointer;
	}
	div.bp_iObject[data-type="string"]>.bp_iO_content>span.text{
		color: #fe8;
	}
	div.bp_iObject[data-type="number"]>.bp_iO_content{
		color: #5cf;
	}
	div.bp_iObject[data-type="RegExp"]>.bp_iO_content{
		color: #f48;
	}
	div.bp_iObject[data-type="boolean"]>.bp_iO_content{
		color: #08f;
	}
	div.bp_iObject.collapsed>.bp_iO_content{
		white-space: normal;
	}
	div.bp_iObject.collapsed .bp_iO_inner{
		display: inline-block;
		width: 1px;
		height: 1px;
		overflow: hidden;
		margin-left: -5px;
		opacity: 0.01;
		clip: rect(0 0 0 0);
	}
	div.bp_iObject.collapsible .bracket.closing{
		cursor: pointer;
		pointer-events: all;
	}
	div.bp_iObject.collapsed .bracket.closing:before{
		content: "... ";
	}
	.bp_iObject{
		position: relative;
	}
	.bp_iObject.collapsible>.bp_iO_key:before{
		content: "â–² ";
		position: absolute;
		display: inline-block;
		right: 100%;
		font-size: 66%;
		pointer-events: all;
	}
	.bp_iObject.collapsible.collapsed>.bp_iO_key:before{
		content: "â–¼ ";
	}
	.bp_iO_inner.editing{
		border: 1px inset #888;
		background: #000;
		color: #fff;
		padding: 0.5em;
		margin: 0.2em;
	}
	.bp_iO_copy{
		position: absolute;
		right: 0;
		top:0;
		opacity: 0;
		padding: 0.75em 1em;
		background: #666;
		color: #fff;
		border: 1px solid #fff;
		border-radius: 0.5em;
		cursor: pointer;
		transition: all 0.5s;
	}
	/* .bp_iO_copy::before{
		content: "\\002398  Copy";
	}
	.bp_iObject:hover>.bp_iO_copy{
		opacity: 0.3;
	}
	.bp_iObject:hover>.bp_iO_copy:hover{
		opacity: 1;
		background: #000;
	}*/ /* TODO: make palatable */
	.zeroHeight{
		line-height: 0;
		margin:0;
		padding:0;
		display: none;
	}
	.collapsed br.zeroHeight{
		display: inline;
	}
	.collapsedIndent{
		display: none;
	}
	.collapsed>.bp_iO_content>.bp_iO_inner>.collapsedIndent{
		display: inline;
	}
	</style>`,
		createInteractiveObject: function(obj, onlyOwnProperties=true, indentString="\t", objKey="", level=0, includeLabel = false){
			if("undefined" == typeof bp_iO)
				bp_iO = bp_iObject.setup();
			var indent = "";
			for(i=0; i<level; i++)
				indent += indentString;
			var q = "<span class='quotes'>&quot;</span>";
			var ell = "<span class='bp_iO_ellipsis'>&quot;</span>";
			var r = "";
			var t = typeof obj;
			var typeString = t.replace(/^\w/, (a)=> a.toUpperCase());
			var inner = "";
			var count=0;
			var isArray = obj instanceof Array;
			switch(typeof obj){
				case "object":
					var pt = ""; // + obj.toString(); // TODO: prototype class name?
					if(isArray)
						typeString = "Array";
					else if(obj instanceof RegExp){
						typeString = t = "RegExp";
						inner = obj.toString();
						break;
					}
					typeString += " " + pt;
					if(!obj || !obj.keys){
						inner = obj.toString();
						break;
					}
					var keys = Object.keys(obj);
					if(onlyOwnProperties){
						var okeys = keys;
						keys = [];
						for(let k of okeys){
							if(obj.hasOwnProperty(k))
								keys.push(k);
						}
					}
					count = keys.length;
					for(let i=0; i<keys.length; i++){
						let k = keys[i];
						inner += (isArray?"":`${indent + indentString}`) + createInteractiveObject(obj[k], onlyOwnProperties, indentString, k, level+1, isArray?false:true) + (i<keys.length-1?"<span class='bp_iO_comma'>, </span>" + (isArray?"":"<br />"):"");
					}
					if(!isArray && count>0)
						inner = "<div class='bp_iO_inner'><br class='zeroHeight' />" + inner + "<br /><span class='collapsedIndent'>" + indent + "</span></div>";
					if(isArray)
						inner = "[" + inner + "]";
					else{
						inner = "{" + inner + (inner?indent:"") + "<span class='bracket closing'>}</span>";
					}
				break;
				case "string":
					inner += q + "<span class='text bp_iO_inner'>" + htmlEntities(obj) + "</span>" + q;
					break;
				default:
					inner += "<span class='bp_iO_inner'>" + htmlEntities(obj.toString()) + "</span>";
			}
			r = (objKey && includeLabel?`<span class='bp_iO_key'>${q + objKey + q}</span><span class='bp_iO_type bp_iO_meta bp_iO_pseudoContent' data-value='${typeString}'></span>` + (t=="object"?`<span class='bp_iO_count bp_iO_meta bp_iO_pseudoContent' data-value='(${count})'></span>`:"") + ":&nbsp;" :"") + "<span class='bp_iO_content'>" + inner + "</span>";
			
			r = `<div class="bp_iObject${t=="object" && !(obj instanceof Array) && count>0?" collapsible":""}${level<=0?" root editable":""}" data-type="${t}" data-level="${level}" data-key="${objKey}"><div class="bp_iO_copy"></div>${r}</div>`;
			
			if(level <= 0){
				r = $(r)[0];
				r.bp_iO = {
					ref: obj,
					onlyOwnProperties,
					indentString,
					element: r,
					redraw: function(){
						var e = createInteractiveObject(this.ref, this.onlyOwnProperties, this.indentString);
						this.element.innerHTML = e.innerHTML;
						$(e).remove();
						// console.log(this.element);
					}
				};
			}
			return r;
		},
		setup: function(){
			if("undefined" == typeof bp_iO){
				bp_iO = this;
				$("head").append(this.style);
				$("body").on("click", ".bp_iO_copy", function(e){
					e.stopImmediatePropagation();
					// console.log(e, e.target);
					var r = $(e.target).parent().text();
					copyToClipboard(r);
				});
				$("body").on("click", ".collapsible>.bp_iO_key, .collapsible>.bp_iO_content>.bracket.closing", function(e){
					e.stopImmediatePropagation();
					// console.log(e, e.target);
					var p = $(e.target).parent();
					if(p.hasClass("bp_iO_content"))
						p = p.parent();
					p.toggleClass("collapsed");
				});
				$("body").on("dblclick", ".bp_iObject.root.editable .bp_iO_inner", function(e){
					// if(!$(e.target).is(e.currentTarget))
					// 	return;
					e.stopImmediatePropagation();
					// console.log(e, e.target);
					var o = $(e.currentTarget);
					o.addClass("editing");
					// console.log(e.target, o);
					o.attr("contenteditable", "true");
					o[0].beforeEdit = o.text().trim();
					o[0].focus();
					return false;
				});
				$(document).on("keydown", ".bp_iO_inner.editing", function(e){
					// console.log(e);
					var o = $(e.target);
					if(e.key=="Enter" && !e.shiftKey){
						// console.log("enter!");
						var val_inner = o.text().trim();
						var val_container = o.closest(".bp_iObject").first();
						var val_outer = o.parent().text().trim();
						// console.log("new value?", val_outer, val_inner);
						var path = [];
						var obj = o.parents(".bp_iObject.root");
						if(!obj || obj.length<=0 || !obj[0].bp_iO){
							console.error("Dang, no root found for", o);
						}
						else{
							try{
								obj = obj[0].bp_iO;
								var ref = obj.ref;
								var v = eval(`(function(){return ${val_outer};})();`);
								if(val_container.is(o.parents(".bp_iObject.root").first())){
									// console.log("yup, modifying root");
									for(let k in ref) // TODO: accommodate different types
										delete ref[k];
									for(let k in v)
										ref[k] = v[k];
									obj.redraw();
								}
								else{
									var ancestry = o.parentsUntil(".bp_iObject.root", ".bp_iObject").get();
									ancestry = ancestry.reverse();
									
									for(let i = 0; i<ancestry.length; i++){
										var p = ancestry[i];
										// var key = p.attr("data-key");
										var k = p.dataset.key;
										// console.log(k, p);
										if(i>=ancestry.length-1){
											// console.log(`(function(){return ${val_outer};})();`);
											ref[k] = v;
											var h = createInteractiveObject(ref[k], obj.onlyOwnProperties, obj.indentString, k, i+1, i+1>0);
											val_container.html(h);
											break;
										}
										ref = ref[k];
										path.push(k);
									}
									// console.log(obj, path)
								}
							}catch(e){
								console.error(e);
							}
						}
					}
					else if(e.key=="Escape"){
						// console.log("Esc!");
						o.text(o[0].beforeEdit);
					}
					else
						return;
					
					e.preventDefault();
					o.removeClass("editing");
					o.attr("contenteditable", "false");
				});
				createInteractiveObject = this.createInteractiveObject;
				return this;
			}
		}
	};
}
function dateString(date, format){
     if(date===undefined || date===null || date === "")
        date = new Date();
     if(format===undefined)
        format="YYYY-MM-DD HH:mm:SS";
     else if(format==="file")
        format="YYYY-MM-DD HH-mm-SS";
	date = new Date(date);
     var year = date.getUTCFullYear();
     var months = pad(date.getUTCMonth() + 1);
     var days =  pad(date.getUTCDate());
     var hours = pad(date.getUTCHours());
     var minutes = pad(date.getUTCMinutes());
     var seconds = pad(date.getUTCSeconds());
     return format.replace("YYYY", year)
        .replace("MM", months)
        .replace("DD", days)
        .replace("HH", hours)
        .replace("mm", minutes)
        .replace("SS", seconds);
}
function pad(num){
    var r = String(num);
    if(r.length<=1)
        r = "0" + r;
    return r;
}
function escapeHtml(str){
	return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
String.prototype.escapeHtml = function(){
	return escapeHtml(this);
};
var bpTitleFormats = {
	movies: [
		"[title] [[year]]",
		"[title] ([year])",
		"[title] - [year]"
	],
	series: [
		"[name] - Season [season] Episode [episode] - [title]",
		"[name] - Season [season] Episode [episode]",
		"[name] - S[lzseason]E[lzepisode] - [title]",
		"[name] - S[lzseason]E[lz3episode] - [title]"
	]
};

var bpMediaTitleRegex = {
	movies: [
		/(.+) \[(\d{4})\]$/mi,
		/(.+) \((\d{4})\)$/mi,
		/(.+) - (\d{4})$/mi,
	],
	series: [
		// /(.+?) ?-? (?:(?:season |S)?0?0?(\d+))? ?(?:episode |E|x)0*(\d+(?:-\d+)?)(?: ?[:-]? (.+))?/mi
		/(.+?) ?-? (?:(?:season |S)?0*(\d+))?(?: -|,)?\s*(?:episode |E|x)0*(\d+(?:-\d+)?)(?: ?[:-]? (.+))?/mi
	]
};
{//// Check RegEx against:
	// Some series name 1x12
	// Some series name 1x12 and a title
	// Some series name 1x12 - and a title
	// Some series name S01E12
	// Some series name S01E12 and a title
	// Some series name S01E12 - and a title
	// Some series name S01E12-13
	// Some series name S01E12-13 and a title
	// Some series name S01E12-13 - and a title
	// Some series name - 1x12
	// Some series name - 1x12 and a title
	// Some series name - 1x12 - and a title
	// Some series name - S01E12
	// Some series name - S01E12 and a title
	// Some series name - S01E12 - and a title
	// Some series name - S01E12-13
	// Some series name - S01E12-13 and a title
	// Some series name - S01E12-13 - and a title
	// Some series name Episode 12
	// Some series name Episode 12 and a title
	// Some series name Episode 12 - and a title
	// Some series name Episode 12-13
	// Some series name Episode 12-13 and a title
	// Some series name Episode 12-13 - and a title
	// Some series name Season 1 Episode 12
	// Some series name Season 1 Episode 12 and a title
	// Some series name Season 1 Episode 12 - and a title
	// Some series name Season 1 Episode 12-13
	// Some series name Season 1 Episode 12-13 and a title
	// Some series name Season 1 Episode 12-13 - and a title
	// Some series name - Episode 12
	// Some series name - Episode 12 and a title
	// Some series name - Episode 12 - and a title
	// Some series name - Episode 12-13
	// Some series name - Episode 12-13 and a title
	// Some series name - Episode 12-13 - and a title
	// Some series name - Season 1 Episode 12
	// Some series name - Season 1 Episode 12 and a title
	// Some series name - Season 1 Episode 12 - and a title
	// Some series name - Season 1 Episode 12-13
	// Some series name - Season 1 Episode 12-13 and a title
	// Some series name - Season 1 Episode 12-13 - and a title
	// Some series name - Season 1 Episode 12: and a title
	// Some series name - Season 1 Episode 12 : and a title
	// Some series name - Season 1 Episode 12-13: and a title
	// Some series name - Season 1 Episode 12-13 : and a title
	// Some series name - Season 1, Episode 12
	// Some series name - Season 1, Episode 12 and a title
	// Some series name - Season 1, Episode 12 - and a title
	// Some series name - Season 1, Episode 12-13
	// Some series name - Season 1, Episode 12-13 and a title
	// Some series name - Season 1, Episode 12-13 - and a title
	// Some series name - Season 1, Episode 12: and a title
	// Some series name - Season 1, Episode 12 : and a title
	// Some series name - Season 1, Episode 12-13: and a title
	// Some series name - Season 1 - Episode 12
	// Some series name - Season 1 - Episode 12 and a title
	// Some series name - Season 1 - Episode 12 - and a title
	// Some series name - Season 1 - Episode 12-13
	// Some series name - Season 1 - Episode 12-13 and a title
	// Some series name - Season 1 - Episode 12-13 - and a title
	// Some series name - Season 1 - Episode 12: and a title
	// Some series name - Season 1 - Episode 12 : and a title
	// Some series name - Season 1 - Episode 12-13: and a title
	// Some series name - Season 1 - Episode 12-13 : and a title
}

function guessMovieOrTV(title){
	var tit = title.replace(/[â€”â€“]/g, "-"); // em-dash, en-dash
	for(let rex of bpMediaTitleRegex.series){
		if(rex.test(tit))
			return "TV";
	}
	for(let rex of bpMediaTitleRegex.movies){
		if(rex.test(tit))
			return "Movie";
	}
	return false;
}

function formatMovieTV(tit, templateSeries, templateMovie){
	switch(guessMovieOrTV(tit)){
		case "TV":
			return formatEpisodeTitle(tit, templateSeries);
		case "Movie":
			return formatMovieTitle(tit, templateMovie);
		default:
			console.log("Could not identify TV or Movie title");
			return tit;
	}
}

function formatMovieTitle(tit, template){
	if(!template)
		template = bpTitleFormats.movies[0];
		
//	console.log("preferred format: " + template);
	var match = false;
	for(let rex of bpMediaTitleRegex.movies){
		match = tit.match(rex);
		if(match){
//			match = rex.exec(tit);
			console.log("title matches format " + rex.toString(), match);
			break;
		}
	}
	if(!match){
		console.log("Title format not recognized", tit);
		return tit;
	}
	var name = match[1];
	var year = match[2];
	
	tit = template.replace("[title]", name)
		.replace("[year]", year);
	console.log("formatted title:", tit);
	return tit;
}

function formatEpisodeTitle(tit, template){
	if(!template)
		template = bpTitleFormats.series[0];
		
//	console.log("preferred format: " + template);
	
	tit = tit.replace(/[â€”â€“]/g, "-"); // em-dash, en-dash
	var match = false;
	for(let rex of bpMediaTitleRegex.series){
		match = tit.match(rex);
		if(match){
//			match = rex.exec(tit);
			console.log("title matches format " + rex.toString(), match);
			break;
		}
	}
	if(!match){
		console.log("Title format not recognized", tit);
		return tit;
	}
	var name = match[1];
	var season = match[2];
	if(!season)
		season = 1;
	var episode = match[3];
	var title = (match.length>=5 && match[4] !== undefined)? match[4] : "";
	if((/(Episode #? ?\d+|S\d+ ?E\d+)/i).test(title))
		title = "";
//	console.log({"name" : name, "season" : season, "episode" : episode, "title" : title});
	
	
	if(title===""){
		template = template.replace(/ ?-? \[title\]/, "");
		console.log("no title:", template);
	}
	
	tit = template.replace("[name]", name)
		.replace("[season]", season)
		.replace("[episode]", episode)
		.replace(/\[lz(\d*)season]/i, function(_,p){
			if(p==="")
				p = 2;
			return lz(season, p);
		})
		.replace(/\[lz(\d*)episode]/i, function(_,p){
			if(p==="")
				p = 2;
			return lz(episode, p);
		})
		.replace("[title]", title);
	console.log("formatted title:", tit);
	return tit;
}

function sanitize(str){
	str = str.replace(/[\\"]/g, "-");
	str = str.replace(/\?/g, "");
	str = str.replace(/[\/:]/g, " - ");
	str = str.replace(/[\/:]/g, " - ");
	str = str.replace(/\s+-\s*(?:-+\s+)+/g, " - ");
	str = str.replace(/\s\s+/g, " ");
	return str;
}

function lz(num, places = 2){
	return ("0000" + num).slice(-places);
}

function varToPretty(str, casing="title", isSecond=false){
	str = str
		.replace(/(?:([^A-Z])([A-Z]))|(?:([a-zA-Z])([^a-zA-Z]))/g, "$1$3 $2$4")
		.replace(/_/g, " ")
		.replace(/\s\s+/g, " ")
		.replace(/(max|min)/gi, "$1imum");
	if(casing == "title")
		str = str.replace(/(^|\s+)([a-z])/g, (_, a, b) => a + b.toUpperCase());
	if(isSecond)
		return str;
	return varToPretty(str, casing, true);
}

function toTitleCase(str, preserveCaps=false, preserveAllCaps=false){
	return str.replace(/\w[^\s_:-]*/g, function(txt){
		var rest = txt.substr(1);
		if(!preserveCaps){
			if(preserveAllCaps){
				if(txt.charAt(0) != txt.charAt(0).toUpperCase()|| rest != rest.toUpperCase())
					rest = rest.toLowerCase();
			}
			else
				rest = rest.toLowerCase();
		}
		return txt.charAt(0).toUpperCase() + rest;
	});
}
const mimeTypes = {
	".aac": "audio/aac",
	".abw": "application/x-abiword",
	".arc": "application/x-freearc",
	".avif": "image/avif",
	".avi": "video/x-msvideo",
	".azw": "application/vnd.amazon.ebook",
	".bin": "application/octet-stream",
	".bmp": "image/bmp",
	".bz": "application/x-bzip",
	".bz2": "application/x-bzip2",
	".cda": "application/x-cdf",
	".csh": "application/x-csh",
	".css": "text/css",
	".csv": "text/csv",
	".doc": "application/msword",
	".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	".eot": "application/vnd.ms-fontobject",
	".epub": "application/epub+zip",
	".gz": "application/gzip",
	".gif": "image/gif",
	".htm": "text/html",
	".html": "text/html",
	".ico": "image/vnd.microsoft.icon",
	".ics": "text/calendar",
	".jar": "application/java-archive",
	".jpeg.jpg": "image/jpeg",
	".js": "text/javascript",
	".json": "application/json",
	".jsonld": "application/ld+json",
	".mid.midi": "audio/midi",
	".mjs": "text/javascript",
	".mp3": "audio/mpeg",
	".mp4": "video/mp4",
	".mpeg": "video/mpeg",
	".mpkg": "application/vnd.apple.installer+xml",
	".odp": "application/vnd.oasis.opendocument.presentation",
	".ods": "application/vnd.oasis.opendocument.spreadsheet",
	".odt": "application/vnd.oasis.opendocument.text",
	".oga": "audio/ogg",
	".ogv": "video/ogg",
	".ogx": "application/ogg",
	".opus": "audio/opus",
	".otf": "font/otf",
	".png": "image/png",
	".pdf": "application/pdf",
	".php": "application/x-httpd-php",
	".ppt": "application/vnd.ms-powerpoint",
	".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
	".rar": "application/vnd.rar",
	".rtf": "application/rtf",
	".sh": "application/x-sh",
	".svg": "image/svg+xml",
	".swf": "application/x-shockwave-flash",
	".tar": "application/x-tar",
	".tif": "image/tiff",
	".tiff": "image/tiff",
	".ts": "video/mp2t",
	".ttf": "font/ttf",
	".txt": "text/plain",
	".vsd": "application/vnd.visio",
	".wav": "audio/wav",
	".weba": "audio/webm",
	".webm": "video/webm",
	".webp": "image/webp",
	".woff": "font/woff",
	".woff2": "font/woff2",
	".xhtml": "application/xhtml+xml",
	".xls": "application/vnd.ms-excel",
	".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	".xml": "application/xml",
	".xul": "application/vnd.mozilla.xul+xml",
	".zip": "application/zip",
	".3gp": "video/3gpp",
	".3g2": "video/3gpp2",
	".7z": "application/x-7z-compressed"
};

function getContentTypeByExtension(ext){
	var defaultType = "application/octet-stream";
	if(typeof ext != "string")
		return console.warn('[getContentTypeByExtension] Invalid type supplied, please supply string', ext) || defaultType;
	if(ext.indexOf(".")<0)
		ext = "." + ext;
	else
		ext = ext.replace(/^.*(?=[.]\w+$)/, '');
	var mime = mimeTypes[ext.toLowerCase()];
	if(!mime)
		return console.warn('[getContentTypeByExtension] Failed to resolve for content name: %s', ext) || defaultType;
	return mime;
}
function getParam(s){
	return getParamFromString(location.href, s);
}

function getParamFromString(u, s){
	var url = new URL(u);
	return url.searchParams.get(s);
}
function getProperties(obj, filter=false, skipNative = true, _stringify=false){
	var r = {};
	var i = 0;
	for(let k in obj){
		let v = obj[k];
		let include = true;
		switch(typeof filter){
			case "function":
				include = filter(v);
				break;
			case "object":
				if(filter instanceof RegExp)
					include = filter.test(k);
				break;
			case "string":
				let types = filter.split(/[, ]/);
				include = false;
				let inverted = false;
				for(let t of types){
					t = t.trim();
					if(t == "")
						continue;
					if(t.substr(0,1)=="!"){
						inverted = true;
						t = t.substr(1);
					}
					if((t == "function" && v && v.call)){
						if(!inverted){
							v = v.toString();
							include = !skipNative || v.indexOf("[native code]")<0;
						}
						else
							include = false;
						break;
					}
					else if((t == typeof v) ^ inverted){
						include = true;
						break;
					}
				}
				break;
		}
		if(include){
			if(_stringify && (typeof v != "string")){
				let maybeRemoveQuotes = false;
				try{
					v = JSON.stringify(v, function(k, v){
						if(typeof v == "function" || (v && v.call)){
							v = v.toString();
							maybeRemoveQuotes = true;
							return v;
						}
						return v;
					}, "\t");
				}catch(e){
					maybeRemoveQuotes = false;
					v = v.toString();
				}
				if(maybeRemoveQuotes && typeof v == "string" && v.startsWith("\"") && v.endsWith("\""))
					v = v.substring(1, v.length-1);
			}
			r[k] = v;
		}
	}
	return r;
}
function getSelectedElements(){
	var allSelected = [];
	try{
		var selection = window.getSelection();
		var range = selection.getRangeAt(0);
		if(range.startOffset == range.endOffset)
			return allSelected;
		var cont = range.commonAncestorContainer;
		if(!cont){
//			console.log("no parent container?");
			return range.startContainer;
		}
		if(!cont.nodeName || cont.nodeName == "#text" || !cont.getElementsByTagName){
			var p = cont.parentElement;
//			console.log("weird container or text node; return parent", cont, p);
			if(!p){
//				console.log("actually, never mind; has no parent. Return element instead");
				return [cont];
			}
			return [p];
		}
		var allWithinRangeParent = cont.getElementsByTagName("*");

		for (var i=0, el; el = allWithinRangeParent[i]; i++){ // jshint ignore:line
			// The second parameter says to include the element 
			// even if it's not fully selected
			if (selection.containsNode(el, true))
				allSelected.push(el);
		}
	}catch(e){
		console.log(e);
	}
	return allSelected;
}
function htmlEntities(str, nl2br=false){
	str = str.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
		return '&#' + i.charCodeAt(0) + ';';
	});
	if(nl2br)
		str = str.replace(/\r?\n/g, "<br />");
	return str;
}
function isNativeFunction(value) {
	// Used to resolve the internal `[[Class]]` of values
	var toString = Object.prototype.toString;

	// Used to resolve the decompiled source of functions
	var fnToString = Function.prototype.toString;

	// Used to detect host constructors (Safari > 4; really typed array specific)
	var reHostCtor = /^\[object .+?Constructor\]$/;

	// Compile a regexp using a common native method as a template.
	// We chose `Object#toString` because there's a good chance it is not being mucked with.
	var reNative = RegExp('^' +
		// Coerce `Object#toString` to a string
		String(toString)
		// Escape any special regexp characters
		.replace(/[.*+?^${}()|[\]\/\\]/g, '\\$&')
		// Replace mentions of `toString` with `.*?` to keep the template generic.
		// Replace thing like `for ...` to support environments like Rhino which add extra info
		// such as method arity.
		.replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);
	var type = typeof value;
	return type == 'function'
		// Use `Function#toString` to bypass the value's own `toString` method
		// and avoid being faked out.
		? // jshint ignore:line
		reNative.test(fnToString.call(value))
		// Fallback to a host object check because some environments will represent
		// things like typed arrays as DOM methods which may not conform to the
		// normal native pattern.
		:
		(value && type == 'object' && reHostCtor.test(toString.call(value))) || false;
}
function isPrimitive(obj){
	if(typeof obj == "undefined" || obj === null)
		return true;
	if(typeof obj == "object" || typeof obj == "function")
		return false;
	return true;
}
function hasJQuery(){
	if(typeof $ == "function" && typeof $.prototype == "object" && typeof $.fn != "undefined")
		return $;
	if(typeof jQuery == "function" && typeof jQuery.prototype == "object" && typeof jQuery.fn != "undefined")
		return jQuery;
	return false;
}

function isJQuery(obj){
	if(!obj || typeof obj != "object")
		return false;
	var jq = hasJQuery();
	if(!jq)
		return false;
	return obj instanceof jq;
}

function jqExtend(jQ=false){
	if(!jQ)
		jQ = hasJQuery();
	if(jQ){
		var fn = jQ.fn;
		fn.selectText = function(){
			var doc = document;
			for(var i = 0; i<this.length; i++){
				var element = this[i];
				var range;
				if (doc.body.createTextRange){
					range = document.body.createTextRange();
					range.moveToElementText(element);
					range.select();
				} else if (window.getSelection){
					var selection = window.getSelection();
					range = document.createRange();
					range.selectNodeContents(element);
					selection.removeAllRanges();
					selection.addRange(range);
				}
			}
		};

		fn.fare = function(){
			$(this).fadeOut(function(){
				$(this).remove();
			});
		};

		fn.textOnly = function(trim=true){
			var c = this.clone();
			c.children().remove();
			if(trim)
				return c.text().trim();
			return c.text();
		};
	}
	// else
	// 	console.log("no jQuery, no extensions :(");
}
jqExtend();
class BPLogger {
	constructor(name = false, prefix = false, debugging = false, level = 1){
		if(!name && typeof GM_info !== "undefined")
			name = GM_info.script.name;
		
		if(prefix === false && name)
			prefix = name;
		
		if(!name)
			name = "Logger";
		
		this.name = name;
		this.prefix = prefix;
		this.debugging = debugging;
		this.level = level;

		this.colors = {
			default: [180, 100],
			warn: [60, 100],
			error: [0, 100],
			success: [150, 100]
		};
		this.history = [];
		this.keepHistory = false;

		if (typeof name == "object"){
			Object.assign(this, name);
		}
		return this;
	}

	writeLog(args, type = "default", level = 1) {
		if (this.keepHistory)
			this.history.push([Date.now(), type, level, args]);
		if (level > this.level)
			return;
		if(this.prefix)
			args = ["%c" + this.prefix + ":", `color: hsl(${this.colors[type][0]},${this.colors[type][1]}%,80%); background-color: hsl(${this.colors[type][0]},${this.colors[type][1]}%,15%); font-weight: 900!important`, ...args];
		if (this.debugging)
			args = [...args, new Error().stack.replace(/^\s*(Error|Stack trace):?\n/gi, "").replace(/^([^\n]*\n)/, "\n")];
		
		if(["warn", "error"].includes(type))
			console[type](...args);
		else
			console.log(...args);
	}
	log(...args){
		this.writeLog(args);
	}
	warn(...args){
		this.writeLog(args, "warn");
	}
	error(...args){
		this.writeLog(args, "error");
	}
	success(...args){
		this.writeLog(args, "success");
	}
}

function BPLogger_default(...args){
	if(args.length<=0)
		args = "";
	var logger = new BPLogger(args);
	log = function(...args){
		logger.log(...args);
	};
	warn = function(...args){
		logger.warn(...args);
	};
	error = function(...args){
		logger.error(...args);
	};
	success = function(...args){
		logger.success(...args);
	};
	return logger;
}
String.prototype.matches = function(rex){
	if(!(rex instanceof RegExp))
		return log("Not a regular Expression:", rex);
	return rex.exec(this);
};

function mergeDeep(target, source, mutate=true){
	let output = mutate ? target : Object.assign({}, target);
	if(typeof target == "object"){
		if(typeof source != "object")
			source = {source};
			
		Object.keys(source).forEach(key => {
			if(typeof source[key] == "object"){
				if(!(key in target))
					Object.assign(output, { [key]: source[key] });
				else
				output[key] = mergeDeep(target[key], source[key]);
			}else{
				Object.assign(output, { [key]: source[key] });
			}
		});
	}
	return output;
}
function bpModal(){
	
	var r = {};
	r.messages = [];
	r.count = 0;
	r.setup = function(){
//		if(typeof $ !== "function"){
//			console.log("jQuery not available?\nTrying to insert & load...", typeof $);
//			var head = document.getElementsByTagName("head")[0];
//			var script = document.createElement("script");
//			script.type = "text/javascript";
//			script.onload = function(){
//				r.setup();
//			};
//			script.id="bpJQ";
//			script.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js";
//			head.appendChild(script);
//			return;
//		}
//		console.log("Actual setup with jQuery");
		if($("head #bpModalStyle").length<=0){
			$("head").append(`<style id="bpModalStyle">
				#messageoverlays{
					position:fixed;
					top:20vh;
					z-index:100;
					text-align:left;
					margin: 0 auto;
					left:50%;
					transform: translate(-50%, 0px);
				}

				#messageoverlays>.table{
					margin: 0px auto;
				}

				#messageoverlays .msg{
					display:inline-block;
					width:auto;
					margin: 5px auto;
					position:relative;
					padding: 10px;
					box-sizing: border-box;
					border-radius: 5px;
				}
				#messageoverlays .msg{
					border: 1px solid #666;
					background-color: #ddd;
					color: #333;
				}
				#messageoverlays .msg.dark,
				.dark #messageoverlays .msg,
				#messageoverlays.dark .msg{
					border: 1px solid #ccc;
					background-color: #333;
					color: #ccc;
				}

				#messageoverlays .msg.error{
					border-color: #a10;
					color: #710;
					background-color: #ffcabf;
				}
				#messageoverlays .msg.dark.error,
				.dark #messageoverlays .msg.error,
				#messageoverlays.dark .msg.error{
					background-color: #300;
					color: #b66;
					border: 1px solid #b66;
				}

				#messageoverlays .msg.warn{
					border-color: #dd0;
					color: #bb0;
					background-color: #fec;
				}
				#messageoverlays .msg.dark.warn,
				.dark #messageoverlays .msg.warn,
				#messageoverlays.dark .msg.warn{
					background-color: #330;
					color: #bb6;
					border: 1px solid #bb6;
				}

				#messageoverlays .msg.success{
					border-color: #190;
					color: #070;
					background-color: #bf9;
				}
				#messageoverlays .msg.dark.success,
				.dark #messageoverlays .msg.success,
				#messageoverlays.dark .msg.success{
					background-color:#030;
					color:#6b6;
					border:1px solid #6b6;
				}

				.closebutton{
					font-weight: 900;
					font-size: 12px;
					cursor: pointer;
					z-index: 20;
					opacity: 0.75;
					color: #fff;
					background-color: #a10;
					padding: 0 5px 1px;
					border-radius: 100%;
					position: absolute;
					right: -5px;
					top: -2px;
					line-height: 16px;
				}

				.closebutton:hover,
				.bpModback .modclose:hover{
					opacity: 1;
				}


				.bpModback{
					position:fixed;
					width:100%;
					height:100%;
					display:table;
					left:0;
					top:0;
					z-index:99000;
				}
				
				.bpModback.tint{
					background-color:rgba(0,0,0,0.5);
				}
				
				.bpModback.nomodal{
					display:block;
					width: auto;
					height: auto;
					left: 50%;
					top: 20px;
					transform: translateX(-50%);
				}
				
				.bpModback .modcent{
					display:table-cell;
					vertical-align:middle;
					height:100%;
					max-height:100%;
					min-height:100%;
				}
				
				.bpModback.nomodal .modcent{
					height:auto;
					max-height:auto;
				}
				
				.bpModback .modtable{
					display:table;
					margin:auto;
					position:relative;
					left:0;
				}
				
				.bpModback .modframe{
					border-radius: 6px;
					border:10px solid #fff;
					display:block;
					background-color: #fff;
					box-shadow: 0 0 20px rgba(0,0,0,0.5);
					max-height: 90vh!important;
					max-width: 90vw!important;
					overflow-y:auto;
				}
				
				.bpModback .modclose{
					display:block;
					background-color: #000;
					color: #fff;
					opacity:0.7;
					position:absolute;
					right:-12px;
					top:-12px;
					-webkit-border-radius: 20px;
					-moz-border-radius: 20px;
					border-radius: 20px;
					border:4px solid #fff;
					font-weight:900;
					font-size:12pt;
					padding:0px 7px;
					cursor:pointer;
					z-index:400;
				}
				
				.bpModback .modbox{
					position:relative;
					display: table;
					padding:20px 20px 10px;
					color:#666;
					overflow:hidden;
					display:block;
					/*text-align:center;*/
				}
				.bpModback .table{
					display:table;
				}
				
				.bpModback .tr{
					display:table-row;
				}
				
				.bpModback .td{
					display: table-cell;
				}
				#watch #player{
					height: 200px;
				}
				</style>`);
		}
	};
	r.msg = function(instr, id="", modal=true, callback=null){
		r.count++;
		if(!id){
			id = "bpmod" + r.count;
		}
		var noclose = false;
		if(typeof(modal)=="string" && modal == "noclose"){
			noclose = true;
			modal = true;
		}
		var m = {
			id : id,
			msg: instr,
			callback: callback,
			modal: modal,
			obj: $("<div class='bpModback " + (!!modal?"tint":"nomodal") + (noclose?" noclose":"") + "' id='" + id + "'><div class='tr'><div class='modcent'><div class='modtable'><div class='modclose'>X</div><div class='modframe'><div class='modbox'>" + instr + "</div></div></div></div></div></div>"),
			close: function(){
				this.obj.remove();
				delete r.messages[this.id];
				if(this.callback)
					this.callback(this);
			}
		};

		$("body").append(m.obj);
		
		$("#" + id + ":not('.noclose') .modcent").click(function(e){
			if(e.target == this)
				m.close(this);
		});
		$("#" + id + " .modclose").click(function(e){
			m.close(this);
		});
		r.messages[id] = m;
		return m;
	};
	r.close = function(el="all"){
		if(el=="all"){
			
		}
	};
	r.setup();
	return r;
}
//if("undefined" === typeof bpModHelper){ // jshint ignore:line
//	var bpModHelper = bpModal(); // jshint ignore:line
//}
function message(content, classname, id, expirein, closable){
	expirein = typeof expirein !== 'undefined' ? expirein : 0;
	if(closable===undefined)
		closable = true;
	var expires = expirein !== 0 ? true : false;
	if (id === undefined || id === ""){
		for (var i = 0; i < 512; i++){
			if ($(document).find("#message-" + i)[0] !== undefined){} else {
				this.id = "message-" + i;
				break;
			}
		}
	} else {
		this.id = id;
	}
	var fid = this.id;
	this.expire = function(){
		if (expirein > 0){
			if(this.extimer)
				window.clearTimeout(this.extimer);
			this.extimer = window.setTimeout(function(){
				$("#" + fid).fadeOut(function(){
					$("#" + fid).remove();
				});
			}, expirein);
		}
	};
	this.html = "<div id='" + this.id + "' class='table'><div class='msg " + classname + "'>" + content + (closable?"<div class='closebutton' id='c-" + this.id + "'>x</div>":"") + "</div></div>";
}

function overlaymessage(content, classname, id, expirein, closable){
	expirein = typeof expirein !== 'undefined' ? expirein : 5000;
	classname = classname || "hint";
	id = id || "";
	var curmes = new message(content, classname, id, expirein, closable);
	//console.log(curmes);
	if($("#messageoverlays").length<=0)
		$("body").append("<div id='messageoverlays'></div>");
	$("#messageoverlays").append(curmes.html);
	$(".msg .closebutton").off("click").on("click", function(){
		console.log("close", $(this).parent().parent());
		$(this).parent().parent().fare();
	});
	curmes.expire();
}

function msg(content, classname, id, expirein){
	overlaymessage(content, classname, id, expirein);
}

function msgbox(content, classname="", id=""){
	if (id === undefined || id === ""){
		for (var i = 0; i < 512; i++){
			if ($(document).find("#message-" + i)[0] !== undefined){} else {
				id = "message-" + i;
				break;
			}
		}
	} else {
		id = id;
	}
	return "<div id='" + id + "' class='msg " + classname + "'>" + content + "</div>";
}
String.prototype.rIndexOf = function(regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
};
var regEsc = regEsc?regEsc : function(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

String.prototype.replaceAll = function(str1, str2, insensitive)
{
    return this.replace(new RegExp(regEsc(str1),(insensitive?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
};
function scrollIntoView(object, offsetTop = 20, offsetLeft = 20){
	object = $(object);
	if(object.length<=0)
		return;
	object = object[0];
	var offset = $(object).offset();
	$('html, body').animate({
		scrollTop: offset.top - offsetTop,
		scrollLeft: offset.left - offsetLeft
	});
	object.scrollIntoView();
}
class elementSelector{
	constructor(element=false, attributes=true){
		this.tagName = 
		this.id = 
		this.className = 
		this.sibling = 
		"";
		this._attribs = {};
		if(element){
			if(isJQuery(element)){
				if(element.length<=0)
					return;
				element = element[0];
			}
			if(element instanceof HTMLElement){
				var t = this;
				this.element = element;
				this.tagName = element.tagName.toLowerCase();
				if(element.id)
					this.id = "#" + element.id;
				if(element.className){
					this.className = "." + element.className.trim().replace(/\s+/g, ".");
				}
				if(attributes)
					for(let attr of element.attributes){
						if(["id", "class"].includes(attr.name))
							continue;
						if(typeof attributes == "string")
							attributes = [attributes];
						if(attributes instanceof Array && !attributes.includes(attr.name))
							continue;
						if(attr.value)
							this._attribs[attr.name] = attr.value;
					}
				
				var p = element.parentElement;
				if(p && p.childElementCount>1){
					var sibs = p.querySelectorAll(":scope > " + this.tagName);
					if(sibs && sibs.length>1){
						for(let i = 0; i<sibs.length; i++){
							let sib = sibs[i];
							if(sib == element){
								// console.log("found in siblings:", el);
								if(i==0)
									t.sibling = ":first-of-type";
								else if(i==sibs.length-1)
									t.sibling = ":last-of-type";
								else
									t.sibling = ":nth-of-type(" + (i+1) + ")";
								return false;
							}
							// console.log("not same:", sib, el);
						}
					}
				}
			}
		}
	}
	attribs(filter=false){
		var r = "";
		if(typeof filter == "string")
			filter = [filter];
		for(let k in this._attribs){
			if(filter instanceof Array && !filter.includes(k))
				continue;
			let v = this._attribs[k];
			r += `[${k}="${v}"]`;
		}
		return r;
	}
	get attributes(){
		return this.attribs();
	}
	clone(){
		var r = new elementSelector();
		Object.assign(r, this);
		r._attribs = {};
		for(let k in this._attribs)
			r._attribs[k] = this._attribs[k];
		return r;
	}
	toString(includeAttribs = true, includeSibling = true){
		return this.tagName + this.id + this.className + (includeAttribs?this.attribs(includeAttribs):"") + (includeSibling?this.sibling:"");
	}
	countMatches(descendants = null, includeAttribs = true, includeSibling = true){
		if(descendants)
			return descendants.add(this, true).toString(includeAttribs, includeSibling);
		var s = this.toString(includeAttribs, includeSibling);
		if(s)
			return document.querySelectorAll(s).length;
		return 0;
	}
}
class elementSelectorChain{
	constructor(elements = false, reverse = false, attributes=true){
		this.selectors = [];
		if(elements){
			if(isJQuery(elements))
				elements = elements.get();
			
			if(elements instanceof Array){
				if(reverse)
					elements = elements.reverse();
				for(let e of elements){
					if(!e){
						this.add(null);
						continue;
					}
					if(e instanceof elementSelector)
						this.add(e);
					else
						this.add(new elementSelector(e, attributes));
				}
			}
			else if(elements instanceof HTMLElement)
				this.add(new elementSelector(elements, attributes));
			else console.warn("elementSelectorChain: Could not construct with", elements, ", starting empty");
		}
	}
	add(selector, toStart=false){
		if(toStart){
			this.selectors = [selector, ...this.selectors];
			return this;
		}
		this.selectors.push(selector);
		return this;
	}
	each(func, reverse=false){
		var l = this.selectors.length-1;
		for(let i = 0; i<=l; i++){
			let j = reverse?l-i:i;
			let e = this.selectors[j];
			let r  = func(e, j);
			if(r===false)
				break;
			if(r === null || r instanceof elementSelector)
				this.selectors[j] = r;
		}
	}
	length(includeEmpty=false){
		if(includeEmpty)
			return this.selectors.length;
		var c = 0;
		for(let s of this.selectors)
			if(s) c++;
		return c;
	}
	get(ix){
		return this.selectors[ix];
	}
	getElements(){
		var r = [];
		var s = this.toString();
		if(s)
			r = document.querySelectorAll(s);
		return r;
	}
	clone(){
		var r = new elementSelectorChain();
		this.each(function(s){
			if(!s)
				r.add(null);
			else
				r.add(s.clone());
		});
		return r;
	}
	toString(includeAttribs = true, includeSibling = true){
		var r = "";
		var isDirect = true;
		var isFirst = true;
		for(let e of this.selectors){
			if(!e){
				isDirect = false;
				continue;
			}
			r += (isFirst?"":(isDirect?" > ":" ")) + e.toString(includeAttribs, includeSibling);
			isDirect = true;
			isFirst = false;
		}
		return r;
	}
	countMatches(includeAttribs = true, includeSibling = true){
		var s = this.toString(includeAttribs, includeSibling);
		if(s)
			return document.querySelectorAll(s).length;
		return 0;
	}
}

/**
 * @name getSelector
 * @description Get a matching CSS selector for the given HTML Element
 * @param {(HTMLElement|jQuery)} element - The object (instance of HTMLElement or jQuery/$) for which to compose the selector
 * @param {boolean} [minimal=true] - Try to trim selectors that don&apos;t narrow down the search on this page? (default: true)
 * @param {(boolean|string|string[]|"auto")} [attributes="auto"] - Should attributes be included? (default: "auto")
 * - string/string[]: Filter by attribute name[list] 
 * - \"auto\": include if it narrows down the search
 * @param {boolean} [preferTopDown=true] - Try to trim unnecessary selectors closest to the element. Otherwise, trim unnecessary selectors closest to the document root. Only significant when minimal==true (default: true)
 * @returns {string} CSS Selector
 */
function getSelector(element, minimal = true, attributes = "auto", preferTopDown = true){
	return traverseAncestryForSelectors(element, minimal, attributes, preferTopDown).toString();
}
function getSelectors(elements, minimal = true, attributes = "auto", preferTopDown = true){
	var r = [];
	for(let element of elements)
		r.push(traverseAncestryForSelectors(element, minimal, attributes, preferTopDown).toString());
	return r;
}

function getSelectorChoices(element, attributes = "auto"){
	var r = [];
	r.push(traverseAncestryForSelectors(element, true, attributes, true).toString());
	r.push(traverseAncestryForSelectors(element, true, attributes, false).toString());
	r.push(traverseAncestryForSelectors(element, false, attributes).toString());
	return r;
}

function traverseAncestryForSelectors(element, minimal = true, attributes = "auto", preferTopDown = true){
	if(!element)
		throw new Error("traverseAncestryForSelectors: Not a valid element");
	if(isJQuery(element)){
		if(element.length<=0)
			throw new Error("traverseAncestryForSelectors: No element in jQuery object");
		element = element[0];
	}
	var ancestry = [];
	if(typeof $ == "function" && typeof $.prototype == "object" && typeof $(element) == "object" && typeof $(element).parents == "function"){
		ancestry = $(element).add($(element).parents());
	}
	else{
		var p = element;
		while(p && p != document){
			ancestry.push(p);
			p = p.parentElement;
		}
		ancestry = ancestry.reverse();
	}
	
	var fullChain = new elementSelectorChain(ancestry, false, attributes);
	var tmpChain = fullChain.clone();
	var chain = new elementSelectorChain();
	var cs = fullChain.toString(attributes);
	if(!cs)
		throw new Error("Selector empty");
	
	var bestCount = document.querySelectorAll(cs).length;
	
	if(bestCount<=0){
		console.warn("Selector chain too restrictive/broken?", cs, fullChain);
	}
	// console.log("Complete chain:", cs, fullChain, bestCount==1?"UNIQUE":bestCount);
	
	function applyIfViable(tmpSelector, ix){
		if(fullChain.selectors[ix] === null || fullChain.selectors[ix] == tmpSelector)
			return fullChain.selectors[ix];
		if(tmpSelector && (tmpSelector.tagName + tmpSelector.id + tmpSelector.className) == "")
			return fullChain.selectors[ix];
		tmpChain.selectors[ix] = tmpSelector;
		let els = tmpChain.getElements();
		// console.log(els.length, bestCount, els.is(element), els, element);
		if(els.length>bestCount || els[0] != element){
			tmpChain.selectors[ix] = fullChain.selectors[ix].clone();
		}
		else{
			if(tmpSelector)
				fullChain.selectors[ix] = tmpSelector.clone();
			else
				fullChain.selectors[ix] = null;
			// console.log("set to ", tmpSelector, fullChain.selectors[ix]);
		}
		return fullChain.selectors[ix];
	}
		
	// console.log("going DOWN");
	fullChain.each(function(sel, ix){
		// console.log(ix, sel.toString(), tmpChain.selectors[ix]);
		if(!sel || !sel.sibling)
			return;
		var c = sel.clone();
		c.sibling = "";
		// console.log("before sib check", ix, c, tmpChain.selectors[ix]);
		applyIfViable(c, ix);
		// console.log("after sib check", tmpChain.selectors[ix]);
	});
	
	// console.log("going UP", fullChain.toString());
	
	if(!minimal)
		return fullChain;
	
	fullChain.each(function(sel, ix){
		// console.log(ix, sel.toString());
		var c = sel;
		if(minimal && ix<=fullChain.length()-1)
			c = applyIfViable(null, ix);
		if(c){
			c = c.clone();
			if(attributes=="auto")
				for(let k in c._attribs){
					// console.log("before attrib remove", k, c._attribs);
					delete c._attribs[k];
					// console.log("before attrib check", k, c._attribs);
					c = applyIfViable(c, ix).clone();
					// console.log("after attrib check", k, c._attribs);
				}
			
			for(let k of ["tagName", "className"]){
				// console.log("before attrib remove", ix, k, c);
				c[k] = "";
				// console.log("before attrib check", k, c);
				c = applyIfViable(c, ix).clone();
				// console.log("after attrib check", k, c);
			}
		}
		else{
			// console.log("skipped", sel.toString());
		}
		chain.add(c, preferTopDown);
		//console.log("currently at", s);
		if(minimal && c && document.querySelector(chain.toString()) == element)
			return false;
	}, preferTopDown);
		
	return chain;
}
// TODO: option to filter attribs by specific values also, not just keys
/* globals isElement, isNativeFunction, uneval */
function stringify(obj, forHTML, onlyOwnProperties, completeFunctions, level, maxLevel, skipEmpty){
	if(!level) level = 0;
	var r = "";
	if(obj===undefined) r = "[undefined]";
	else if(obj === null) r = "[null]";
	else if(obj === false) r = "FALSE";
	else if(obj === true) r = "TRUE";
	else if(obj==="") r = "[empty]";
	else if(typeof obj == "object"){
		var isDOMElement = isElement(obj);
		if(onlyOwnProperties === undefined) onlyOwnProperties = true;
		if(completeFunctions === undefined) completeFunctions = false;
		if(maxLevel === undefined) maxLevel = 5;
		if(skipEmpty === undefined) skipEmpty = false;
		
		r = "[object] ";
		var level_padding = "";
		var padString = "    ";
		for(var j = 0; j < level; j++) level_padding += padString;
		
		if(isDOMElement){
			r = "[DOMElement " + obj.nodeName + "] ";
			skipEmpty = true;
			completeFunctions = false;
		}
		
		if(level<maxLevel){
			r += "{\n";
			if(isDOMElement){
				r += level_padding + padString + "HTML => " + obj.outerHTML.replace(/\r?\n/g, "\\n").replace(/\s+/g, " ") + "\n";
			}
			for(var item in obj){
				try{
					var value = obj[item];
					if(onlyOwnProperties && obj.hasOwnProperty && !obj.hasOwnProperty(item) || isNativeFunction(value) || skipEmpty && (value===undefined || value === null || value===""))
						continue;
					
					if(typeof(value) == 'object'){
						r += level_padding + padString + "'" + item + "' => ";
						r += stringify(value, forHTML, onlyOwnProperties, completeFunctions, level+1, maxLevel, skipEmpty) + "\n";
					}else if(typeof(value) == 'undefined'){
						r += level_padding + padString + "'" + item + "' => [undefined]\n";
					}else{
						if(typeof(value.toString)=="function")
							value = value.toString();
						if(!completeFunctions){
							let m = value.match(/function\s*\(([^\)]*)\)\s*\{/i);
							if(m)
								value = "function(" + m[1] + ")";
						}
						r += level_padding + padString + "'" + item + ("' => \"" + value).replace(/\r?\n/g, "\\n").replace(/\s+/g, " ") + "\"\n";
					}
				}catch(e){
					console.log(e);
				}
			}
			r += level_padding + "}";
		}else
			r += "[Max depth of " + maxLevel + " exceeded]";
	}
	else if(typeof obj == "function"){
		if(typeof(obj.toString)=="function")
			r = obj.toString();
		else
			r = uneval(obj);
		if(!completeFunctions){
			let m = r.match(/function\s*\(([^\)]*)\)\s*\{/i);
			if(m)
				r = "function(" + m[1] + ")";
		}
	}
	else
		r = obj + "";
	
	if(level===0){
		if(!!forHTML){
			r = r.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
			r = "<pre>" + r + "</pre>";
		}
	}
	return r;
}
function isNode(o){
	return (
		typeof Node === "object" ? o instanceof Node : 
		o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
	);
}
/* globals HTMLDocument */
function isElement(o){
	return (
		((typeof HTMLElement === "object" && o instanceof HTMLElement) || (typeof Element === "object" && o instanceof Element) || (typeof HTMLDocument === "object" && o instanceof HTMLDocument))? true : //DOM2
		o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
	);
}
function stringifyWithFuncs(val, withTabs = true){
	return JSON.stringify(val, function(key, value){
		if (typeof value === 'function') {
			return value.toString();
		}
		return value;
	}, withTabs?"\t":" ");
}
function toText(str, maxBreaks=2){
//	if($ === undefined){
//		$ = jQuery = require( "jquery" )(new JSDOM("").window);
//	}
	var hack = "__break god dammit__";
	str = str.replace(/(<(?:br|hr) ?\/?>|<\/(?:p|li|div|td|h\d)>)/gi, hack + "$1");
	str = $("<div/>").append(str).text();
	var rex = new RegExp(hack, "gi");
	str = str.replace(rex, "\n");
	rex = new RegExp("(\\n{" + maxBreaks + "})\\n+", "g");
	str = str.replace(rex, "$1");
	return str.trim();
}
function toVarName(str){
	return str
		.replace(/\s+(\w)/g, function(_, a){
			return a.toUpperCase();
		})
		.replace(/[^a-zA-Z0-9]/g, "_")
		.replace(/^([0-9])/, "_$1");
}
function trim(s, what="\\s"){
	var rex = new RegExp("^(?:[" + what + "])*((?:[\\r\\n]|.)*?)(?:[" + what + "])*$");
	var m = s.match(rex);
//	log(m);
	if(m !== null && m.length>=2)
		return m[1];
	return "";
}
function varToPretty(str){
	return str.replace(/(.+?)([A-Z])/g, "$1 $2").replace(/_|-/g, " ").replace(/\s\s+/g, " ").replace(/\b([a-z])/g, function(v,i){return v.toUpperCase();});
}
class eleWaiter{
	constructor(sel, cb, cbFail=null, findIn=null, delay=500, maxTries=50, alwaysOn=false, autoStart=true, debug = false, logFunc = null){
		this.sel = "";
		this.cb = null;
		this.cbFail = null;
		this.findIn = null;
		this.delay = 500;
		this.maxTries = 50;
		this.alwaysOn = false;
		this.autoStart = true;
		this.debug = false;
		this.logFunc = null;

		this.__running = false;
		this.__tries = 0;
		this.__timer = 0;
		this.__jqo = {};

		if(typeof sel == "object" && !(sel instanceof Array)){ // 2022-04-16 : Now allowing array of selectors
			// log("got object");
			Object.assign(this, sel);
		}
		else{
			this.sel = sel;
			this.cb = cb;
			if(cbFail!== undefined || cbFail!== null)
				this.cbFail = cbFail;
			if(findIn)
				this.findIn = findIn;
			this.delay = delay;
			this.maxTries = maxTries;
			this.alwaysOn = alwaysOn;
			this.autoStart = autoStart;
			this.debug = debug;
			this.logFunc = logFunc;
		}
		
		if(!(this.sel instanceof Array)){  // 2022-04-16 : Now allowing array of selectors
			this.sel = [this.sel];
		}
		
		if(this.debug){
			if(typeof this.debug == "string"){
				this.debug = {
					prefix: this.debug,
					level: 1
				};
			}
			else if(typeof this.debug == "number"){
				this.debug = {
					prefix: "",
					level: this.debug
				};
			}
			else if(typeof this.debug == "object"){
				if(!this.debug.prefix)
					this.debug.prefix = "";
			
				if(!this.debug.level)
					this.debug.level = 1;
			}
			else{
				this.debug = {
					prefix: "",
					level: 1
				};
			}
		}
		
		if(!this.logFunc){
			var prefix = "";
			if(this.debug)
				prefix = this.debug.prefix;
			
			if(typeof BPLogger != "undefined"){
				var logger = new BPLogger(prefix ? prefix + " EleWaiter" : "EleWaiter");
				this.logFunc = logger.log.bind(logger);
				// this.debug.prefix = false;
			}
			else{
				this.logFunc = function(...args){
					console.log("EleWaiter:", ...args);
				};
			}
		}
		this.log(this, 3);
		if(this.autoStart)
			this.__wait();
	}
	
	log(...args){
		if(!this.debug)
			return;
		if(typeof args == "object" && args instanceof Array && args.length>=2 && typeof args[args.length-1] == "number"){
			var level = args[args.length-1];
			if(level>this.debug.level){
				return;
			}
			args.pop();
		}
		this.logFunc(...args);
	}

	start(){
		if(!this.__running){
			this.log("Start waiting", this.findIn, this.sel, 1);
			this.__wait();
		}
	}
	stop(){
		clearTimeout(this.__timer);
		this.__running = false;
	}

	__wait(){
		if(!this.findIn || this.findIn == "document"){
			if(!!document)
				this.findIn = document;
			else
				this.findIn = $(":root");
		}
		
		this.__running = true;
		if(this.maxTries!=-1)
			this.__tries++;
		var triesLeft = this.alwaysOn?1:(this.maxTries - this.__tries);
		this.log("tries left:", triesLeft, 3);
		this.__jqo = $();
		for(let sel of this.sel){
			if(typeof sel == "function"){ // 2022-07-11: predicate style
				this.log("sel is func:", this.sel, 3);
				jqo = $(this.findIn);
				var res = sel(jqo);
				if(!res){
					if(!this.alwaysOn)
						this.log("Not true:", sel.toString(), "for", this.findIn, 3);
					if(triesLeft!==0){
						this.__timer = setTimeout(function(){this.__wait();}.bind(this), this.delay);
						if(this.alwaysOn)
							this.__result(false);
					}
					else
						this.__result(false);
					return;
				}
				else{
					this.__jqo = this.__jqo.add(res);
					this.log("Found something, is now:", this.__jqo, 3);
				}
				continue;
			}
			var jqo = $(this.findIn).find(sel);

			if(jqo.length<=0){
				if(!this.alwaysOn)
					this.log("Not found: " + sel, "in", this.findIn, 3);
				if(triesLeft!==0){
					this.__timer = setTimeout(function(){this.__wait();}.bind(this), this.delay);
					if(this.alwaysOn)
						this.__result(false);
				}
				else
					this.__result(false);
				return;
			}
			else{
				this.__jqo = this.__jqo.add(jqo);
				this.log("Found something, is now:", this.__jqo, 3);
			}
		}
		this.__result(this.__jqo);

		if(this.alwaysOn){
			this.log("Always on, repeat", 3);
			this.__timer = setTimeout(function(){this.__wait();}.bind(this), this.delay);
		}
	}
	__result(success=false){
		if(!this.alwaysOn){
			this.__running = false;
			this.log("Result:", success, 2);
		}else if(this.debug.level>2)
			this.log("Result:", success, 1);
		
		if(success){
			if(this.cb!==undefined && typeof this.cb == "function")
				this.cb(this.__jqo);
			else
				console.log("Warning: callback cb not function", this.cb);
		}
		else{
			if(this.cbFail!==undefined && typeof this.cbFail == "function")
				this.cbFail(this.__jqo);
		}
	}
}
if("undefined" === typeof eleWaiters){ // jshint ignore:line
	var eleWaiters ={}; // jshint ignore:line
}

function waitFor(sel, cb, cbFail=null, findIn="document", delay=500, maxTries=50, alwaysOn=false, debug = false){ // 2021-01-29
	return new eleWaiter(sel, cb, cbFail, findIn, delay, maxTries, alwaysOn, true, debug);
}