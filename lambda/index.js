/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
///////////////////////////////////////////////////////////persistencia
var persistenceAdapter = getPersistenceAdapter();
function getPersistenceAdapter() {
    // This function is an indirect way to detect if this is part of an Alexa-Hosted skill
    function isAlexaHosted() {
        return process.env.S3_PERSISTENCE_BUCKET ? true : false;
    }
    const tableName = 'name_table';
    if(isAlexaHosted()) {
        const {S3PersistenceAdapter} = require('ask-sdk-s3-persistence-adapter');
        return new S3PersistenceAdapter({ 
            bucketName: process.env.S3_PERSISTENCE_BUCKET
        });
    } else {
        // IMPORTANT: don't forget to give DynamoDB access to the role you're to run this lambda (IAM)
        const {DynamoDbPersistenceAdapter} = require('ask-sdk-dynamodb-persistence-adapter');
        return new DynamoDbPersistenceAdapter({ 
            tableName: tableName,
            createTable: true
        });
    }
}

const languageStrings = {
    es : {
        translation : {
            BIENVENIDA: "Hola! %s, Bienvenido, aqui aprenderas palabras, pronunciación acerca de las vocales. puedes decir muestrame las vocales, cuales son las vocales o pedir una en especifico, dame tu nombre",
            PRONUNCIACION:"Amiguitos y amiguitas, a continuación les enseñare como se pronuncian las vocales. Repite conmigo, A, E, I, O, U",
            PALABRASCONVOCALES:"Hola amiguitas y amiguitos, aprende palabras con la vocal A, repite después de mi.  A, de arbol. A, de Ana. A, de abeja",
            ORACIONES:"Claro, aquí tienes oraciones relacinadas con las vocales, comenzamos, la primera oración es con la letra  A: Ana avanza en su bicicleta por el parque, la segunda oración es con la letra  E: El elefante es enorme y gris, la tercera oración es con la letra I: Isabel invita a sus amigos a jugar en el jardín, la cuarta oración es con la letra O: Oscar observa las olas del océano desde la orilla, la quinta oración es con la letra U: Una uva morada cayó del árbol. la sexta oración tiene todas las vocales, Un búho sabio observa cómo vuelan las aves en el cielo.",
            CUENTOS:"A continuación te contaré un cuento que lleva por título, ¿Donde están las vocales?. Las vocales, cansadas de estar siempre en el mismo lugar, decidieron hacer un emocionante viaje juntas. Partieron en un mágico barco hacia tierras desconocidas, donde encontraron nuevos mundos por explorar. Aprendieron que su unión era clave para formar palabras y dar vida a las historias más extraordinarias. Al regresar a casa, compartieron sus experiencias y su amistad se fortaleció más que nunca.",
            ADIVINANZA:"Aquí tienes una adivinanza: %s. Aquí tienes una adivinanza:",
            RESPUESTAS:"Correcto! ¡Has adivinado la respuesta!",
            INCORRECTO:"Incorrecto. La respuesta correcta es: %s ¡Inténtalo de nuevo!",
            ADIVINANZA1:"larga y pequeñita, sin palabras no hay poesía, ¿Qué vocal es la que te guía?.",
            ADIVINANZA2:"En palabras, es el comienzo, sin sonido, no hay lenguaje tenso, está vocal que muy redondita",
            ADIVINANZA3:"Es como una u con sombrero, su sonido suave y sincero, ¿Cuál es esta vocal, compañero?",
            ADIVINANZA4:"En el alfabeto soy breve, cinco en total, ninguna se atreve, ¿Qué conjunto de letras sostiene el enjambre?.",
            RESPUESTA1:"la vocal a",
            RESPUESTA2:"la vocal e",
            RESPUESTA3:"la vocal i",
            RESPUESTA4:"la vocal o",
            RESPUESTA5:"la vocal u",
            RESPUESTA6:"5 vocales",
            INGRESA:"Ingresa unicamnete una de las 5 vocales",
            INICIOTITULO:"Vocales",
            INICIOSECUNDARIO:"ayuda a que tus hijos aprenda las vocales, de manera dinamica.",
            INICIOPRIMARIO:"🌟¡Hola amiguitos y amiguitas Bienvenidos al mundo de las vocales!🌟",
            TITULOCUENTO:"Cuento",
            URLIMAGEN:"https://i.pinimg.com/564x/1a/53/26/1a532655bde02fc2a66c7359c9c49f68.jpg"
            
        }
    },
    en : {
        translation : {
            BIENVENIDA: "Hello! %s, Welcome, here you will learn words, pronunciation about vowels. You can say show me the vowels, what are the vowels or ask for a specific one, give me your name",
            PRONUNCIACION:"Little friends and little friends, next I will teach you how to pronounce the vowels. Repeat after me, A, E, I, O, U",
            PALABRASCONVOCALES:"Hello friends, learn words with the vowel A, repeat after me. Ah, tree. A, for Ana. A, for bee",
            ORACIONES:"Of course, here are sentences related to the vowels, we begin, the first sentence is with the letter A: Ana rides her bicycle through the park, the second sentence is with the letter E: The elephant is huge and gray, the third sentence is with the letter I: Isabel invites her friends to play in the garden, the fourth sentence is with the letter O: Oscar watches the ocean waves from the shore, the fifth sentence is with the letter U: A purple grape fell from the tree . the sixth sentence has all the vowels, A wise owl watches how birds fly in the sky.",
            CUENTOS:"Next I will tell you a story that is entitled, Where are the vowels?. The vocals, tired of always being in the same place, decided to take an exciting journey together. They set out on a magical ship to unknown lands, where they found new worlds to explore. They learned that their union was key to forming words and bringing the most extraordinary stories to life. Upon returning home, they shared their experiences and their friendship grew stronger than ever.",
            ADIVINANZA:"Here's a riddle: %s. Here's a riddle:",
            RESPUESTAS:"Correct! You have guessed the answer!",
            INCORRECTO:"Incorrect. The correct answer is: %s Try again!",
            ADIVINANZA1:"long and tiny, without words there is no poetry, which vowel is the one that guides you?",
            ADIVINANZA2:"In words, it is the beginning, without sound, there is no tense language, this vowel is very round",
            ADIVINANZA3:"It's like a u with a hat, its sound soft and sincere, what's this vowel, mate?",
            ADIVINANZA4:"In the alphabet I am short, five in all, no one dares, What set of letters does the swarm hold?",
            RESPUESTA1:"the vowel a",
            RESPUESTA2:"the vowel e",
            RESPUESTA3:"the vowel i",
            RESPUESTA4:"the vowel o",
            RESPUESTA5:"the vowel u",
            RESPUESTA6:"5 vowels",
            INGRESA:"Enter only one of the 5 vowels",
            INICIOTITULO:"Vowels",
            INICIOSECUNDARIO:"Help your children learn the vowels, in a dynamic way.",
            INICIOPRIMARIO:"🌟Hello friends and friends, welcome to the world of vowels!🌟",
            TITULOCUENTO:"Tale",
            URLIMAGEN:"https://i.ytimg.com/vi/IwIHQJdb1ek/maxresdefault.jpg"
        }
    }
}
/////////////////////////////////////////////////////////////////////////////////////

