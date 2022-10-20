var language = "E"

document.getElementById('fileUpload').addEventListener('change', getFile)


function getFile(event){
    const input = event.target
    if ('files' in input && input.files.length > 0){

        // The following lines gets you the file type!
        let fileType = input.files[0].name.split(".")[1];
        if (fileType == "txt"){
            placeFileContent(document.getElementById('editTextField'), input.files[0])
        } else if (fileType == "pdf"){
            
            var fileReader = new FileReader();
            pdfjsLib.GlobalWorkerOptions.workerSrc = "build/pdf.worker.js";
            
            fileReader.onload = function(){
                var typedArray = new Unit8Array(this.result);
                
                pdfjsLib.getDocument(typedArray).promise.then(function (pdf) {
                var pdfDocument = pdf;
                var pagesPromises = [];
    
                for (var i = 0; i < pdf.numPages; i++) {
                    // Required to prevent that i is always the total of pages
                    (function (pageNumber) {
                        pagesPromises.push(getPageText(pageNumber, pdfDocument));
                    })(i + 1);
                }
    
                Promise.all(pagesPromises).then(function (pagesText) {
                    
                    var text = "";
                    // Display text of all the pages in the console
                    for (var i = 0; i < pagesText.length; i++){
                        text += pagesText[i];
                    }

                    document.getElementById("editTextField").innerHTML = text;
                });
    
            }, function (reason) {
                // PDF loading error
                console.error(reason);
            });
                
            }            

            function getPageText(pageNum, PDFDocumentInstance) {
                // Return a Promise that is solved once the text of the page is retrieven
                return new Promise(function (resolve, reject) {
                    PDFDocumentInstance.getPage(pageNum).then(function (pdfPage) {
                        // The main trick to obtain the text of the PDF page, use the getTextContent method
                        pdfPage.getTextContent().then(function (textContent) {
                            var textItems = textContent.items;
                            var finalString = "";
    
                            // Concatenate the string of the item to the final string
                            for (var i = 0; i < textItems.length; i++) {
                                var item = textItems[i];
    
                                finalString += item.str + " ";
                            }
    
                            // Solve promise with the text retrieven from the page
                            resolve(finalString);
                        });
                    });
                });
            }
        } else if (fileType == "doc" || fileType == "docx"){
            console.log("This has not been implemented yet - word");
        }
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
        document.getElementById("editTextField").innerHTML = "C'est ici oû le text du fichier televersé sera demontré, l'utiliseur serait capable de changer le text"
        // This is where the MP3 file will be output
        document.getElementById("fileOutputHint").innerHTML = "C'est ici oû le fichier MP3 sera affiché"
    } else {
        // switch to english 
        language = "E"
        document.getElementById("upload_label").innerHTML = "Choose a file"
        document.getElementById("toggle").innerHTML = "English/French"
        document.getElementById("editTextField").innerHTML = "This is where the text from the uploaded file will be displayed. User will be able to edit this field"
        document.getElementById("fileOutputHint").innerHTML = "This is where the MP3 file will be output"
    }
}
