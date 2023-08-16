const POSITIVE_SOUND = '<audio src="soundbank://soundlibrary/musical/amzn_sfx_electronic_major_chord_01"/>';

const GREETING_SPEECHCON ='<say-as interpret-as="interjection">yabadabadu</say-as>.';

module.exports = {
    es: {
        translation: {
             WELCOME_MSG: 'Hola {vocales infantil}? ',
            GREE_MSG: POSITIVE_SOUND + GREETING_SPEECHCON + '{{vocales infantil}}',
            MISSING_MSG: 'parece que no has dicho, muestrame las vocales o como se pronuncian las vocales o dime una vocal en especifica ',
        }
    }
}