const DOCUMENT_ID = "inicio";
const DOCUMENT_ID1 = "vocal";
const DOCUMENT_ID2 = "vocalA";
const DOCUMENT_ID3 = "vocalB";
const DOCUMENT_ID4 = "vocalI";
const DOCUMENT_ID5 = "vocalO";
const DOCUMENT_ID6 = "Ayuda";
const DOCUMENT_ID7 = "Adios";
const DOCUMENT_ID8 = "oraciones";
const DOCUMENT_ID9 = "cuento";
const DOCUMENT_ID10 = "Preguntas";
const DOCUMENT_ID11 = "Felicidades";

////////////////////////////////////////////////////////////funcion de registrar el nombre
const RegisterNameIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AgregarnombreIntent';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = handlerInput.requestEnvelope.request;

        const name = intent.slots.nombre.value;
        
        
        sessionAttributes['name'] = name;
        const speakOutput='Hola bienvenido '+name;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('')
            .getResponse();
    }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////7
const enunciadosAdivinanzas = [
  "larga y pequeñita, sin palabras no hay poesía, ¿Qué vocal es la que te guía?.",
  "En palabras, es el comienzo, sin sonido, no hay lenguaje tenso, está vocal que muy redondita",
  "Es como una u con sombrero, su sonido suave y sincero, ¿Cuál es esta vocal, compañero?",
  "En el alfabeto soy breve, cinco en total, ninguna se atreve, ¿Qué conjunto de letras sostiene el enjambre?."
];

