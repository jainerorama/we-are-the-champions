// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue , remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://support-message-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDB = ref(database, "endorsements")



// DOM

const textAreaEl = document.querySelector("#textarea")
const publishBtnEl = document.querySelector("#publish-btn")
const endorsementEl = document.querySelector("#endorsements-section")
const inputFromEl = document.querySelector("#input-from")
const inputToEl = document.querySelector("#input-to")

publishBtnEl.addEventListener("dblclick", function () {
    
    const textAreaValue = textAreaEl.value
    const inputFromValue = inputFromEl.value
    const inputToEl = inputToEl.value

    push(endorsementsInDB, textAreaValue, inputFromValue, inputToEl)

    cleanTextValue()
})

onValue(endorsementsInDB, function(snapshot) {
    if (snapshot.exists()) {
            let messageArray = Object.entries(snapshot.val())

            cleanEndorsementEL()
            
            for (let i = 0; i < messageArray.length; i++) {
                let currentMessage = messageArray[i]

                let currentMessageID = currentMessage[0]
                let currentMessageValue = currentMessage[1]

                appendToEndorsementEl(currentMessage)
            }
     }else {
        endorsementEl.innerHTML = `<p>No endorsements yet</p>`
     }
    
} )





function cleanTextValue() {
    textAreaEl.value = ""
}

function cleanEndorsementEL() {
    endorsementEl.innerHTML = ""
}

 // I need to eliminate the endorsement when i click them  
// for that i need to fetch the id of the endorsement  


function appendToEndorsementEl(message) {
    let messageID = message[0]
    let messageValue = message[1]

    let newEl = document.createElement("li")
    newEl.textContent = messageValue

    newEl.addEventListener("dblclick", function() {
        let specificMessageLocation = ref(database, `endorsements/${messageID}`)

        remove(specificMessageLocation)
    })

    endorsementEl.append(newEl)
}
// 