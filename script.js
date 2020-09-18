let drop_ = document.querySelector('.area-upload #upload-file');
let input = document.querySelector('#upload-file');

// Entrou na área
drop_.addEventListener('dragenter', function(event){
	document.querySelector('.area-upload .label-upload').classList.add('highlight');
    // event.dataTransfer.dropEffect = 'copy'; // say that is a copy
});

// Enquanto estiver arrastando
drop_.addEventListener('dragover', function(event){
});

// Saiu da área
drop_.addEventListener('dragleave', function(event){
	document.querySelector('.area-upload .label-upload').classList.remove('highlight');
});

// Arquivo solto na área
drop_.addEventListener('drop', function(event){
	document.querySelector('.area-upload .label-upload').classList.remove('highlight');

    // itera nos arquivos descartados
    for (var i=0,file; file=event.dataTransfer.files[i]; i++) {
        // Verifica se o arquivo é uma pasta
        if (!(!file.type && file.size % 4096 == 0))
    		store(file);

        // (folder ? 'Folder: ' : 'File: ')
        // f.name
        // f.type
        // f.size
    }
});

// Pasta anexada ao campo input
document.getElementById("upload-file").addEventListener("change", function(event) {
	for (let i=0,file,arrayPath; file=event.target.files[i]; i++) {
		arrayPath=file.webkitRelativePath.split('/');
		arrayPath.pop(file.webkitRelativePath);
		console.log();
		store(file, arrayPath.join('/'));
		// store(file, arrayPath.join('\\'));
	};
}, false);

function criarBarra() {
	//Criar barra
	var barra = document.createElement("div");
	var fill = document.createElement("div");
	var text = document.createElement("div");
	barra.appendChild(fill);
	barra.appendChild(text);
	
	barra.classList.add("barra");
	fill.classList.add("fill");
	text.classList.add("text");

	return barra;
}

function validarArquivo(file, data){
	// Tipos permitidos
	// var mime_types = [ 'image/jpeg', 'image/png' ];
	var mime_types = [];
	
	// Validar os tipos
	if(mime_types.indexOf(file.type) == -1)
		return {"status":false,"mensagem" : "O arquivo " + file.name + " não permitido"};

	// // Apenas 2MB é permitido
	// if(file.size > 2*1024*1024) {
	// 	return {"error" : file.name + " ultrapassou limite de 2MB"};
	// }

	// Se der tudo certo
	return {"status":true,"mensagem": "Enviando: " + file.name};
}

function store(file, path=false) {
	var data = new FormData(),
		barra = criarBarra(),
		valida = validarArquivo(file)
		;

	barra.querySelector(".text").innerHTML = valida.mensagem;
	data.append('file', file);
	if (path) 
		data.append('path', path);
	document.querySelector('.lista-uploads').appendChild(barra);
	data.append('file', file)
	if (valida.status)
		return false;

	$.ajax({
	    method:'POST',
	    url:'upload.php',
	    data: data,
	    headers: {
	      'Accept':'application/json',
	     },
	    // async: false,
	    // cache: false,
	    contentType: false,
	    enctype: 'multipart/form-data',
	    processData: false,
	    xhr: function(){
			var xhr = new window.XMLHttpRequest()
			;

			xhr.upload.addEventListener("progress", function(evt){
				var percent_complete = (evt.loaded / evt.total)*100;
				barra.querySelector(".fill").style.minWidth = percent_complete + "%"; 
			}, false);

			return xhr;
	    },
	    success: function (r) {
	    	console.log(r);
	    	barra.querySelector(".text").innerHTML = "<a href=\"" + r.path + "\" target=\"_blank\">" + r.name + "</a> <i class=\"fas fa-check\"></i>";
			barra.classList.add("complete");
	     },
	    error: function(r) {
	    	console.log(r.responseJSON);
	    	r = r.responseJSON;
			barra.querySelector(".text").innerHTML = "Erro ao enviar: " + r.name +"<br>" + r.message;

			barra.classList.add("error");
	     }
	 });
}