const respuestasAdivinanzas = [
  "la vocal i",
  "la vocal o",
  "la vocal u",
  "5 vocales"
];

////////////////////////////////////////////////////////////////////////bienvenida
const datasource = {
  "headlineExampleData": {
        "type": "object",
        "backgroundImage": "https://i.ytimg.com/vi/HjOOGujV-LU/maxresdefault.jpg",
        "logoUrl": "https://2.bp.blogspot.com/-deVSTM2yDYE/WBS_AJ9v3iI/AAAAAAAAAFw/i-pm3FSs-T8tYApzGqGYMuyW-PtK5lh7wCLcB/s1600/GIF2.gif",
        "textContent": {
            "primaryText": "Vocales",
            "secondaryText": "ayuda a que tus hijos aprenda las vocales, de manera dinamica."
        },
        "properties": {
            "hintText": "🌟¡Hola amiguitos y amiguitas Bienvenidos al mundo de las vocales!🌟"
        },
        "transformers": [
            {
                "inputPath": "hintText",
                "transformer": "textToHint"
            }
        ]
    }
};

const createDirectivePayload = (aplDocumentId, dataSources = {}, tokenId = "documentToken") => {
    return {
        type: "Alexa.Presentation.APL.RenderDocument",
        token: tokenId,
        document: {
            type: "Link",
            src: "doc://alexa/apl/documents/" + aplDocumentId
        },
        datasources: dataSources
    }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////vocal a

const datasource1 = {
  "imageListData": {
        "type": "object",
        "objectId": "imageListSample",
        "backgroundImage": {
            "contentDescription": null,
            "smallSourceUrl": null,
            "largeSourceUrl": null,
            "sources": [
                {
                    "url": "https://www.colorpsychology.org/es/wp-content/uploads/2019/07/azul-color.png",
                    "size": "large"
                }
            ]
        },
        "title": "Palabras con la vocal 'A'",
        "listItems": [
            {
                "primaryText": "A-r-b-o-l",
                "imageSource": "https://infomercado.pe/wp-content/uploads/2022/05/Sin-titulo-15.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.imageListData.listItems[0].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "A-n-a",
                "imageSource": "https://i0.wp.com/docentesaldia.com/wp-content/uploads/2020/12/Rimas-cortas-para-ninos-6.png?fit=960%2C960&ssl=1",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.imageListData.listItems[1].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "A-b-e-j-a",
                "imageSource": "https://educanimando.com/wp-content/uploads/2016/02/LETRA_A.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.imageListData.listItems[2].primaryText} is selected"
                    }
                ]
            }
        ],
        "logoUrl": "https://2.bp.blogspot.com/-deVSTM2yDYE/WBS_AJ9v3iI/AAAAAAAAAFw/i-pm3FSs-T8tYApzGqGYMuyW-PtK5lh7wCLcB/s1600/GIF2.gif",
        "hintText": "Ven aprende conmigo..."
    }
};
const createDirectivePayload1 = (aplDocumentId, dataSources = {}, tokenId = "documentToken") => {
    return {
        type: "Alexa.Presentation.APL.RenderDocument",
        token: tokenId,
        document: {
            type: "Link",
            src: "doc://alexa/apl/documents/" + aplDocumentId
        },
        datasources: dataSources
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////vocal e

const datasource2 = {
     "imageListData": {
        "type": "object",
        "objectId": "imageListSample",
        "backgroundImage": {
            "contentDescription": null,
            "smallSourceUrl": null,
            "largeSourceUrl": null,
            "sources": [
                {
                    "url": "https://www.colorpsychology.org/es/wp-content/uploads/2019/07/azul-color.png",
                    "size": "large"
                }
            ]
        },
        "title": "Palabras con la vocal 'E'",
        "listItems": [
            {
                "primaryText": "E-l-e-f-a-n-t-e",
                "imageSource": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnexDiKBmSyqke3ANmP4XKiQZI8ZzScTsnZPyWCrXN3OFgY2Nx4CA0qyRr-SEFgGEGDOg&usqp=CAU",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.imageListData.listItems[0].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "E-s-t-r-e-l-l-a",
                "imageSource": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRxOPjIKKyABGehNuQhvDJkFpY9B4Gv4fEd58jsk0Vlth6YPtHvzmIqCeoRtOyA2JvSok&usqp=CAU",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.imageListData.listItems[1].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "E-s-c-a-l-e-r-a",
                "imageSource": "data:image/jpeg;base64,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",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.imageListData.listItems[2].primaryText} is selected"
                    }
                ]
            }
        ],
        "logoUrl": "https://2.bp.blogspot.com/-deVSTM2yDYE/WBS_AJ9v3iI/AAAAAAAAAFw/i-pm3FSs-T8tYApzGqGYMuyW-PtK5lh7wCLcB/s1600/GIF2.gif",
        "hintText": "Repite conmigo las siguientes palabras..."
    }
};






