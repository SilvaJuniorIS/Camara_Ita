window.SimulationsData=[10,20,40,60,100].map((count,index)=>({
  id:index+1,title:`Modo VUNESP — ${count} questões`,count,duration:Math.round(count*2.5),
  description:'Tempo real, correção automática e resultado salvo no ranking local.',
  mode:'VUNESP',realTime:true,automaticCorrection:true,ranking:'local'
}));
