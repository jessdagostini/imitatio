var alphabet = ['a', 'b', 'c', 'x', 'y', 'z'];
var final_state = 'q5';

// Variables to save current status
var tape = '';
var state = 'q0';
var pos = 0;

// Varaibles to save past status
var past_tape = '';
var past_state = '';
var past_pos = -1;

var count = 0;

// Turing Machine
var turing = [[]];
var states = [0, 1, 2, 3, 4, 5];
states.forEach(state => {
    turing["q" + state] = [];
});

turing["q0"]["*"] = "q0,*,D";
turing["q0"]["a"] = "q1,x,D";
turing["q0"]["y"] = "q4,y,D";
turing["q1"]["a"] = "q1,a,D";
turing["q1"]["b"] = "q2,y,D";
turing["q1"]["y"] = "q1,y,D";
turing["q2"]["b"] = "q2,b,D";
turing["q2"]["c"] = "q3,z,E";
turing["q2"]["z"] = "q2,z,D";
turing["q3"]["a"] = "q3,a,E";
turing["q3"]["b"] = "q3,b,E";
turing["q3"]["x"] = "q0,x,D";
turing["q3"]["y"] = "q3,y,E";
turing["q3"]["z"] = "q3,z,E";
turing["q4"]["y"] = "q4,y,D";
turing["q4"]["z"] = "q4,z,D";
turing["q4"]["β"] = "q5,β,D";


$(document).ready(function() {
    // Show the dictionary
    $(".dict").click(function(){
        $('.modal').addClass('is-active');
    });

    // Close the dictionary
    $(".close-modal").click(function(){
        $('.modal').removeClass("is-active");
    });

    // Add word into the dict
    $(".add-word").click(function(){
        var word = ($('.new-word').val()).toLowerCase(); 
        tape = addWord(word);
    });

    $(".analyze-all").click(function(){
        turingMachine();
    });

    $(".analyze-step").click(function(){
        highlightStep();
        writeSteps();
        turingMachineByStep();
    });
})

function addWord(word) {
    // Verify if the field was not empty and if the word is not in the dict
    if (word) {
        word = '*' + word;
        word = word + 'β';
        var row = '';

        for (i = 0; i<word.length; i++) {
            row = row + `<td class="fita-${i}">${word[i]}</td>`;
        }

        $('.fita').find('tr').remove('tr');
        $('.fita').append(`<tr>${row}</tr>`);
        return word;
    } else {
        iziToast.show({
            message: `This field can not be empty`,
            color: 'red',
            position: 'topCenter'
        });
    }
}

function replaceAt(string, index, replace) {
    return string.substring(0, index) + replace + string.substring(index + 1);
}

function turingMachineByStep() {
    if (tape.length > pos && pos >= 0) {
        if (typeof turing[state][tape[pos]] === 'undefined') {
            iziToast.show({
                message: `The input value cannot be recognized.`,
                color: 'red',
                position: 'topCenter'
            });
            $('.analyize-step').removeClass('analyze-step');
        }
        var aux = turing[state][tape[pos]].split(",");
        past_state = state;
        state = aux[0];
        past_pos = pos;
        past_tape = tape;

        // Write on tape
        tape = replaceAt(tape, pos, aux[1]);
        $(`.fita-${pos}`).html(aux[1]);
        
        
        // Check if we need to go to right or left in the tape
        if (aux[2] == 'D') {
            pos = pos+1;
        } else if (aux[2] == 'E') {
            pos = pos-1;
        }

        count = count + 1;

        if (state == final_state) {
            pos = tape.length + 1;
        }
    } else if (tape.length == 0) {
        iziToast.show({
            message: `The tape is empty.`,
            color: 'red',
            position: 'topCenter'
        });
    } else {
        iziToast.show({
            message: `The input was recognized!.`,
            color: 'green',
            position: 'topCenter'
        });
    }
}

function highlightStep() {
    if (past_state !== '' && past_state == 'q0' && past_pos == 0) {
        $('.fita .fita-' + past_pos).removeClass('focus-row');
        $('.turing .' + past_state + '-init').removeClass('focus-col');
    } else {
        $('.fita .fita-' + past_pos).removeClass('focus-row');
        $('.turing .' + past_state + '-' + past_tape[past_pos]).removeClass('focus-col');
    }

    if (tape.length > 0 && state == 'q0' && pos  == 0) {
        $('.fita .fita-' + pos).delay("slow").addClass('focus-row');
        $('.turing .' + state + '-init').delay("slow").addClass('focus-col');
    } else {
        $('.fita .fita-' + pos).delay("slow").addClass('focus-row');
        $('.turing .' + state + '-' + tape[pos]).delay("slow").addClass('focus-col');
    }
}

function turingMachine() {
    while (tape.length > pos && pos >= 0) {
        highlightStep();
        writeSteps();
        if (typeof turing[state][tape[pos]] === 'undefined') {
            iziToast.show({
                message: `The input value cannot be recognized.`,
                color: 'red',
                position: 'topCenter'
            });
            $('.analyize-step').removeClass('analyze-step');
        }
        var aux = turing[state][tape[pos]].split(",");
        past_state = state;
        state = aux[0];
        past_pos = pos;
        past_tape = tape;

        // Write on tape
        tape = replaceAt(tape, pos, aux[1]);
        $(`.fita-${pos}`).html(aux[1]);
        
        
        // Check if we need to go to right or left in the tape
        if (aux[2] == 'D') {
            pos = pos+1;
        } else if (aux[2] == 'E') {
            pos = pos-1;
        }

        count = count + 1;

        if (state == final_state) {
            pos = tape.length + 1;
        }
    }
    if (tape.length == 0) {
        iziToast.show({
            message: `The tape is empty.`,
            color: 'red',
            position: 'topCenter'
        });
    } else {
        highlightStep();
        writeSteps();
        iziToast.show({
            message: `The input was recognized!.`,
            color: 'green',
            position: 'topCenter'
        });
    }
}

function writeSteps() {
    if (state == final_state) {
        var row = `<td>Accepted in ${count} iterations</td>`;
    } else if (typeof turing[state][tape[pos]] === 'undefined') {
        var row = `<td>Rejected in ${count} iterations</td>`;
    } else {
        var row = `<td>${state},${tape[pos]}</td>`;
        row = row + `<td>${turing[state][tape[pos]]}</td>`;
    }

    $('.steps').append(`<tr>${row}</tr>`);
}