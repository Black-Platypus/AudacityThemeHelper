// TODO: live preview! 🤯
//       - For colors with content in affected[index], add "compositeIndex" attribute
//       - compositeIndex on click = overlay composite from according canvas and affected data
//       - change color: composite for each px = draw color, alpha = (affected data[R] + affected data[B])/2
//       - save color
// TODO: size + pos to info ... restructure?
// TODO: Kind to info? For name prefixes according to original comments?
// TODO: click to select: Canvas to color, color to canvas
// TODO: Screenshot areas for imag/buttons?
// TODO: drag to marquee
// TODO:   - touching vs within
// TODO: Infobox movable, resizable
// TODO: action menu. Site menu?
// TODO: search by color tolerance?
// TODO: highlight matches
// TODO: overlay mode
// TODO: effects/edits...
// TODO: export edited ImageCache

// Frame color: #f2b027

var logger = BPLogger_default("Audacity Theme Helper");
var mod = bpModal();
mmsg = mod.msg;
msg = overlaymessage;

var cropImages = true;

var imgWidth = 440;
var imgHeight = 836;
var imgHeightCropped = 438;
var colorFrom = 761;
var colorTo = 797;

var cropImgAt = imgHeight;
document.body.style.setProperty("--img_width", imgWidth + "px");
document.body.style.setProperty("--img_cropHeight", imgHeightCropped + "px");
document.body.style.setProperty("--img_fullHeight", imgHeight + "px");
function setCropImages(crop=false){
	cropImages = crop;
	$("body").toggleClass("croppingImages", crop);
	cropImgAt = crop ? imgHeightCropped : imgHeight;
}
setCropImages(cropImages);

var files = [];
var canvas_compare = $("#canvas_compare")[0];
var canvas_current = $("#canvas_current")[0];
var colors_compare = $("#colors_compare")[0];
var colors_current = $("#colors_current")[0];

function init(){
	var map_img = createMap(imgCoords, "map_img");
	var map_color = createMap(colorCoords, "map_color");
	map_color.children().appendTo(map_img); // Eh, at first I wanted to keep them separate. But nah, let's not
	map_color.remove();
	var fileName = "ImageCache_Original.png";
	setLeftImage(imgData[fileName], "Default: " + fileName, true);
}
init();

var filesBeforeAdd = 0;
var filesWaiting = 0;
var notLoadedElements = $("#td_compare .notLoaded");
$("#loadCompare, #addCompare").click(function(){
	log("here");
	$("#newFile").click();
});
$("#currentFile").change(function(e){
	// log(e, e.target);
	if(e.target.files && e.target.files.length>0){
		var reader = new FileReader();
		reader.onload = function(event){
			var fileName = e.target.files[0].name;
			setLeftImage(fileName, event.target.result);
		};
		reader.readAsDataURL(e.target.files[0]);
	}
	else{
		// TODO: Clear maybe? Probably not. But maybe...
	}
});
function setLeftImage(data, fileName, fromData=false){ // TODO: Mark as non-user-added "built-in"/"from data"?
	var img = $("#img_current")[0];
	img.onload = function(){
		var canvas = canvas_current;
		canvas.width = img.width;
		canvas.height = img.height; // cropImgAt; //
		$(canvas).removeClass("hidden").closest(".imgConstraint").attr("loaded-file", fileName);
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img,0,0);
		giveColors(ctx);
		updateText("leftFile", fileName);
	};
	img.src = data;
}
$("#newFile").change(function(e){
	log(e, e.target);
	filesBeforeAdd = files.length;
	if(e.target.files && e.target.files.length>0){
		for(let f of e.target.files)
			readImage(f);
	}
});
$("#choice_compare").click(function(e){
	// log($(this).val(), $(this).children());
	if($(this).val() == "add" && $(this).children().length<=1){
		e.preventDefault();
		e.stopImmediatePropagation();
		$("#newFile").click();
	}
});
$("#choice_compare").change(function(){
	var choice = $(this).val();
	log("selected:", choice);
	if(choice == "add")
		return $("#newFile").click();
	drawImg(choice);
});

$("#toggleCropping").click(function(){
	setCropImages(!cropImages);
});

$("#toggle_left").click(function(){
	$("#imageTable").toggleClass("left-hidden");
});

