
import './styles/main.scss'

class Note{
	constructor(tittle, text, myHeight=460, createDate = `${new Date().getDate()}.${new Date().getMonth()+1}.${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}`, editDate = `${new Date().getDate()}.${new Date().getMonth()+1}.${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}`, id = Date.now()) {
    this.tittle = tittle;
    this.text = text;
		this.myHeight = myHeight;
		this.editDate = editDate;
		this.id = id;
		this.createDate = createDate;
		
  }
	
	viewNote() {
		let note = document.createElement('div');
		note.classList.add('note');
		note.innerHTML = `<div class="note-header"><span class="note-tittle">${this.tittle}</span><div class="note-wrap-drag note-icon"><img src="https://img.icons8.com/external-outline-berkahicon/64/FFFFFF/external-drag-mix-ui-design-outline-berkahicon.png"/></div><div class="note-wrap-edit note-icon"><img src="https://img.icons8.com/external-becris-lineal-becris/64/FFFFFF/external-edit-mintab-for-ios-becris-lineal-becris.png"/></div><div class="note-wrap-edit-complate note-icon hide"><img src="https://img.icons8.com/external-flatart-icons-outline-flatarticons/64/FFFFFF/external-check-basic-ui-elements-flatart-icons-outline-flatarticons.png"/></div><div class="note-wrap-delete note-icon"><img src="https://img.icons8.com/sf-black/64/FFFFFF/filled-trash.png"/></div></div>
		<div class="note-body"><textarea disable="" style="height: ${this.myHeight}px" class="note-text">${this.text}</textarea></div>
		<div class="note-bottom"><div class="note-create">${this.createDate}</div><div class="note-last-edit">${this.editDate}<img src="https://img.icons8.com/external-becris-lineal-becris/64/FFFFFF/external-edit-mintab-for-ios-becris-lineal-becris.png"/></div></div>
		<div id="${this.id}"></div>`;
		note.querySelector('.note-text').disabled = true;
		note.querySelector('.note-text').addEventListener('keydown', resizeTextarea);
		note.querySelector('.note-wrap-edit-complate').addEventListener('click', saveNote);
		note.querySelector('.note-wrap-edit').addEventListener('click', editNote);
		note.querySelector('.note-wrap-delete').addEventListener('click', deleteNote);
		note.querySelector('.note-wrap-drag').addEventListener('mousedown', dragDrop);
		return note;
	}
}

const root = document.querySelector('#root');



let addNote = `
<div class="create-wrap hide">
	<div class="create-block">
		<input type="text" placeholder="Наваание заметки" class="create-tittle" value="">
		<textarea placeholder="Текст..." class="create-text note-text"></textarea>
		<button id="create-btn">СОЗДАТЬ ЗАМЕТКУ</button>
	</div>
</div>`;
root.insertAdjacentHTML('afterbegin', addNote);





const head = document.createElement('div');
head.classList.add('head');
head.insertAdjacentHTML('afterbegin',`
<div class="head-btn">
	<span>ЧТО ЭТО?</span>
	<div class="head-wrap-desc"><span>Это мой проект, где я постарался реализовать блокнот.<br>Вы можете создать, изменить, удалить, перетащить записку <br>( Работает не совсем так как я этого хотел и только на ПК😢 )</span></div>
</div>
<div class="add-note head-btn">
	<span>Добавить заметку</span>
</div>
<h1 class="tittle">UJuH</h1>
`);


const wrap = document.createElement('div');
wrap.classList.add('wrap');

reloadNotes();

root.append(head);
root.append(wrap);







let wrapDrag = document.querySelectorAll('.note-wrap-drag');
for(let item of wrapDrag){
	item.addEventListener('mousedown', dragDrop);
}

function dragDrop(e) {

	var item = e.target;
	var coords = getCoords(item.parentElement.parentElement);
	var shiftX = e.pageX - coords.left;
	var shiftY = e.pageY - coords.top;

	item.parentElement.parentElement.style.position = 'absolute';
	document.body.appendChild(item.parentElement.parentElement);
	moveAt(e);

	item.parentElement.parentElement.style.zIndex = 10; // над другими элементами

	function moveAt(e) {
		item.parentElement.parentElement.style.left = e.pageX - shiftX-15 + 'px';
		item.parentElement.parentElement.style.top = e.pageY - shiftY-15 + 'px';
	}

	document.onmousemove = function(e) {
		moveAt(e);
	};

	item.parentElement.parentElement.onmouseup = function() {
		document.onmousemove = null;
		item.parentElement.parentElement.onmouseup = null;
	};
	item.parentElement.parentElement.ondragstart = function() {
		return false;
	};
	
	function getCoords(elem) {   // кроме IE8-
		var box = elem.getBoundingClientRect();
		return {
			top: box.top + pageYOffset,
			left: box.left + pageXOffset
		};
	}
}