const createDirectivePayload8 = (aplDocumentId, dataSources = {}, tokenId = "documentToken") => {
    return {
        type: "Alexa.Presentation.APL.RenderDocument",
        token: tokenId,
        document: {
            type: "Link",
            src: "doc://alexa/apl/documents/" + aplDocumentId
        },
        datasources: dataSources
    }
};

//////////////////////////////////////////////////////////////////////////////////////////////////VOCAL i
const datasource3 = {
     "imageListData": {
        "type": "object",
        "objectId": "imageListSample",
        "backgroundImage": {
            "contentDescription": null,
            "smallSourceUrl": null,
            "largeSourceUrl": null,
            "sources": [
                {
                    "url": "https://www.colorpsychology.org/es/wp-content/uploads/2019/07/azul-color.png",
                    "size": "large"
                }
            ]
        },
        "title": "Palabras con la vocal 'I'",
        "listItems": [
            {
                "primaryText": "I-g-u-a-n-a",
                "imageSource": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3zgm9ya3FABE7fhFWFJpLcWhRKUrhRu_QoQ&usqp=CAU",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.imageListData.listItems[0].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "A-n-a",
                "imageSource": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrvGoGXjKvr0MQxEc6oCRiMjmdsoiJJ9ibiQ&usqp=CAU",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.imageListData.listItems[1].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "I-m-a-n",
                "imageSource": "data:image/png;base64,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",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.imageListData.listItems[2].primaryText} is selected"
                    }
                ]
            }
        ],
        "logoUrl": "https://2.bp.blogspot.com/-deVSTM2yDYE/WBS_AJ9v3iI/AAAAAAAAAFw/i-pm3FSs-T8tYApzGqGYMuyW-PtK5lh7wCLcB/s1600/GIF2.gif",
        "hintText": "Ven aprende conmigo..."
    }
};