var filterDebounce;
$(".colorFilter").keyup(function(e){
	clearTimeout(filterDebounce);
	filterDebounce = setTimeout(function(){
		var val = $(e.target).val().trim();
		var cols = $(e.target).parent().parent().find(".palette_color");
		if(val == "")
			cols.removeClass("hidden");
		
		var m = /^(?:rgb\s*)?\(?\s*(\d+),\s*(\d+),\s*(\d+)\s*\)?$/.exec(val);
		if(m && m.length>=4){
			val = m;
			log(val, m);
			cols.each(function(){
				var col = this.colorObject;
				$(this).toggleClass("hidden", col.r != m[1]*1 || col.g != m[2]*1 || col.b != m[3]*1);
			});
			return;
		}
		
		m = /^#?\s*([\da-f]{6})$/.exec(val);
		if(m && m.length>=2){
			val = "#" + m[1];
			log(val, m);
			cols.each(function(){
				var col = this.colorObject;
				$(this).toggleClass("hidden", col.hex != val);
			});
			return;
		}
		
		m = /^#?\s*([\da-f]{3})$/.exec(val);
		if(m && m.length>=2){
			val = "#" + m[1][0] + m[1][0] + m[1][1] + m[1][1] + m[1][2] + m[1][2];
			log(val, m);
			cols.each(function(){
				var col = this.colorObject;
				$(this).toggleClass("hidden", col.hex != val);
			});
			return;
		}
		
		log(val);
		cols.each(function(){
			var col = this.colorObject;
			$(this).toggleClass("hidden", col.name.toLowerCase().indexOf(val.toLowerCase())<0);
		});
	}, 500);
	
});

$("input+.closer").click(function(){
	$(this).prev().val("").keyup();
});

$("body").on("mousemove", ".imgConstraint[loaded-file]", updateInfo);

function drawImg(i, canvas=canvas_compare){
	if(i<0)
		return log("skipping index", i);
	var file = files[i];
	log(i, file);
	var img = file.img;
	canvas.width = img.width;
	canvas.height = img.height; // cropImgAt; //
	log("Set:", file.name, canvas);
	$(canvas).removeClass("hidden").closest(".imgConstraint").attr("loaded-file", file.name);
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img,0,0);
	giveColors(ctx);
}
function readImage(f){
	filesWaiting++;
	var reader = new FileReader();
	reader.onload = function(event){
		var img = new Image();
		img.onload = function(){
			files.push({
				name: f.name,
				img: img
			});
			filesWaiting--;
			if(filesWaiting<=0){
				filesWaiting=0;
				refreshImages(true);
			}
		};
		img.src = event.target.result;
		var toCopy = {};
		toCopy[f.name] = event.target.result;
		log("DataURL:", toCopy);
	};
	reader.readAsDataURL(f);     
}
function refreshImages(andDraw=false){
	var sel = $("#choice_compare");
	$("#choice_compare .file, #choice_compare .empty").remove();
	for(let i = 0; i < files.length; i++){
		let f = files[i];
		sel.append(`<option class="file" name="compareImg" value="${i}">${f.name}</option>`);
	}
	if(files.length>0){
		notLoadedElements.hide();
		if(andDraw){
			var i = 0;
			var opts = $("#choice_compare .file");
			if(filesBeforeAdd<opts.length)
				i = filesBeforeAdd;
			$(opts[i]).prop("selected", true); // drawImg(0);
			sel.change();
		}
	}
	else{
		notLoadedElements.show();
	}
}
function createMap(coords, id){
	var str = `<map id="${id}" name="${id}">`;
	for(let c of coords){
		let k = c.name;
		let v = c.coords;
		let w = v[2] - v[0] + 1;
		let h = v[3] - v[1] + 1;
		let pos = c.chartPos;
		let comment = c.comment;
		let title = `${k}: ${w + "x" + h + (comment!="" ? "\n" + comment.replace(/"/g, "&quot;") : "")}\nRow ${pos[1] + ", Column " + pos[0]}\nFrom [${v[0] + ", " + v[1]}] to [${v[2] + ", " + v[3]}]`;
		str += `\n\t<area title="${title}" shape=rect coords="${v.join(",")}">`;
	}
	str += "\n</map>";
	return $(str).appendTo("body");
}
function updateContent(name, content){
	$(".ud." + name).html(content + "");
}
function updateText(name, content){
	$(".ud." + name).text(content + "");
}
// $(".ud").each(function(){
// 	$(this).text(this.className);
// });