let wrapDelete = document.querySelectorAll('.note-wrap-delete');
for(let item of wrapDelete){
	item.addEventListener('click', deleteNote);
}
let wrapEditComplate = document.querySelectorAll('.note-wrap-edit-complate');
for(let item of wrapEditComplate){
	item.addEventListener('click', saveNote);
}

let wrapEdit = document.querySelectorAll('.note-wrap-edit');
for(let item of wrapEdit){
	item.addEventListener('click', editNote);
}



function deleteNote(event){
	let isDelete = confirm("Ты уверен?");
	if(isDelete){
		localStorage.removeItem(event.target.parentElement.parentElement.lastChild.id);
		reloadNotes();
	}
}
function editNote(event){
	event.target.classList.add('hide');
	event.target.parentElement.querySelector('.note-wrap-edit-complate').classList.remove('hide');
	event.target.parentElement.parentElement.querySelector('.note-text').disabled = false;
	event.target.parentElement.parentElement.querySelector('.note-text').focus();
}
function saveNote(event){
	event.target.classList.add('hide');
	event.target.parentElement.querySelector('.note-wrap-edit').classList.remove('hide');
	event.target.parentElement.parentElement.querySelector('.note-text').disabled = true;
	let parent = event.target.parentElement.parentElement;
	let editNote = new Note(parent.querySelector('.note-tittle').textContent, parent.querySelector('textarea').value, parent.querySelector('textarea').scrollHeight, parent.querySelector('.note-create').textContent, `${new Date().getDate()}.${new Date().getMonth()+1}.${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}`, parent.lastChild.id);
	let b = JSON.stringify(editNote);
	localStorage.setItem(editNote.id, b);
	reloadNotes();
}

function reloadNotes(){
	let tmp = document.querySelector('body');
	try{
		while(tmp.lastChild.classList.lenght != 0){
			tmp.removeChild(tmp.lastChild);
		}
	}catch (e){
		console.warn(e);
	}
	wrap.replaceChildren();
	for(let item of Object.keys(localStorage)){
		let c = JSON.parse(localStorage[item]);
		let loadNote = new Note(c.tittle, c.text, c.myHeight, c.createDate, c.editDate, c.id);
		wrap.appendChild(loadNote.viewNote());
	}
}

function calcHeight(el) {
	var div = document.createElement('div');
	div.style.width = el.scrollWidth + 'px';
	div.style.height = 'fit-content';
	div.style.overflow = 'hidden';
	div.style.position = 'absolute';
	div.style.top = '0px';
	div.style.left = '0px';
	div.style.wordWrap = 'break-word';
	div.style.fontSize = getComputedStyle(el).fontSize;
	div.innerHTML = '<span>' + el.value.split('\n').join('<br>') + '</span>'
	document.body.appendChild(div);
	let res = div.scrollHeight;
	if(res < 60){
		res = 66;
	}
	document.body.removeChild(div);
	return(res);
}

let textareas = document.querySelectorAll('.note-text');
for(let item of textareas){
	item.addEventListener('keydown', resizeTextarea);;
}
function resizeTextarea(event){
	let tab = calcHeight(event.target);
	event.target.style.height = tab + "px";
}

document.querySelector('.add-note').addEventListener('click', (event) =>{
	document.querySelector('.create-wrap').classList.remove('hide');
});

document.querySelector('.create-wrap').addEventListener('click', (event) =>{
	if(event.target.classList[0] != 'create-wrap'){
		return;
	}
	event.target.classList.add('hide');
}, true);



document.querySelector('#create-btn').addEventListener('click', (event) => {
	let newNote = new Note(event.target.parentElement.querySelector('input').value, event.target.parentElement.querySelector('textarea').value, event.target.parentElement.querySelector('textarea').scrollHeight);
	let b = JSON.stringify(newNote);
	localStorage.setItem(newNote.id, b);
	event.target.parentElement.querySelector('input').value, event.target.parentElement.querySelector('textarea').value = '';
	document.querySelector('.create-wrap').classList.add('hide');
	reloadNotes();
});