const createDirectivePayload5 = (aplDocumentId, dataSources = {}, tokenId = "documentToken") => {
    return {
        type: "Alexa.Presentation.APL.RenderDocument",
        token: tokenId,
        document: {
            type: "Link",
            src: "doc://alexa/apl/documents/" + aplDocumentId
        },
        datasources: dataSources
    }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////vocal o
const datasource4 = {
    "imageListData": {
        "type": "object",
        "objectId": "imageListSample",
        "backgroundImage": {
            "contentDescription": null,
            "smallSourceUrl": null,
            "largeSourceUrl": null,
            "sources": [
                {
                    "url": "https://www.colorpsychology.org/es/wp-content/uploads/2019/07/azul-color.png",
                    "size": "large"
                }
            ]
        },
        "title": "Palabras con la vocal 'O'",
        "listItems": [
            {
                "primaryText": "O-s-o",
                "imageSource": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIq45wRePwqK8z00bLCgnOxDTTyn4C_D9Q9Q&usqp=CAU",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.imageListData.listItems[0].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "O-j-o",
                "imageSource": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwd7DETLQ5m26QmBY94KkGytoE1H4kEFBieg&usqp=CAU",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.imageListData.listItems[1].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "O-v-e-j-a",
                "imageSource": "data:image/png;base64,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",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.imageListData.listItems[2].primaryText} is selected"
                    }
                ]
            }
        ],
        "logoUrl": "https://2.bp.blogspot.com/-deVSTM2yDYE/WBS_AJ9v3iI/AAAAAAAAAFw/i-pm3FSs-T8tYApzGqGYMuyW-PtK5lh7wCLcB/s1600/GIF2.gif",
        "hintText": "Ven aprende conmigo..."
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////vocales pronunciacion 
const datasource5 = {
   "imageListData": {
        "type": "object",
        "objectId": "imageListSample",
        "backgroundImage": {
            "contentDescription": null,
            "smallSourceUrl": null,
            "largeSourceUrl": null,
            "sources": [
                {
                    "url": "https://i.pinimg.com/236x/cc/75/f1/cc75f1fa08c280854e7e2c69eba1c7df.jpg",
                    "size": "large"
                }
            ]
        },
        "title": "Pronunciación de vocales",
        "listItems": [
            {
                "primaryText": "Vocal A",
                "imageSource": "https://i.pinimg.com/564x/a7/cf/ba/a7cfba3075931874df6431a372ed7d2a.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.imageListData.listItems[0].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Vocal E",
                "imageSource": "https://i.pinimg.com/236x/b6/e4/01/b6e40125a8556b350b64a21c5813652f.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.imageListData.listItems[1].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Vocal I",
                "imageSource": "https://i.pinimg.com/236x/58/88/37/588837b10d9fe817be5c903fc09785a4.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.imageListData.listItems[2].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Vocal O",
                "imageSource": "https://i.pinimg.com/236x/89/dc/71/89dc719a151ed2685fa9d8caab9da4bc.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.imageListData.listItems[3].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Vocal U",
                "imageSource": "https://i.pinimg.com/564x/a8/21/20/a821205121f02ab9303d4406ab7ab398.jpg",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.imageListData.listItems[5].primaryText} is selected"
                    }
                ]
            }
        ],
        "logoUrl": "https://2.bp.blogspot.com/-deVSTM2yDYE/WBS_AJ9v3iI/AAAAAAAAAFw/i-pm3FSs-T8tYApzGqGYMuyW-PtK5lh7wCLcB/s1600/GIF2.gif",
        "hintText": "Amiguitos repitan conmigo"
    }
};



/////////////////////////////////////////////////////////////////////////////////////////////////////////////oraciones 
const datasource6 = {
    "textListData": {
        "type": "object",
        "objectId": "textListSample",
        "backgroundImage": {
            "contentDescription": null,
            "smallSourceUrl": null,
            "largeSourceUrl": null,
            "sources": [
                {
                    "url": "https://www.colorpsychology.org/es/wp-content/uploads/2019/07/azul-color.png",
                    "size": "large"
                }
            ]
        },
        "title": "oraciones con las vocales",
        "listItems": [
            {
                "primaryText": "Ana avanza en su bicicleta por el parque",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.textListData.listItems[0].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "El elefante es enorme y gris",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.textListData.listItems[1].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Isabel invita a sus amigos a jugar en el jardín.",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.textListData.listItems[2].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Oscar observa las olas del océano desde la orilla.",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.textListData.listItems[3].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Una uva morada cayó del árbol.",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.textListData.listItems[4].primaryText} is selected"
                    }
                ]
            },
            {
                "primaryText": "Un búho sabio observa cómo vuelan las aves en el cielo.",
                "primaryAction": [
                    {
                        "type": "SetValue",
                        "componentId": "plantList",
                        "property": "headerTitle",
                        "value": "${payload.textListData.listItems[5].primaryText} is selected"
                    }
                ]
            }
        ],
        "logoUrl": "https://2.bp.blogspot.com/-deVSTM2yDYE/WBS_AJ9v3iI/AAAAAAAAAFw/i-pm3FSs-T8tYApzGqGYMuyW-PtK5lh7wCLcB/s1600/GIF2.gif"
    }
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////cuento
const datasource7 = {
    "imageTemplateData": {
        "type": "object",
        "objectId": "imageSample",
        "properties": {
            "backgroundImage": {
                "contentDescription": null,
                "smallSourceUrl": null,
                "largeSourceUrl": null,
                "sources": [
                    {
                        "url": "https://i.pinimg.com/564x/40/c5/1b/40c51baaf681fe429ecc56e8dc56de81.jpg",
                        "size": "large"
                    }
                ]
            },
            "image": {
                "contentDescription": null,
                "smallSourceUrl": null,
                "largeSourceUrl": null,
                "sources": [
                    {
                        "url": "https://i.pinimg.com/564x/1a/53/26/1a532655bde02fc2a66c7359c9c49f68.jpg",
                        "size": "large"
                    }
                ]
            },
            "title": "Cuento",
            "logoUrl": "https://2.bp.blogspot.com/-deVSTM2yDYE/WBS_AJ9v3iI/AAAAAAAAAFw/i-pm3FSs-T8tYApzGqGYMuyW-PtK5lh7wCLcB/s1600/GIF2.gif"
        }
    }
};


