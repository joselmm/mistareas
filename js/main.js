
	const tareasFinal=[]
	const URLDB = JSON.parse(sessionStorage.getItem("cache")).URLBD;
	const sheetJson =  JSON.parse(sessionStorage.getItem("cache")).sheetJson;
  var takWDates=[];
  $body = document.querySelector('.container')
   const $form = document.querySelector('#form-add-tak');
let $fechaLimite ;
 const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre", "Octubre", "Noviembre" , "Diciembre"];
 loadTaks =  async function () {
     var jsData;
     var tareas=[]
     var fetchData= await fetch(sheetJson).then((res)=>{
         return res.text()
     }).then((txt)=>{
         var jsonData = txt.substr(txt.indexOf("(")+1).slice(0,-2);
         jsData = JSON.parse(jsonData);
         console.log("ya")
     }).then(()=>{
         
     
     var temp={};
     for (let i = 0; i < jsData.table.rows.length; i++) {
         temp={}
     
         for (let j = 0; j < jsData.table.cols.length; j++) {
             if(!!jsData.table.cols[j].label){
                 if(!!jsData.table.rows[i].c[j]){
                 var value =(!!jsData.table.rows[i].c[j].f) ? jsData.table.rows[i].c[j].f : jsData.table.rows[i].c[j].v;
                 }else{
                 var value ="";
                 }
                 temp[jsData.table.cols[j].label]=value
     
             }
         }
         tareas.push(temp)
     }
         
     })
    
		tareas.forEach(function(tak, idx){
		const dateIF=new Date(tak['Fecha Limite']);

		if(dateIF.getDate())
		{takWDates.push({id:tak.id, 'Fecha Limite': tak['Fecha Limite']})}

		})



		var datesMQ = [];
		var takYestd= [];
		var dates = [];
		var dates2 = [];
		takWDates.forEach(function(tak, idx){
		var diasRest =(new Date(tak["Fecha Limite"]).getTime()-Date.now())/86400000
		if (diasRest>-1){
			datesMQ.push({diasRest, id:tak.id})
			dates.push(diasRest)
		} else {
			takYestd.push({diasRest, id:tak.id})
			dates2.push(diasRest)
		}

		})

//para los de hoy en adelante
		dates.sort(function(a, b){return a - b})
		dates.forEach( function(diasRest) {
		 	datesMQ.forEach( function(datesMq) {
				if (datesMq.diasRest===diasRest){
					tareas.forEach( function(tarea,iTak) {
						if(tarea.id === datesMq.id){
							tareasFinal.push(tarea)
						
						}
					});
				}
			});
		});
// para los de ayer pa atras

	dates2.sort(function(a, b){return b - a})

		dates2.forEach( function(diasRest) {
		 	takYestd.forEach( function(takytd) {
				if (takytd.diasRest===diasRest){
					tareas.forEach( function(tarea,iTak) {
						if(tarea.id === takytd.id){
							tareasFinal.push(tarea)
						}
					});
				}
			});
		});

		
		
		tareas.forEach( function(tak, index) {
			if((!tareasFinal.includes(tak))){
				tareasFinal.push(tak)
			}
		});
		
    ////AQUI--
    const $tbody = document.querySelector('.table > tbody');
    const $documentFragmet = document.createDocumentFragment();
    const takRows = [];
    tareasFinal.forEach( function(takObj, index) {

      let date = new Date(takObj["Fecha Limite"])
      const validation = !!date.getDate();
      if(validation){
        dateF = `${date.getDate()} ${meses[date.getMonth()]} ${date.getFullYear()}`
   
      }
      let takRow;
      
      if(validation){

      takRow = `<tr>
      <th scope="row" id="${takObj.id}" >${takObj.id}</th>
      <td class="taks-list">${takObj.Tarea.replace(/\n/g,'<br>')}</td>
      <td class="date-list">${dateF}</td>
      </tr>`;
      	if(date.getHours()!==0 || date.getMinutes()!==0){
      	let hora=(date.getHours()<10)? '0' + date.getHours() : date.getHours();
      	const minutos=(date.getMinutes()<10)? '0' + date.getMinutes() : date.getMinutes();
      	
      	const amopm = ( hora < 12 ) ? 'a.m.' : 'p.m.';
      	hora =(hora<12)? hora : (hora-12)

      	
      

      		 takRow = `<tr>
      <th scope="row" id="${takObj.id}" >${takObj.id}</th>
      <td class="taks-list">${takObj.Tarea.replace(/\n/g,'<br>')}</td>
      <td class="date-list">${dateF} ${hora}:${minutos} ${amopm}</td>
      </tr>`;
      	}

     } else {
     	takRow = `<tr>
     	      <th scope="row" id="${takObj.id}">${takObj.id}</th>
     	      <td class="taks-list">${takObj.Tarea.replace(/\n/g,'<br>')}</td>
     	      </tr>`
     }

  takRows.push(takRow)

    }); 

    $tbody.innerHTML = takRows.join('')

    const $taksList = document.getElementsByClassName('taks-list');

    for (let i=0; i < $taksList.length; i++){
    	$taksList[i].addEventListener('dblclick', updateTak)
    }

   let tr1 = document.createElement('tr')
    tr1.innerHTML='<td></td><td style="color:red" class="taks-list">De las ultimas 24h Hacia Adelante <i class="fas fa-arrow-up"></i>:</td>'
    $tbody.insertBefore(tr1,$tbody.children[0])
   

   let tr2 = document.createElement('tr')
  
    tr2.innerHTML='<td></td><td style="color:red" class="taks-list">De las ultimas 24h Hacia Atras <i class="fas fa-arrow-down"></i> (o ya vencidas):</td>'
    $tbody.insertBefore(tr2,$tbody.children[datesMQ.length+1])
  

    let tr3 = document.createElement('tr')
    tr3.innerHTML='<td></td><td style="color:red" class="taks-list">-----SIN FECHAS <i class="far fa-edit"></i> ----</td>'
    $tbody.insertBefore(tr3,$tbody.children[datesMQ.length+takYestd.length+2])
  
    if(sessionStorage.getItem("lasted")){
            let id = Number(sessionStorage.getItem("lasted"));
        document.getElementById(id).scrollIntoView()
    }
 
	 

  }


  document.addEventListener('DOMContentLoaded',loadTaks);

  const $botonAddTak = document.querySelector('#add-tak');

  function updateTak (e) {
  
  	$form.innerHTML = 
    `<div class="form-group" align="center">
    <div style="position:absolute; right:20px; cursor:pointer" onclick="closeWindowADDTak()">X</div>
    <label for="tak-description">Actualizar Tarea:</label>
    <textarea type="textarea" style=" width: 90%; height:100px;";  class="form-control" id="tak-description" aria-describedby="emailHelp" placeholder="Ingresa Tu Tarea"></textarea>
  
    </div>
    <div class="form-group" style="margin-bottom:10px; margin-top:10px  " align="center">
    	<input type="file" id="files-loaded" multiple>
    </div>
    <div align="center" style="margin-bottom:5px">
       <button  id="btn-upload-files" class="btn btn-warning" onclick="javascript: uploadFiles(event);">Subir Archivos</button> 
    </div>
    <div class="form-group" style="margin-bottom:10px; margin-top:10px  " align="center">
    	<label for="siono-fecha-limite">Fecha Limite</label>
      <input type="checkbox" id="siono-fecha-limite" value="Cambiar"  class="btn btn-primary">
    </div>
    <div class="form-group" id="limite-f" style="margin-bottom:10px; " align="center">
      <input style=" width: 90%; " type="date" class="form-control" id="fecha-limite" placeholder="Escribir fecha en texto">
    </div>
    
    <div class="form-group" id="limite-h" style="margin-bottom:10px; margin-top:10px " align="center">
      <label for="siono-hora-limite" style="margin-bottom:10px">Hora Limite &nbsp;</label><input type="checkbox" id="siono-hora-limite">
      <input style=" width: 90%; " type="time" class="form-control" id="hora-limite" placeholder="Escribir fecha en texto" disabled>
    </div>
    <div class="form-group" style="margin-bottom:20px; margin-top:20px " align="center">
    <div id="delTakBtn" class="btn btn-danger">Borrar <i class="fas fa-trash-alt" id="delTakBtn"></i></div>
	 
    </div>
   	
    <div align="center" style="margin-bottom:5px">
    <button type="submit" id="send-tak-btn" class="btn btn-warning">Guardar Tarea</button> 
    </div>
    `
    $body.appendChild($form)
    $form.setAttribute('style', "top:10px; position:fixed; background:white; border: solid 2px black; border-radius: 15px; width: 90%; margin:auto")

	$('#siono-fecha-limite')[0].checked=false

    $takDescription=$form.getElementsByTagName('textarea')[0];
    $takDescription.value=e.target.innerText;
    $takDescription.focus()
    const sendTakBtn = document.querySelector('#send-tak-btn');
	$fechaLimite= document.getElementById('fecha-limite');
	$horaLimite = document.getElementById('hora-limite');
	  const $idTak = Number(e.target.previousElementSibling.textContent);
	  let date = new Date(tareasFinal[$idTak-1]['Fecha Limite'])
      const dateValidation = !!date.getDate();
      if(dateValidation){
      	$('#siono-fecha-limite')[0].checked=true
   			// console.log($fechaLimite)
   		if(date.getHours()!==0 || date.getMinutes()!==0){
   			$('#siono-hora-limite')[0].checked=true
 			$horaLimite.disabled=false;			
        	$horaLimite.value=`${(date.getHours()<10)? '0' + date.getHours() : date.getHours() }:${(date.getMinutes()<10)? '0' + date.getMinutes() : date.getMinutes() }`
   		} 

   		const mes = (date.getMonth()+1)
        
        date = `${date.getFullYear()}-${(mes < 10) ? '0'+mes : mes}-${(date.getDate() < 10) ? '0'+date.getDate() : date.getDate()}`
      
        $fechaLimite.value = date
      }else{
document.querySelector('#siono-hora-limite').checked=false
$('#limite-h').toggle()
		$('#limite-f').toggle()
   		}


	document.querySelector('#siono-fecha-limite').addEventListener('click', (e)=>{
	
		const aCabmbiarV = (e.target.value==='Con Fecha') ? 'Sin Fecha' : 'Con Fecha'
		e.target.value=aCabmbiarV;
		e.target.classList.toggle('btn-primary');
		e.target.classList.toggle('btn-warning');
		$('#limite-h')[0].classList.toggle('oculto');
		$('#limite-f')[0].classList.toggle('oculto');
		$('#limite-h').toggle()
		$('#limite-f').toggle()
		$fechaLimite.value=null
		document.querySelector('#siono-hora-limite').checked=false
	})

	
	document.querySelector('#siono-hora-limite').addEventListener('click', ()=>{
		const hrlV = ($horalimite.disabled===false) ? true : false;

		$horalimite.disabled=hrlV;

	})

	 
	
     

	var $horalimite = document.querySelector('#hora-limite');
	sendTakBtn.addEventListener('click', updateTaks);
	
  	
	async function updateTaks(e){
		

		
		let fechaLimite;
		if(document.querySelector('#siono-fecha-limite').checked && $fechaLimite.value !=''){
  		fechaLimite = `${Number($fechaLimite.value.substr($fechaLimite.value.length-2))} ${meses[Number($fechaLimite.value.substr(5,2))-1]} ${$fechaLimite.value.substr(0,4)} `

	var $horalimite = document.querySelector('#hora-limite');
  		if (document.querySelector('#siono-hora-limite').checked && $horalimite.value!=''){
  			fechaLimite += $horalimite.value;
  		}

  	}

	const tarea = [{id:$idTak, Tarea: `${$takDescription.value}`, 'Fecha Limite':`${fechaLimite}`}]
       sessionStorage.setItem("lasted",$idTak);
		e.preventDefault()
		
		updateRowsWHRN(URLDB, 'data', tarea, 'tareas' ,'id').then(()=>{location.reload()})
	}
	const delTakBtn = document.getElementById('delTakBtn')

	delTakBtn.addEventListener('click', deleteTak);

	function deleteTak () {
		const delVal = confirm('seguro?');
                let lasted = ($idTak==tareasFinal.length) ? tareasFinal.length-1 : $idTak;
                sessionStorage.setItem("lasted",lasted);
//                console.log()
		const tareaDel = [{id:$idTak}]

		if(delVal){
			deleteRowsWHRN(URLDB, 'data', tareaDel, 'tareas', 'id').then(()=>{location.reload()})	}
	}

  }



  function openWindowADDTak(){
    $form.innerHTML = 
    ` <div class="form-group" align="center">
    <div style="position:absolute; right:20px; cursor:pointer" onclick="closeWindowADDTak()">X</div>
    <label for="tak-description">Agregar Tarea:</label>
    <textarea type="textarea" style=" width: 90%; height:100px;";  class="form-control" id="tak-description" aria-describedby="emailHelp" placeholder="Ingresa Tu Tarea"></textarea>
  
    </div>
    <div class="form-group" style="margin-bottom:10px; margin-top:10px  " align="center">
    	<input type="file" id="files-loaded" multiple>
    </div>
    <div align="center" style="margin-bottom:5px">
       <button  id="btn-upload-files" class="btn btn-warning" onclick="javascript: uploadFiles(event);">Subir Archivos</button> 
    </div>
    <div class="form-group" style="margin-bottom:10px; margin-top:10px  " align="center">
    	<label for="siono-fecha-limite">Fecha Limite</label>
      <input type="checkbox" id="siono-fecha-limite"  checked=true  class="btn btn-primary">
    </div>
    <div class="form-group" id="limite-f" style="margin-bottom:10px; " align="center">
      <input style=" width: 90%; " type="date" class="form-control" id="fecha-limite" placeholder="Escribir fecha en texto">
    </div>
    
    <div class="form-group" id="limite-h" style="margin-bottom:10px; margin-top:10px " align="center">
      <label for="siono-hora-limite" style="margin-bottom:10px">Hora Limite &nbsp;</label><input type="checkbox" id="siono-hora-limite">
      <input style=" width: 90%; " type="time" class="form-control" id="hora-limite" >
    </div>
   	
    <div align="center" style="margin-bottom:5px">
    <button type="submit" id="send-tak-btn" class="btn btn-warning">Guardar Tarea</button> 
    </div>
    `
    $body.appendChild($form)
    $form.setAttribute('style', "top:10px; position:fixed; background:white; border: solid 2px black; border-radius: 15px; width: 90%; margin:auto")

    $takDescription=$form.getElementsByTagName('textarea')[0];	
    $takDescription.focus()
    const sendTakBtn = document.querySelector('#send-tak-btn');
	sendTakBtn.addEventListener('click', sendTak);
	$fechaLimite= document.getElementById('fecha-limite');

	var $horalimite = $('#hora-limite');
	$horalimite.toggle()
	 	document.querySelector('#siono-fecha-limite').addEventListener('click', (e)=>{

		const aCabmbiarV = (e.target.value==='Con Fecha') ? 'Sin Fecha' : 'Con Fecha'
		e.target.value=aCabmbiarV;
		e.target.classList.toggle('btn-primary');
		e.target.classList.toggle('btn-warning');
	
		$('#limite-h')[0].classList.toggle('oculto');
		$('#limite-f')[0].classList.toggle('oculto');
		$('#limite-h').toggle()

		$('#limite-f').toggle()
		document.querySelector('#siono-hora-limite').checked=false
	})

	document.querySelector('#siono-hora-limite').addEventListener('click', ()=>{
		$horalimite.toggle()
	})
  }

  $botonAddTak.addEventListener('click', openWindowADDTak)



  function closeWindowADDTak(){
  	$form.innerHTML='';
  	$form.style='';
  }


  function sendTak (e) {


        sessionStorage.setItem("lasted", tareasFinal.length)
        e.preventDefault()
  	const tareaDescripcion = $form.getElementsByTagName('textarea')[0].value;
  	let fechaLimite;
  	if(document.querySelector('#siono-fecha-limite').checked && $fechaLimite.value !=''){
  		fechaLimite = `${Number($fechaLimite.value.substr($fechaLimite.value.length-2))} ${meses[Number($fechaLimite.value.substr(5,2))-1]} ${$fechaLimite.value.substr(0,4)} `

  		if (document.querySelector('#siono-hora-limite').checked && document.querySelector('#hora-limite').value!=''){
  			fechaLimite += document.querySelector('#hora-limite').value;
  		}
  	}

	const tarea = [{Tarea:`${tareaDescripcion}`, 'Fecha Limite':`${fechaLimite}`}]
 	insertRowsWHRN(URLDB, 'data', 'tareas', tarea)
 	.then(()=>{
 		location.reload()
 	})
}