var updating=false;
var updatePending=false;
function updateInfo(e){
	if(updating){
		updatePending = e;
		return;
	}
	updating = true;
	updatePending=false;
	var c = $(e.currentTarget).find("canvas");
	if(c && c.length>0){
		var rect = c[0].getBoundingClientRect();
		var x = Math.ceil(e.clientX - rect.left); 
		var y = Math.ceil(e.clientY - rect.top);
		updateText("mousepos", `X: ${x}, Y: ${y}`);
		var fileName = c.closest(".imgConstraint").attr("loaded-file");
		updateText("filename", fileName);
		var element = getRectFromCoords(x, y);
		if(element){
			updateText("element", element.name);
			updateText("column", element.chartPos[0]);
			updateText("row", element.chartPos[1]);
			updateText("desc", element.comment?element.comment:"-");
			var ctx = c[0].getContext("2d");
			var p = ctx.getImageData(x, y, 1, 1).data;
			var r = p[0];
			var g = p[1];
			var b = p[2];
			var a = p[3];
			var hex = rgbaToHex(r, g, b, a);
			updateText("cred", r);
			updateText("cgreen", g);
			updateText("cblue", b);
			updateText("calpha", a);
			updateText("chex", hex);
			$("#cursorColor").css("background", hex);
		}
		else{
			updateText("element, .ud.desc, .ud.row, .ud.column, .ud.cred, .ud.cgreen, .ud.cblue, .ud.calpha, .ud.chex", "-");
			$("#cursorColor").css("background", "transparent");
		}
	}
	setTimeout(function(){
		updating=false;
		if(updatePending)
			updateInfo(updatePending);
	}, 100);
}
// jshint ignore:start
function rgbToHex(r, g, b){
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return "#" + ("000000" + ((r << 16) | (g << 8) | b).toString(16)).slice(-6);
}
function rgbaToHex(r, g, b, a){
	var rgbHex = rgbToHex(r,g,b);
	if(a==255)
		return rgbHex;
    if (a > 255)
        throw "Invalid alpha component";
    return rgbHex + ("00" + a.toString(16)).slice(-2);
}
// jshint ignore:end

function getRectFromCoords(x,y){
	// log(x,y,colorFrom, colorTo);
	if(y>colorTo)
		return null;
	var layout = imgCoords;
	if(y>colorFrom)
		layout = colorCoords;
	for(let r of layout){
		if(x >= r.coords[0] && x <= r.coords[2] && y >= r.coords[1] && y <= r.coords[3])
			return r;
	}
	return null;
}

function giveColors(ctx){
	var colors = getColors(ctx);
	var canvas = ctx.canvas;
	var colorCell = canvas==canvas_compare?colors_compare:colors_current;
	colorCell.colors = colors;
	var list = $(colorCell).find(".colorlist").html("");
	for(let col of colors){
		var colorElement = $(`
		<div class="palette_color" title="${(col.name + "\nRow " + col.chartPos[1] + ", Column " + col.chartPos[0] + "\n" + col.comment).escapeHtml()}">
			<div class="left">
				<div class="color" style="background: ${col.hex};"></div>
			</div>
			<div class="right">
				<h4>${col.name.escapeHtml() + " <span> [rgb(" + col.r + "," + col.g + "," + col.b + "); " + col.hex + "]</span>"}</h4>
				<i>${col.comment.escapeHtml().replace(/\n/g, "<br />")}</i>
			</div>
		</div>`).appendTo(list);
		colorElement[0].colorObject = col;
	}
}
function getColors(ctx){
	var colors = [];
	for(let rect of colorCoords){
		var col = rect;
		
		var p = ctx.getImageData(rect.coords[0]+5, rect.coords[1]+5, 1, 1).data;
		col.r = p[0];
		col.g = p[1];
		col.b = p[2];
		col.hex = rgbToHex(col.r, col.g, col.b);
		colors.push(col);
	}
	return colors;
}

// // Give the img rects row and column numbers. Only needed to be done once, are now saved in coords_bmp.js.
// // yeah, not very elegant but it worked
// function doCols(){
// 	var rows = [];
// 	var ys = [];
// 	for(let r of imgCoords){
// 		let x = r.coords[0];
// 		let y = r.coords[1];
// 		if(x!=1)
// 			continue;
// 		if(!ys.includes(y))
// 			ys.push(y);
// 	}
// 	ys.sort((a,b) => a-b);
// 	// ys.reverse();
// 	var c = 1;
// 	for(let ry of ys){
// 		let r = {
// 			y: ry,
// 			num: c,
// 			elements: []
// 		};
// 		for(let img of imgCoords){
// 			if(img.sorted)
// 				continue;
// 			let y = img.coords[1];
// 			if(y<=r.y){
// 				img.chartPos = [-1, c];
// 				r.elements.push(img);
// 				img.sorted=true;
// 			}
// 		}
// 		rows.push(r);
// 		c++;
// 	}
// 	// log(rows);
// 	for(let r of rows){
// 		r.elements.sort((a,b) => a.coords[0] - b.coords[0]);
// 		let c = 1;
// 		for(let e of r.elements){
// 			e.chartPos[0] = c;
// 			delete e.sorted;
// 			c++;
// 		}
// 	}
// }
// 
// doCols();
// log(imgCoords);