const createDirectivePayload3 = (aplDocumentId, dataSources = {}, tokenId = "documentToken") => {
    return {
        type: "Alexa.Presentation.APL.RenderDocument",
        token: tokenId,
        document: {
            type: "Link",
            src: "doc://alexa/apl/documents/" + aplDocumentId
        },
        datasources: dataSources
    }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Preguntas
const datasource8 = {
    "imageTemplateData": {
        "type": "object",
        "objectId": "imageSample",
        "properties": {
            "backgroundImage": {
                "contentDescription": null,
                "smallSourceUrl": null,
                "largeSourceUrl": null,
                "sources": [
                    {
                        "url": "https://i.pinimg.com/564x/40/c5/1b/40c51baaf681fe429ecc56e8dc56de81.jpg",
                        "size": "large"
                    }
                ]
            },
            "image": {
                "contentDescription": null,
                "smallSourceUrl": null,
                "largeSourceUrl": null,
                "sources": [
                    {
                        "url": "https://i.pinimg.com/564x/f3/55/d4/f355d4c73ff8d3739dd4c6f08818faa0.jpg",
                        "size": "large"
                    }
                ]
            },
            "title": "Adivina, adivinador ¿cual es tu respuesta?",
            "logoUrl": "https://2.bp.blogspot.com/-deVSTM2yDYE/WBS_AJ9v3iI/AAAAAAAAAFw/i-pm3FSs-T8tYApzGqGYMuyW-PtK5lh7wCLcB/s1600/GIF2.gif"
        }
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Felicidades
const datasource9 = {
    "imageTemplateData": {
        "type": "object",
        "objectId": "imageSample",
        "properties": {
            "backgroundImage": {
                "contentDescription": null,
                "smallSourceUrl": null,
                "largeSourceUrl": null,
                "sources": [
                    {
                        "url": "https://i.pinimg.com/564x/40/c5/1b/40c51baaf681fe429ecc56e8dc56de81.jpg",
                        "size": "large"
                    }
                ]
            },
            "image": {
                "contentDescription": null,
                "smallSourceUrl": null,
                "largeSourceUrl": null,
                "sources": [
                    {
                        "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTl80KssV0BA09ul9c3ac4NICxlEnZ_njcsg&usqp=CAU",
                        "size": "large"
                    }
                ]
            },
            "title": "Felicidades lo lograste!!!",
            "logoUrl": "https://2.bp.blogspot.com/-deVSTM2yDYE/WBS_AJ9v3iI/AAAAAAAAAFw/i-pm3FSs-T8tYApzGqGYMuyW-PtK5lh7wCLcB/s1600/GIF2.gif"
        }
    }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////Adios
const datasource10 = {
    "imageTemplateData": {
        "type": "object",
        "objectId": "imageSample",
        "properties": {
            "backgroundImage": {
                "contentDescription": null,
                "smallSourceUrl": null,
                "largeSourceUrl": null,
                "sources": [
                    {
                        "url": "https://i.pinimg.com/564x/40/c5/1b/40c51baaf681fe429ecc56e8dc56de81.jpg",
                        "size": "large"
                    }
                ]
            },
            "image": {
                "contentDescription": null,
                "smallSourceUrl": null,
                "largeSourceUrl": null,
                "sources": [
                    {
                        "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf9kq8-m0nkmFM2EEHVS_REWm6yWgM2YlpsQ&usqp=CAU",
                        "size": "large"
                    }
                ]
            },
            "title": "Adios",
            "logoUrl": "https://2.bp.blogspot.com/-deVSTM2yDYE/WBS_AJ9v3iI/AAAAAAAAAFw/i-pm3FSs-T8tYApzGqGYMuyW-PtK5lh7wCLcB/s1600/GIF2.gif"
        }
    }
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
          const requestAttributes=handlerInput.attributesManager.getRequestAttributes();
          const {attributesManager} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        let speakOutput;
        const name = sessionAttributes['name'];
        speakOutput="Hola, antes de comenzar dime tu nombre";
        if(name){
           datasource.headlineExampleData.textContent.primaryText =requestAttributes.t("INICIOTITULO") ;
           datasource.headlineExampleData.textContent.secondaryText =requestAttributes.t("INICIOSECUNDARIO") ;
           datasource.headlineExampleData.properties.hintText = requestAttributes.t("INICIOPRIMARIO");
        speakOutput = requestAttributes.t("BIENVENIDA",name);
          if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID, datasource);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
            
        }
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'mostrarvocalesIntent';
    },
    handle(handlerInput) {
        const requestAttributes=handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t("PRONUNCIACION");
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID1, datasource5);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        
    
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const primeraIntentHandler= {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PrimeravocalldIntent';
    },
    handle(handlerInput) {
        const requestAttributes=handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t("PALABRASCONVOCALES") ;
        
         if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID2, datasource1);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const segundaIntentHandler= {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SegundavocalldIntent';
    },
    handle(handlerInput) {
        const requestAttributes=handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = 'Hola amiguitas y amiguitos, aprende palabras con la vocal E. E, de Elefante. E, de estrella. E, de Escalera';
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID3, datasource2);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};


const terceraIntentHandler= {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'terceravocalldIntent';
    },
    handle(handlerInput) {
        const requestAttributes=handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = 'Hola amiguitas y amiguitos, aprende palabras con la vocal I. Comenzamos I, de iguana, I de Iglecia, I de iman';
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID4, datasource3);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const CuartaIntentHandler= {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'cuartavocaldIntent';
    },
    handle(handlerInput) {
        const requestAttributes=handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = 'Aprende conmigo a pronunciar con la vocal O. Comenzamos, o, de oso, o, de o ojo, o, de oveja';
        
          if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID5, datasource4);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const oracionesIntentHandler= {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'OracionesIntent';
    },
    handle(handlerInput) {
        const requestAttributes=handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t("ORACIONES") ;
        
         if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID8, datasource6);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};


const cuentosIntentHandler= {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'cuentoIntent';
    },
    handle(handlerInput) {
        const requestAttributes=handlerInput.attributesManager.getRequestAttributes();
        datasource7.imageTemplateData.properties.title = requestAttributes.t("TITULOCUENTO") ;
        datasource7.imageTemplateData.properties.image.sources[0].url=requestAttributes.t("URLIMAGEN") ;
        const speakOutput =requestAttributes.t("CUENTOS") ;
        
         if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID9, datasource7);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};





const AdivinanzaHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'AdivinanzaIntent';
  },
  handle(handlerInput) {
    const adivinanzaIndex = Math.floor(Math.random() * enunciadosAdivinanzas.length);
    const requestAttributes=handlerInput.attributesManager.getRequestAttributes();
    const enunciado = enunciadosAdivinanzas[adivinanzaIndex];
    const respuesta = respuestasAdivinanzas[adivinanzaIndex];
    
    let speechText 
    if(adivinanzaIndex===0){
        speechText = requestAttributes.t("ADIVINANZA",requestAttributes.t("ADIVINANZA1"));
    }
    
    else if(adivinanzaIndex===1){
        speechText = requestAttributes.t("ADIVINANZA",requestAttributes.t("ADIVINANZA2"));
    }
     else if (adivinanzaIndex===2){
          speechText = requestAttributes.t("ADIVINANZA",requestAttributes.t("ADIVINANZA3")); 
     }
     else if (adivinanzaIndex===3){
         speechText = requestAttributes.t("ADIVINANZA",requestAttributes.t("ADIVINANZA4")); 
     }
    
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    sessionAttributes.respuestaCorrecta = respuesta;
    attributesManager.setSessionAttributes(sessionAttributes);
    
    // Check if the device supports APL
    if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
      // Generate the APL RenderDocument directive
      const aplDirective = createDirectivePayload(DOCUMENT_ID10, datasource8);
      // Add the RenderDocument directive to the responseBuilder
      handlerInput.responseBuilder.addDirective(aplDirective);
    }
    
    // Send out the skill response
    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};



