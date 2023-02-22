const express = require('express'); //Import the express dependency
const port =5656;                  //Save the port number where your server will be listening
const app = express();//Instantiate an express app, the main work horse of this server
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");
var cnt=0;

app.use('/CSS', express.static(__dirname + "/CSS"));

 const router = express.Router();

 
// var board=[[0,0,0],[0,0,0],[0,0,0]]
var board=[0,0,0,0,0,0,0,0,0]

var turn=1;
let lastMove={"GameFinished":0};
router.get('/GetLast',function(req,res){
  res.send(lastMove);
});
// router.get('/amir',function(req,res){
//   res.render("test.ejs", {
//   });
// });
router.get('/GetMove/:p/:c',function(req,res){
  console.log("player ", req.params.p )
  console.log("cell ", req.params.c )
  // console.log("board: ", board);
  let c=req.params.c-1;
  if(turn%2 == req.params.p%2 && board[c]==0 && lastMove.GameFinished==0){
    // let c=req.params.c;
    lastMove.player=req.params.p;
    lastMove.cell=req.params.c;
    board[c] = req.params.p;
    if (turn>4)
    {
      let win = checkBoard(board);
      if (win==1){lastMove.GameFinished=1;}
        else if (win==2){lastMove.GameFinished=2;}
          else{if (win==-1){lastMove.GameFinished=-1;}}
    }

    console.log("board: ", board);
    turn++;
  }
  res.send(lastMove);
});
router.get('/', (req, res) => {        //get requests to the root ("/") will route here
      cnt++;
      res.render("index", {
      timesShown: cnt, //טוען דף דינמי ושולח לו את המשתנה
    });
                                                  //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});


//add the router
app.use('/', router);


app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});

function checkBoard(board) {

  zeroFlag=0;

  for (let i=0; i<board.length; i+=3)
  { // check rows
    if(board[i]==0)
    {
      zeroFlag=1;
    }
    if (board[i]==1 && board[i] == board[i+1] && board[i] == board[i+2]) { return 1;}
    if (board[i]==2 && board[i] == board[i+1] && board[i] == board[i+2]) { return 2;}
  }

  for (let i=0; i<board.length; i++)
  { // check cols
    if (board[i]==1 && board[i] == board[i+3] && board[i] == board[i+6]) { return 1;}
    if (board[i]==2 && board[i] == board[i+3] && board[i] == board[i+6]) { return 2;}
  }

  // Diagonals
  if (board[0]==1 && board[0] == board[4] && board[0] == board[8]) { return 1;}
  if (board[0]==2 && board[0] == board[4] && board[0] == board[8]) { return 2;}

  // Reverse diagonals
  if (board[2]==1 && board[2] == board[4] && board[2] == board[6]) { return 1;}
  if (board[2]==2 && board[2] == board[4] && board[2] == board[6]) { return 2;}
  for (let i=0; i<board.length; i++)
  
    
  if (zeroFlag==0)
  { 
    return -1;
  }
 
  return 0;
 
}