const tilesContainer= document.querySelector('.tiles')
const colors=[]
for(let i=0;i<8;i++){
    colors[i]=randomColor()
}
const colorPickList=[...colors, ...colors]
const tileCount= colorPickList.length
let moveContainer= document.querySelector('.move-container')
let bestscoreContainer=document.querySelector('.bestscore-container')
const startbtn= document.querySelector('.start-button')
const restartbtn=document.querySelector('.restart-button')
const timerContainer=document.querySelector('.timer')
let second=0;
let minute=0;
let revealedCount=0
let activeTile=null
let awaitingEndOfMove=false
let moves=0;
let interval;
let isStart=false
let lowestScore=JSON.parse(localStorage.getItem('bestscore')) || null
bestscoreContainer.innerHTML=`YOUR BEST SCORE: ${lowestScore}`


function startTimer(){
    interval= setInterval(function(){
        timerContainer.innerHTML='TIME: ' + minute+' mins '+second +' secs'
        second++
        if(second==60){
            minute++
        }
    },1000)
}

function randomColor(){
    let r=Math.floor(Math.random()*256)
    let g=Math.floor(Math.random()*256)
    let b=Math.floor(Math.random()*256)
    let newcolor=`rgb(${r},${g},${b})`
    return newcolor;
}


function buildTile(color){
    const tile=document.createElement('div')
    tile.classList.add('tile')
    tile.setAttribute('data-color',color)
    tile.setAttribute('data-revealed','false')
    
    tile.addEventListener('click',function(){
       if(isStart==false){
        return;
       }
      moves++
        moveContainer.innerHTML=`MOVES COUNT:${moves}`
        if(awaitingEndOfMove==true||activeTile==tile||tile.getAttribute('data-revealed')=='true'){
            return;
        }
        tile.style.backgroundColor=color
        if(!activeTile){
            activeTile=tile
            return
        }
        if(activeTile.getAttribute('data-color')==tile.getAttribute('data-color')){
            revealedCount+=2
            activeTile.setAttribute('data-revealed','true')
            tile.setAttribute('data-revealed','true')
            activeTile=null
            awaitingEndOfMove=false
            if(revealedCount==tileCount){
                alert("YOU WIN")
                clearInterval(interval)
                if(lowestScore==null){
                    lowestScore=moves
                    localStorage.setItem('bestscore',JSON.stringify(lowestScore))
                }
                
                else if(moves<lowestScore){
                    lowestScore=moves
                    localStorage.setItem('bestscore',JSON.stringify(lowestScore))
                }
               
               
            }
            return
            
        }
        awaitingEndOfMove=true
        setTimeout(function(){
            activeTile.style.backgroundColor=null
            tile.style.backgroundColor=null
            activeTile=null
            awaitingEndOfMove=false
        },1000)
        
    })
    return tile;
}
for(let i=0;i<tileCount;i++){
    const randomIndex=Math.floor(Math.random()*colorPickList.length)
    let color= colorPickList[randomIndex]
    colorPickList.splice(randomIndex,1)
    let tile=buildTile(color)
    tilesContainer.appendChild(tile)
 
}

startbtn.addEventListener('click',function(){
  isStart=true;
  startbtn.classList.add('hide')
  restartbtn.classList.remove('hide')
  startTimer()
})
restartbtn.addEventListener('click',function(){
    window.location.reload()
    startbtn.classList.add('hide')
    restartbtn.classList.remove('hide')
  
})