const RespuestaAdivinanzaHandler = {
  canHandle(handlerInput) {
    
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'RespuestaAdivinanzaIntent';
  },
  handle(handlerInput) {

    const requestAttributes=handlerInput.attributesManager.getRequestAttributes();
    const respuestaUsuario = handlerInput.requestEnvelope.request.intent.slots.respuesta.value;
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes(); 
    const respuestaCorrecta = sessionAttributes.respuestaCorrecta;
    const a = requestAttributes.t("RESPUESTA1");
    const e = requestAttributes.t("RESPUESTA2");
    const i = requestAttributes.t("RESPUESTA3");
    const o = requestAttributes.t("RESPUESTA4");
    const u = requestAttributes.t("RESPUESTA5");
    const cinco = requestAttributes.t("RESPUESTA6");
    
    let speechText = "";
    if (respuestaUsuario ===a ||respuestaUsuario ===e  ||respuestaUsuario===i||respuestaUsuario===o||respuestaUsuario===u||respuestaUsuario===cinco){
      if (respuestaUsuario && respuestaUsuario.toLowerCase() === respuestaCorrecta.toLowerCase()) {
      speechText = requestAttributes.t("RESPUESTAS");
    } else {
      speechText = requestAttributes.t("INCORRECTO",respuestaCorrecta);
    }
    
    // Check if the device supports APL
    if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
      // Generate the APL RenderDocument directive
      const aplDirective = createDirectivePayload(DOCUMENT_ID11, datasource9);
      // Add the RenderDocument directive to the responseBuilder
      handlerInput.responseBuilder.addDirective(aplDirective);
    }  
    }else{
        speechText = requestAttributes.t("INGRESA")
    }
    
    
    // Send out the skill response
    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};






const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = '¡Hola puedes saludarme! ¿Cómo puedo ayudar?';
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID4);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Adios, hasta pronto que tengas una execelente dia';
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID6);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
////////////////////////////////////////////////////////////////////////////////persistencia
const LoadAttributesRequestInterceptor = {
    async process(handlerInput) {
        if(handlerInput.requestEnvelope.session['new']){ //is this a new session?
            const {attributesManager} = handlerInput;
            const persistentAttributes = await attributesManager.getPersistentAttributes() || {};
            //copy persistent attribute to session attributes
            handlerInput.attributesManager.setSessionAttributes(persistentAttributes);
        }
    }
};

const SaveAttributesResponseInterceptor = {
    async process(handlerInput, response) {
        const {attributesManager} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const shouldEndSession = (typeof response.shouldEndSession === "undefined" ? true : response.shouldEndSession);//is this a session end?
        if(shouldEndSession || handlerInput.requestEnvelope.request.type === 'SessionEndedRequest') { // skill was stopped or timed out            
            attributesManager.setPersistentAttributes(sessionAttributes);
            await attributesManager.savePersistentAttributes();
        }
    }
};
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`)
    }
}

const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`Outgoing response: ${JSON.stringify(response)}`)
    }
}

const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      fallbackLng: 'es',
      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
      resources: languageStrings,
      returnObjects: true
    });

    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      return localizationClient.t(...args);
    }
  }
}

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        RegisterNameIntentHandler,
        HelloWorldIntentHandler,
        primeraIntentHandler,
        segundaIntentHandler,
        terceraIntentHandler,
        CuartaIntentHandler,
        oracionesIntentHandler,
        cuentosIntentHandler,
        AdivinanzaHandler,
        RespuestaAdivinanzaHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
        .addRequestInterceptors(LoggingRequestInterceptor, LocalizationInterceptor)
    .addResponseInterceptors(LoggingResponseInterceptor)
    .addRequestInterceptors(
            LoadAttributesRequestInterceptor)
    .addResponseInterceptors(
            SaveAttributesResponseInterceptor)
    .withPersistenceAdapter(persistenceAdapter)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();