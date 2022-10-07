var language = "E"

document.getElementById('fileUpload').addEventListener('change', getFile)


function getFile(event){
    const input = event.target
    if ('files' in input && input.files.length > 0){
        placeFileContent(document.getElementById('editText'), input.files[0])
    }
}

function placeFileContent(target, file){
    readFileContent(file).then(content => {
        target.innerHTML = content
    }).catch(error => console.log(error))
}

function readFileContent(file){
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target.result)
        reader.onerror = error => reject(error)
        reader.readAsText(file)
    })
}

function changeLanguage(){
    if (language == "E"){
        // switch to french
        language = "F"
        document.getElementById("upload_label").innerHTML = "Téléverser un fichier"
        document.getElementById("toggle").innerHTML = "Anglais/Français"
        // This is where the text from the uploaded file will be displayed. User will be able to edit this field
        document.getElementById("editTextHint").innerHTML = "C'est ici oû le text du fichier televersé sera demontré, l'utiliseur serait capable de changer le text"
        // This is where the MP3 file will be output
        document.getElementById("fileOutputHint").innerHTML = "C'est ici oû le fichier MP3 sera affiché"
    } else {
        // switch to english 
        language = "E"
        document.getElementById("upload_label").innerHTML = "Choose a file"
        document.getElementById("toggle").innerHTML = "English/French"
        document.getElementById("editTextHint").innerHTML = "This is where the text from the uploaded file will be displayed. User will be able to edit this field"
        document.getElementById("fileOutputHint").innerHTML = "This is where the MP3 file will be output"
    }
}