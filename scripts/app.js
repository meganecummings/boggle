/* Initialize the Game */
var list = [
    'aaafrs','aaeeee','aafirs','adennn','aeeeem',
    'aeegmu','aegmnn','afirsy','bjkqxz','ccenst',
    'ceiilt','ceilpt','ceipst','ddhnot','dhhlor',
    'dhlnor','dhlnor','eiiitt','emottt','ensssu',
    'fiprsy','gorrvw','iprrry','nootuw','ooottu'
    ];
    
    var board_generator = []; //2-dimensional array for storing original dice information
    var current_track = []; // keep track of visited dice in selected order
    var clickable = []; // those clickable dice
    var submitted = new Set(); // store submitted words
    
    board_generate();
    board();
    button_event();
    
    
    /* Functions for generating the board */
    function board(){//generate a random 5*5 size board
        var board = []; // For storing the 5*5 size of board
        var board_temp = [];
        var dice_arr = [];
        var upside;
        var row;
        var character='';
        shuffle(board_generator);
        //console.log(board_generator);
        for(let i=0;i<board_generator.length;i++){
            dice_arr = board_generator[i];
            upside = random_face(dice_arr);
            if(upside==='Q')upside = 'Qu';
            board_temp.push(upside);
        }
        for(let i=0;i<board_temp.length;i=i+5){
            line = [];
            line.push(board_temp[i]);
            line.push(board_temp[i+1]);
            line.push(board_temp[i+2]);
            line.push(board_temp[i+3]);
            line.push(board_temp[i+4]);
            board.push(line);
        }
        //console.log(board);
    
        //render board on HTML
        for(var row=0;row<5;row++){
            for(var col=0;col<5;col++){
                character = board[row][col];
                var button = "<button type='button' class='btn dice'"+"row="+row+" col="+col+">"+ character + "</button>";
                var row_selector = document.getElementById("row"+row);
                row_selector.innerHTML += button;
            }
        }
    
    }
    
    function board_generate(){
        var dice;
        for(let i=0;i<list.length;i++){
            dice = list[i].toUpperCase().split('');
            board_generator.push(dice);
        }
        //console.log(board_generator);
    }
    
    function shuffle(arr){//function to shuffle the dice
        var j,temp;
        for(let i=arr.length;i>0;i--){
            j=Math.floor(Math.random()*i);
            temp = arr[i-1];
            arr[i-1] = arr[j];
            arr[j] = temp;
        }
    }
    
    function random_face(arr){//random a upside face from a dice
        var index = Math.floor(Math.random()*6);
        var upside_face = arr[index];
        return upside_face;
    }
    
    
    /* Functions for the gameplay */
    function button_event(){
        var row,col,text;
        var events = document.getElementsByClassName('dice');
        for(let event of events){
            event.onclick = function(){
                row = Number(event.getAttribute('row'));
                col = Number(event.getAttribute('col'));
                text = event.innerHTML;	
                if(!event.classList.contains('active')){
                    current_track.push([row,col]);
                    current_word += text;
                }else{
                    current_track.pop();
                    current_word = current_word.substring(0,current_word.length-1);
                }
                if(current_track.length !== 0){
                    var current_dice = current_track[current_track.length-1];
                    console.log(current_dice);
                    //console.log('current_track'+current_track);
                    ajacent(current_dice[0],current_dice[1]);
                    //console.log('clickable'+clickable);
                    clickable = modify_clickable(clickable,current_track);
                    clickable.push([current_dice[0],current_dice[1]]);
                    //console.log('difference'+clickable);
                }
                update_clickable_dice();
                document.getElementById('current_word').innerHTML = current_word;
                event.classList.toggle('active');
            }
        }
        document.getElementById('submit').onclick = function(){
            submit_word();
            after_submit();
        };
    }
    
    function modify_clickable(clickable,current_track){//remove all elements in array clickable contained in array current_track
        var dice1 = [];
        var dice2 = [];
        var difference = clickable.slice();//make a copy of clickable array
        for(let i=clickable.length-1;i>=0;i--){
            for(let j=0;j<current_track.length;j++){
                var dice1 = clickable[i];
                var dice2 = current_track[j];
                //console.log(dice1);
                //console.log(dice2);
                if( dice1[0] === dice2[0] && dice1[1] === dice2[1] ){
                        difference.splice(i,1);
                }
            }
        }
        //console.log(difference);
        return difference;
    }
    
    function update_clickable_dice(){
        var events = document.getElementsByClassName('dice');
        var found = false;
        if(current_track.length === 0 ){
            for(let event of events){
                event.disabled = false;
                event.classList.remove('highlight_btn');
            }
        }else{
            for(let event of events){
                event.disabled = true;
                event.classList.remove('highlight_btn');
                found = false;
                row = Number(event.getAttribute('row'));
                col = Number(event.getAttribute('col'));
                for(let dice of clickable){
                    if(dice[0] === row && dice[1] === col){
                        found = true; //find the dice
                    }
                }
                if(found){
                    event.disabled = false;
                    event.classList.add('highlight_btn');
                }
            }
        }
    
    }
    
    var current_word = ""; //show current word
    var err_msg = ""; // show error message
    function submit_word(){
        if(current_word===""){
            err_msg = "You need to select a word before submitting!";
            document.getElementById('error').innerHTML = err_msg;
        }else{
            current_track = [];//reset current_track
            submitted.add(current_word);
            current_word = "";
            document.getElementById('current_word').innerHTML = current_word;
            update_words();
            document.getElementById('error').innerHTML = '';
        }
    }
    
    function after_submit(){
        var events = document.getElementsByClassName('dice');
        for(let event of events){
            event.classList.remove('active');
        }
        current_track = [];
        update_clickable_dice();
    }
    
    function update_words(){
        var score;
        var sum = 0;
        document.getElementById('table_words').innerHTML = "";
        for(let word of submitted){
            score = calculate_score(word);
            sum += score;
            document.getElementById('table_words').innerHTML += "<div><span>"+word+"</span>"+"<span>"+score+"</span></div>";
        }
        document.getElementById('total-score').innerHTML = sum;
    }
    
    function calculate_score(word){
        switch(word.length){
            case 1:
            case 2:
                return 0;
            case 3:
            case 4:
                return 1;
            case 5:
                return 2;
            case 6:
                return 3;
            case 7:
                return 5;
            default:
                return 11;
        }
    }
    
    function within_range(row,col){
        return(row>=0 && row<5 && col>=0 && col<5);
    }
    
    var ajacent_dice = [
    [-1,-1],[-1,0],[-1,1],
    [0,-1],			[0,1],
    [1,-1],	[1,0],	[1,1]
    ];
    function ajacent(row,col){
        clickable = [];
        var newrow,newcol;
        for(let neighbor of ajacent_dice){
            newrow = Number(row)+neighbor[0];
            newcol = Number(col)+neighbor[1];
            //console.log(newrow);
            if(within_range(newrow,newcol)){
                //this dice can be selected
                clickable.push([newrow,newcol]);
            }
        }
    }