loadTaks();


async function uploadFiles(e){
	e.preventDefault();
	const filesInput = document.querySelector('#files-loaded');
	var takDescription = document.querySelector('#tak-description');
	if (filesInput.files.length > 0) {
		/*//Opcion de para solo imagenes usando la api de imgBB
		for(file of filesInput.files){

			var form = new FormData();
			form.append("image",file);
			await fetch("https://api.imgbb.com/1/upload?key=3e5d5a887c7aee8dce9fcdbbbc70a351",{
			"method":"POST",
			"body":form
			}).then((res)=>{return res.json()})
			.then((json)=>{
				if (takDescription[takDescription.length - 1] === '\n' ) {
				  takDescription.value=takDescription.value+json.data.display_url
				} else {
				  takDescription.value=takDescription.value+"\n"+json.data.display_url
				}
				
			})
			.catch((err)=>{console.log("there was an error", err)})
		}*/
		for(file of filesInput.files){
			var base64 = await fileToBase64(file)
  			.then((base64String) => {
			 return base64String;
			})
			.catch((error) => {
			   return error;
			});
			if (!(typeof base64 == "string")) {
				console.error("ocurrio un error con el base64 del archivo " + file.name + ": "+ base64);
				console.log("se detuvo la funcion")
				return
			};

			var payload = {
			    archivo_name:file.name,
			    file_mime:file.type,
			    archivo_base64:base64 
			}
			
			var result = await fetch("https://script.google.com/macros/s/AKfycbz9GV4R7FOQOoTukIl8RDmdqw_sOy00z8H1IJDgA8dCQIMCbxO031VFF4TbwjSqBf0PIg/exec",
			      {
				  "method":"POST",
				  "body":JSON.stringify(payload)
			      }
			     )
			.then((res)=>res.json())
			.then((res)=>res)
			
			if (result.status=="error") {
				console.error("ocurrio con la respuesta del servidor de appscript: ");
				console.log(result);
				console.log("se detuvo la funcion")
				return
			};
			
			if (takDescription[takDescription.length - 1] === '\n' ) {
				  takDescription.value=takDescription.value+"\""+ file.name +"\"" + ": https://drive.google.com/open?id=" + result.fileId;
			} else {
				  takDescription.value=takDescription.value+"\n"+"\""+  file.name +"\""+  ": https://drive.google.com/open?id=" + result.fileId;
			}
			
			
		}
  	} else {
    		alert(filesInput.files.length+" archivos cargados.")
  	}
};


function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };

    reader.onerror = () => {
      reject(reader.error);
    };

    reader.readAsDataURL(file);
  });
}



